// Star rendering (docs/warroom/02_WEBGL_CRAFT.md section 1, docs/DESIGN_BIBLE.md
// BD28-BD30, BD35). Two populations, two techniques, deliberately not sharing
// a code path:
//   - Ambient field: THREE.Points, cheap, never picked, thousands of tiny
//     background particles that sell depth and drift.
//   - Project stars: one InstancedMesh of billboarded quads with per-instance
//     attributes, procedural disc+halo in the fragment shader, no textures.
// A third, invisible InstancedMesh of generous hit proxies is what picking
// actually raycasts against (BD35), never the small visible cores.
import {
  BufferGeometry,
  Float32BufferAttribute,
  InstancedMesh,
  InstancedBufferAttribute,
  Points,
  PlaneGeometry,
  ShaderMaterial,
  AdditiveBlending,
  MeshBasicMaterial,
  Object3D,
  Color,
} from 'three';
import type { SceneNode, SceneSector } from './types';
import type { SectorColor } from './palette';

const dummy = new Object3D();

// Star size in world units: anchors read clearly larger, per BD46's star
// anatomy and FR009 (size encodes editorial importance only).
function sizeFor(node: SceneNode): number {
  return node.anchor ? 3.2 : 1.1 + node.weight * 1.4;
}

// Brightness/energy encodes status only (FR010): archived work stays visible
// but visually quiet, never disappears.
function energyFor(node: SceneNode): number {
  if (node.status === 'archived') return 0.35;
  if (node.status === 'memorial') return 0.3;
  return 0.85 + node.weight * 0.15;
}

export interface StarField {
  ambient: Points;
  stars: InstancedMesh;
  hitProxies: InstancedMesh;
  /** World position lookup, index-aligned with `stars`/`hitProxies`. */
  nodeAt: (instanceId: number) => SceneNode | undefined;
  setEnergyOverride: (index: number, energy: number) => void;
  resetEnergyOverrides: () => void;
  setPulseEnabled: (enabled: boolean) => void;
  /** Drive the entrance choreography. `progress` is 0..1 through the
   * ignition window; pass 1 to skip straight to fully lit (reduced motion,
   * repeat visits). Zero per-frame allocation: only writes a uniform. */
  setIgnitionProgress: (progress: number) => void;
  setPixelRatio: (ratio: number) => void;
  update: (delta: number, elapsed: number) => void;
  dispose: () => void;
}

const STAR_VERTEX = /* glsl */ `
  attribute vec3 aInstancePosition;
  attribute vec3 aColor;
  attribute float aSize;
  attribute float aPulsePhase;
  attribute float aEnergy;
  attribute float aAnchor;
  attribute float aIgnitionDelay;

  uniform float uTime;
  uniform float uPulseEnabled;
  uniform float uIgnitionProgress; // 0..1 through the entrance window

  varying vec3 vColor;
  varying vec2 vUv;
  varying float vEnergy;
  varying float vAnchor;

  void main() {
    vUv = uv;
    vColor = aColor;
    vAnchor = aAnchor;

    float ignite = smoothstep(aIgnitionDelay, aIgnitionDelay + 0.12, uIgnitionProgress);
    vEnergy = aEnergy * ignite;

    float pulse = 1.0;
    if (uPulseEnabled > 0.5) {
      pulse = 1.0 + 0.14 * aAnchor * sin(uTime * 1.4 + aPulsePhase)
            + 0.06 * (1.0 - aAnchor) * sin(uTime * 2.1 + aPulsePhase);
    }
    // Stars grow in slightly as they ignite rather than popping to full size.
    float igniteScale = mix(0.4, 1.0, ignite);

    vec4 mvPosition = modelViewMatrix * vec4(aInstancePosition, 1.0);
    mvPosition.xy += position.xy * aSize * pulse * igniteScale;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const STAR_FRAGMENT = /* glsl */ `
  varying vec3 vColor;
  varying vec2 vUv;
  varying float vEnergy;
  varying float vAnchor;

  void main() {
    vec2 centered = vUv - 0.5;
    float r = length(centered) * 2.0;
    float aa = fwidth(r);

    float coreR = 0.24;
    float core = 1.0 - smoothstep(coreR - aa, coreR + aa, r);

    float haloFalloff = mix(3.4, 2.2, vAnchor);
    float halo = pow(clamp(1.0 - r, 0.0, 1.0), haloFalloff);

    float coreGain = 0.8;
    float haloGain = mix(0.32, 0.55, vAnchor);

    float e = clamp(vEnergy, 0.0, 1.0);
    vec3 c = vColor * (core * coreGain + halo * haloGain) * mix(0.4, 1.0, e);
    float alpha = clamp(core + halo * 0.65, 0.0, 1.0) * e;
    if (alpha < 0.003) discard;
    gl_FragColor = vec4(c, alpha);
  }
