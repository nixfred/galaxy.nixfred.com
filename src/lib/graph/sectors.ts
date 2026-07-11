// Sector atmosphere (docs/warroom/02_WEBGL_CRAFT.md section 3, BD32, BD40).
// One soft additive quad per sector, laid flat in the ground plane (the rig
// stays near top-down within its pitch clamp, so a billboard is unnecessary
// cost). fbm from a single runtime-generated noise DataTexture on desktop
// high; a plain radial gradient (no texture fetch) on lower tiers, toggled
// by a uniform so quality step-downs never rebuild geometry. The negative
// space between sectors stays empty by construction (BD40): each quad is
// sized to its own sector's node spread, never large enough to bleed into
// the next.
import {
  BufferGeometry,
  Color,
  DataTexture,
  RedFormat,
  UnsignedByteType,
  LinearFilter,
  RepeatWrapping,
  Mesh,
  PlaneGeometry,
  ShaderMaterial,
  Group,
  type Texture,
} from 'three';
import type { SceneSector } from './types';
import type { SectorColor } from './palette';

// One quad per sector, sized to comfortably cover the seeded scatter radius
// in layout.ts (spread up to 20, plus sector-to-sector clearance).
const QUAD_RADIUS = 26;
const NOISE_SIZE = 256;

function buildNoiseTexture(): Texture {
  const size = NOISE_SIZE * NOISE_SIZE;
  const data = new Uint8Array(size);
  // Cheap value noise: a handful of random lattice points, bilinearly
  // blended by distance. Generated once at init, a few milliseconds, no
  // network asset, no CSP image-src exception needed (craft doc section 3).
  const latticeN = 24;
  const lattice = new Float32Array(latticeN * latticeN);
  let seed = 90813;
  const rand = (): number => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
  for (let i = 0; i < lattice.length; i++) lattice[i] = rand();

  for (let y = 0; y < NOISE_SIZE; y++) {
    for (let x = 0; x < NOISE_SIZE; x++) {
      const u = (x / NOISE_SIZE) * latticeN;
      const v = (y / NOISE_SIZE) * latticeN;
      const x0 = Math.floor(u) % latticeN;
      const y0 = Math.floor(v) % latticeN;
      const x1 = (x0 + 1) % latticeN;
      const y1 = (y0 + 1) % latticeN;
      const fx = u - Math.floor(u);
      const fy = v - Math.floor(v);
      const a = lattice[y0 * latticeN + x0]!;
      const b = lattice[y0 * latticeN + x1]!;
      const c = lattice[y1 * latticeN + x0]!;
      const d = lattice[y1 * latticeN + x1]!;
      const top = a + (b - a) * fx;
      const bottom = c + (d - c) * fx;
      const value = top + (bottom - top) * fy;
      data[y * NOISE_SIZE + x] = Math.floor(value * 255);
    }
  }

  const texture = new DataTexture(
    data,
    NOISE_SIZE,
    NOISE_SIZE,
    RedFormat,
    UnsignedByteType,
  );
  texture.minFilter = LinearFilter;
  texture.magFilter = LinearFilter;
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.needsUpdate = true;
  return texture;
}

const SECTOR_VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const SECTOR_FRAGMENT = /* glsl */ `
  uniform vec3 uColor;
  uniform float uTime;
  uniform float uUseNoise;
  uniform float uPeakAlpha;
  uniform sampler2D uNoise;
  varying vec2 vUv;

  void main() {
    vec2 centered = vUv - 0.5;
    float r = length(centered) * 2.0;
    float mask = 1.0 - smoothstep(0.5, 1.0, r);
    if (mask <= 0.0) discard;

    float fbm = 1.0;
    if (uUseNoise > 0.5) {
      vec2 uvA = vUv * 1.6 + vec2(uTime * 0.010, uTime * 0.006);
      vec2 uvB = vUv * 3.1 + vec2(-uTime * 0.014, uTime * 0.009);
      vec2 uvC = vUv * 6.0 + vec2(uTime * 0.006, -uTime * 0.011);
      float n = texture2D(uNoise, uvA).r * 0.5
              + texture2D(uNoise, uvB).r * 0.3
              + texture2D(uNoise, uvC).r * 0.2;
      fbm = 0.5 + n * 0.9;
    }

    float alpha = mask * fbm * uPeakAlpha;
    gl_FragColor = vec4(uColor, alpha);
  }
`;

export interface SectorAtmosphere {
  group: Group;
  setNebulaFidelity: (fidelity: 'fbm' | 'gradient') => void;
  update: (delta: number, elapsed: number) => void;
  dispose: () => void;
}

export function buildSectorAtmosphere(
  sectors: SceneSector[],
  palette: Map<string, SectorColor>,
): SectorAtmosphere {
  const group = new Group();
  const noiseTexture = buildNoiseTexture();
  const materials: ShaderMaterial[] = [];
  const geometries: BufferGeometry[] = [];

  for (const sector of sectors) {
    const color = palette.get(sector.id)?.halo;
    const geometry = new PlaneGeometry(QUAD_RADIUS * 2, QUAD_RADIUS * 2, 1, 1);
    geometry.rotateX(-Math.PI / 2); // lie flat in the ground plane
    geometries.push(geometry);

    const material = new ShaderMaterial({
      vertexShader: SECTOR_VERTEX,
      fragmentShader: SECTOR_FRAGMENT,
      uniforms: {
        uColor: { value: color ?? new Color('#38bdf8') },
        uTime: { value: 0 },
        uUseNoise: { value: 1 },
        // BD32: alpha capped 0.03-0.10, sector-hued, restrained atmosphere.
        uPeakAlpha: { value: sector.id === 'personal' ? 0.045 : 0.08 },
        uNoise: { value: noiseTexture },
      },
      transparent: true,
      depthWrite: false,
      depthTest: true,
    });
    materials.push(material);

    const mesh = new Mesh(geometry, material);
    mesh.position.set(
      sector.anchorPosition.x,
      sector.anchorPosition.y - 0.05,
      sector.anchorPosition.z,
    );
    mesh.renderOrder = -2; // rendered before stars (craft doc section 3)
    mesh.frustumCulled = false;
    group.add(mesh);
  }

  return {
    group,
    setNebulaFidelity(fidelity: 'fbm' | 'gradient') {
      const useNoise = fidelity === 'fbm' ? 1 : 0;
      for (const m of materials) m.uniforms.uUseNoise!.value = useNoise;
    },
    update(_delta: number, elapsed: number) {
      for (const m of materials) m.uniforms.uTime!.value = elapsed;
    },
    dispose() {
      for (const g of geometries) g.dispose();
      for (const m of materials) m.dispose();
      noiseTexture.dispose();
    },
  };
}
