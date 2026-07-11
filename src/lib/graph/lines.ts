// Relationship lines (docs/warroom/02_WEBGL_CRAFT.md section 4, BD25, BD31).
// Line2/LineMaterial, never native THREE.Line (1px, aliased, ignores
// linewidth on most drivers). Every edge is a static, curved, sector-tinted
// line at rest; manually curated relationships render brighter and wider
// than inferred ones (FR037). The traveling signal is a small pooled
// additive sprite ridden along the curve via curve.getPointAt(t): LineMaterial
// is a versioned three.js addon whose internal fragment shader chunks are
// not a public API to patch via onBeforeCompile, so a pooled sprite (craft
// doc section 4's "rare hero moment" mechanism) is the robust choice here,
// reused for the default active-signal case too. Signal travel is restricted
// to the selected node's direct edges (BD25); everything else stays a
// static faint line. Tour/compare route illumination is Phase 3b/4 scope.
import {
  CatmullRomCurve3,
  Vector3,
  Group,
  Mesh,
  PlaneGeometry,
  ShaderMaterial,
  AdditiveBlending,
  Color,
} from 'three';
import { Line2 } from 'three/examples/jsm/lines/Line2.js';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import type { SceneEdge, SceneNode } from './types';
import type { SectorColor } from './palette';

const CURVE_SAMPLES = 28;
const SIGNAL_POOL_SIZE = 8;
const SIGNAL_SPEED = 0.35; // full-length traversals per second

interface BuiltEdge {
  edge: SceneEdge;
  curve: CatmullRomCurve3;
  line: Line2;
  material: LineMaterial;
}

// A single small additive quad, billboarded by the same view-space-offset
// technique as the star shader (nodes.ts), riding one active edge's curve.
const SIGNAL_VERTEX = /* glsl */ `
  uniform float uSize;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec4 mvPosition = modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0);
    mvPosition.xy += position.xy * uSize;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const SIGNAL_FRAGMENT = /* glsl */ `
  uniform vec3 uColor;
  varying vec2 vUv;
  void main() {
    vec2 centered = vUv - 0.5;
    float r = length(centered) * 2.0;
    float core = 1.0 - smoothstep(0.0, 0.55, r);
    float halo = pow(clamp(1.0 - r, 0.0, 1.0), 2.5);
    float alpha = clamp(core * 0.9 + halo * 0.5, 0.0, 1.0);
    if (alpha < 0.01) discard;
    gl_FragColor = vec4(uColor, alpha);
  }