`;

const AMBIENT_VERTEX = /* glsl */ `
  attribute float aSize;
  uniform float uTime;
  uniform float uPixelRatio;
  varying float vTwinkle;

  void main() {
    vTwinkle = 0.6 + 0.4 * sin(uTime * 0.35 + position.x * 0.6 + position.z * 0.4);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * uPixelRatio * (140.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const AMBIENT_FRAGMENT = /* glsl */ `
  varying float vTwinkle;
  void main() {
    vec2 centered = gl_PointCoord - 0.5;
    float r = length(centered) * 2.0;
    float alpha = (1.0 - smoothstep(0.0, 1.0, r)) * 0.5 * vTwinkle;
    if (alpha < 0.01) discard;
    gl_FragColor = vec4(vec3(0.75, 0.82, 0.92), alpha);
  }
`;

function buildAmbientField(count: number): Points {
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  // Deterministic-enough scatter for a decorative, non-interactive swarm; a
  // fixed local seed keeps repeated builds visually stable without pulling
  // in the catalog's seeded RNG (this population carries no meaning per
  // node, so it is not part of FR006's determinism contract).
  let seed = 1337;
  const rand = (): number => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
  for (let i = 0; i < count; i++) {
    const radius = 40 + rand() * 130;
    const angle = rand() * Math.PI * 2;
    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = (rand() - 0.5) * 60;
    positions[i * 3 + 2] = Math.sin(angle) * radius;
    sizes[i] = 0.6 + rand() * 1.4;
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
  geometry.setAttribute('aSize', new Float32BufferAttribute(sizes, 1));

  const material = new ShaderMaterial({
    vertexShader: AMBIENT_VERTEX,
    fragmentShader: AMBIENT_FRAGMENT,
    uniforms: {
      uTime: { value: 0 },
      uPixelRatio: { value: 1 },
    },
    transparent: true,
    depthWrite: false,
    depthTest: true,
    blending: AdditiveBlending,
  });

  const points = new Points(geometry, material);
  points.frustumCulled = false;
  points.renderOrder = -1;
  return points;
}

// Ignition order (ART_DIRECTION.md "the ignition"): sector order first, then
// distance from the galaxy origin within a sector, so structure reveals
// itself core-outward rather than in catalog/insertion order. The NIXFRED
// core hub itself is a separate scene element outside this Phase 3a module
// (BD47, deferred with the About panel it opens); nodes closest to the
// origin stand in as "center first" until that hub lands.
function computeIgnitionDelays(
  nodes: SceneNode[],
  sectorOrder: Map<string, number>,
): Float32Array {
  const rank = nodes.map((node, index) => {
    const order = sectorOrder.get(node.sector) ?? 99;
    const dist = Math.hypot(node.position.x, node.position.z);
    return { index, order, dist };
  });
  rank.sort((a, b) => a.order - b.order || a.dist - b.dist);

  const delays = new Float32Array(nodes.length);
  const span = 0.88; // leaves room for the 0.12 fade-in window to reach 1.0
  for (let i = 0; i < rank.length; i++) {
    const t = rank.length > 1 ? i / (rank.length - 1) : 0;
    delays[rank[i]!.index] = t * span;
  }
  return delays;
}

export function buildStarField(
  nodes: SceneNode[],
  sectors: SceneSector[],
  palette: Map<string, SectorColor>,
  ambientCount: number,
): StarField {
  const count = nodes.length;
  const sectorOrder = new Map(sectors.map((s) => [s.id, s.order]));
  const ignitionDelays = computeIgnitionDelays(nodes, sectorOrder);

  const geometry = new PlaneGeometry(1, 1);
  const instancePosition = new Float32Array(count * 3);
  const colorAttr = new Float32Array(count * 3);
  const sizeAttr = new Float32Array(count);
  const phaseAttr = new Float32Array(count);
  const energyAttr = new Float32Array(count);
  const anchorAttr = new Float32Array(count);
  const baseEnergy = new Float32Array(count);

  const tmpColor = new Color();
  for (let i = 0; i < count; i++) {
    const node = nodes[i]!;
    instancePosition[i * 3] = node.position.x;
    instancePosition[i * 3 + 1] = node.position.y;
    instancePosition[i * 3 + 2] = node.position.z;

    const sector = palette.get(node.sector);
    tmpColor.copy(sector?.core ?? new Color('#38bdf8'));
    colorAttr[i * 3] = tmpColor.r;
    colorAttr[i * 3 + 1] = tmpColor.g;
    colorAttr[i * 3 + 2] = tmpColor.b;

    sizeAttr[i] = sizeFor(node);
    phaseAttr[i] = (i * 2.399963) % (Math.PI * 2); // golden-angle spread, deterministic
    const e = energyFor(node);
    energyAttr[i] = e;
    baseEnergy[i] = e;
    anchorAttr[i] = node.anchor ? 1 : 0;
  }

  geometry.setAttribute(
    'aInstancePosition',
    new InstancedBufferAttribute(instancePosition, 3),
  );
  geometry.setAttribute('aColor', new InstancedBufferAttribute(colorAttr, 3));
  geometry.setAttribute('aSize', new InstancedBufferAttribute(sizeAttr, 1));
  geometry.setAttribute(
    'aPulsePhase',
    new InstancedBufferAttribute(phaseAttr, 1),
  );
  geometry.setAttribute('aEnergy', new InstancedBufferAttribute(energyAttr, 1));
  geometry.setAttribute('aAnchor', new InstancedBufferAttribute(anchorAttr, 1));
  geometry.setAttribute(
    'aIgnitionDelay',
    new InstancedBufferAttribute(ignitionDelays, 1),
  );

  const material = new ShaderMaterial({
    vertexShader: STAR_VERTEX,
    fragmentShader: STAR_FRAGMENT,
    uniforms: {
      uTime: { value: 0 },
      uPulseEnabled: { value: 1 },
      uIgnitionProgress: { value: 1 },
    },
    transparent: true,
    depthWrite: false,
    depthTest: true,
    blending: AdditiveBlending,
  });
  // fwidth() for resolution-independent AA (craft doc section 1) is core in
  // WebGL2, which is the renderer's preferred context (docs/ARCHITECTURE.md
  // section 8); no WebGL1 derivatives extension flag is needed in this
  // three.js version.

  const stars = new InstancedMesh(geometry, material, count);
  stars.frustumCulled = false;
  for (let i = 0; i < count; i++) {
    dummy.position.set(0, 0, 0);
    dummy.updateMatrix();
    stars.setMatrixAt(i, dummy.matrix);
  }
  stars.instanceMatrix.needsUpdate = true;

  // Invisible, generous hit proxies (BD35): colorWrite/depthWrite false so
  // they render nothing but remain raycastable. Radius ~2.6x the visual core,
  // with a floor so small satellites stay easy to select.
  const hitGeometry = new PlaneGeometry(1, 1);
  const hitMaterial = new MeshBasicMaterial({
    colorWrite: false,
    depthWrite: false,
    transparent: true,
  });
  const hitProxies = new InstancedMesh(hitGeometry, hitMaterial, count);
  hitProxies.frustumCulled = false;
  const hitDummy = new Object3D();
  for (let i = 0; i < count; i++) {
    const node = nodes[i]!;
    const hitSize = Math.max(sizeFor(node) * 2.6, 3.2);
    hitDummy.position.set(node.position.x, node.position.y, node.position.z);
    hitDummy.scale.set(hitSize, hitSize, 1);
    hitDummy.updateMatrix();
    hitProxies.setMatrixAt(i, hitDummy.matrix);
  }
  hitProxies.instanceMatrix.needsUpdate = true;

  const ambient = buildAmbientField(ambientCount);

  return {
    ambient,
    stars,
    hitProxies,
    nodeAt: (instanceId: number) => nodes[instanceId],
    setEnergyOverride(index: number, energy: number) {
      const attr = geometry.getAttribute('aEnergy') as InstancedBufferAttribute;
      attr.setX(index, energy);
      attr.needsUpdate = true;
    },
    resetEnergyOverrides() {
      const attr = geometry.getAttribute('aEnergy') as InstancedBufferAttribute;
      for (let i = 0; i < count; i++) attr.setX(i, baseEnergy[i]!);
      attr.needsUpdate = true;
    },
    setPulseEnabled(enabled: boolean) {
      material.uniforms.uPulseEnabled!.value = enabled ? 1 : 0;
    },
    setIgnitionProgress(progress: number) {
      material.uniforms.uIgnitionProgress!.value = progress;
    },
    setPixelRatio(ratio: number) {
      (ambient.material as ShaderMaterial).uniforms.uPixelRatio!.value = ratio;
    },
    update(_delta: number, elapsed: number) {
      material.uniforms.uTime!.value = elapsed;
      (ambient.material as ShaderMaterial).uniforms.uTime!.value = elapsed;
    },
    dispose() {
      geometry.dispose();
      material.dispose();
      hitGeometry.dispose();
      hitMaterial.dispose();
      ambient.geometry.dispose();
      (ambient.material as ShaderMaterial).dispose();
    },
  };
}