`;

interface SignalSlot {
  mesh: Mesh;
  material: ShaderMaterial;
}

function buildSignalPool(): { slots: SignalSlot[]; geometry: PlaneGeometry } {
  const geometry = new PlaneGeometry(1, 1);
  const slots: SignalSlot[] = [];
  for (let i = 0; i < SIGNAL_POOL_SIZE; i++) {
    const material = new ShaderMaterial({
      vertexShader: SIGNAL_VERTEX,
      fragmentShader: SIGNAL_FRAGMENT,
      uniforms: {
        uColor: { value: new Color('#38bdf8') },
        uSize: { value: 1.3 },
      },
      transparent: true,
      depthWrite: false,
      depthTest: true,
      blending: AdditiveBlending,
    });
    const mesh = new Mesh(geometry, material);
    mesh.visible = false;
    mesh.frustumCulled = false;
    mesh.renderOrder = 1;
    slots.push({ mesh, material });
  }
  return { slots, geometry };
}

function edgeOpacity(edge: SceneEdge): number {
  const manual = edge.provenance === 'manual' || edge.provenance === 'fred';
  return manual ? 0.55 : 0.18;
}

// Screen-space pixel width (LineMaterial's default worldUnits: false), so
// line weight reads consistently regardless of camera distance.
function edgeWidth(edge: SceneEdge): number {
  const manual = edge.provenance === 'manual' || edge.provenance === 'fred';
  return manual ? 2 : 1;
}

export interface RelationshipLines {
  group: Group;
  update: (delta: number, elapsed: number) => void;
  /** Signal travel runs only on this node's direct edges (BD25). Pass null
   * to clear on deselection. */
  setActiveNode: (slug: string | null) => void;
  setSignalsEnabled: (enabled: boolean) => void;
  resize: (width: number, height: number) => void;
  dispose: () => void;
}

export function buildRelationshipLines(
  edges: SceneEdge[],
  nodesBySlug: Map<string, SceneNode>,
  palette: Map<string, SectorColor>,
): RelationshipLines {
  const group = new Group();
  const built: BuiltEdge[] = [];
  const geometries: LineGeometry[] = [];
  const materials: LineMaterial[] = [];
  const midpoint = new Vector3();

  for (const edge of edges) {
    const source = nodesBySlug.get(edge.source);
    const target = nodesBySlug.get(edge.target);
    if (!source || !target) continue; // validate-graph.ts already gates this at CI

    const from = new Vector3(
      source.position.x,
      source.position.y,
      source.position.z,
    );
    const to = new Vector3(
      target.position.x,
      target.position.y,
      target.position.z,
    );
    midpoint.copy(from).add(to).multiplyScalar(0.5);
    midpoint.y += 3.5; // gentle arc: "a navigation computer solving a route"

    const curve = new CatmullRomCurve3(
      [from, midpoint, to],
      false,
      'catmullrom',
      0.5,
    );
    const points = curve.getPoints(CURVE_SAMPLES);
    const positions: number[] = [];
    for (const p of points) positions.push(p.x, p.y, p.z);

    const geometry = new LineGeometry();
    geometry.setPositions(positions);
    geometries.push(geometry);

    const tint = palette.get(source.sector)?.core ?? new Color('#38bdf8');
    const material = new LineMaterial({
      color: tint.getHex(),
      linewidth: edgeWidth(edge),
      transparent: true,
      opacity: edgeOpacity(edge),
      worldUnits: false,
      depthWrite: false,
    });
    materials.push(material);

    const line = new Line2(geometry, material);
    line.computeLineDistances();
    line.frustumCulled = false;
    group.add(line);

    built.push({ edge, curve, line, material });
  }

  const { slots: signalPool, geometry: signalGeometry } = buildSignalPool();
  for (const slot of signalPool) group.add(slot.mesh);

  let activeEdges: BuiltEdge[] = [];
  let signalsEnabled = true;
  const phaseOffsets = signalPool.map((_, i) => i / SIGNAL_POOL_SIZE);
  const point = new Vector3();

  return {
    group,
    setActiveNode(slug: string | null) {
      if (!slug) {
        activeEdges = [];
      } else {
        activeEdges = built
          .filter((b) => b.edge.source === slug || b.edge.target === slug)
          .slice(0, SIGNAL_POOL_SIZE);
      }
      for (const slot of signalPool) slot.mesh.visible = false;
    },
    setSignalsEnabled(enabled: boolean) {
      signalsEnabled = enabled;
      if (!enabled) for (const slot of signalPool) slot.mesh.visible = false;
    },
    update(_delta: number, elapsed: number) {
      if (!signalsEnabled || activeEdges.length === 0) {
        for (const slot of signalPool) slot.mesh.visible = false;
        return;
      }
      for (let i = 0; i < signalPool.length; i++) {
        const slot = signalPool[i]!;
        const active = activeEdges[i];
        if (!active) {
          slot.mesh.visible = false;
          continue;
        }
        const t = (elapsed * SIGNAL_SPEED + phaseOffsets[i]!) % 1;
        active.curve.getPointAt(t, point);
        slot.mesh.position.copy(point);
        slot.material.uniforms.uColor!.value.copy(
          palette.get(nodesBySlug.get(active.edge.source)?.sector ?? 'work')
            ?.core ?? slot.material.uniforms.uColor!.value,
        );
        slot.mesh.visible = true;
      }
    },
    resize(width: number, height: number) {
      for (const m of materials) m.resolution.set(width, height);
    },
    dispose() {
      for (const g of geometries) g.dispose();
      for (const m of materials) m.dispose();
      signalGeometry.dispose();
      for (const slot of signalPool) slot.material.dispose();
    },
  };
}
