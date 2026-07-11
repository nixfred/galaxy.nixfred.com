// Shared types for the graph module (docs/ARCHITECTURE.md section 3).
// SceneNode/SceneEdge/SceneSector mirror the generated graph artifact served
// at /graph.json (docs/DATA_MODEL.md section 9, docs/ARCHITECTURE.md
// section 5): the client scene cannot run merge.ts/layout.ts itself, so it
// fetches the same build-time output the SSG pages consumed directly.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface SceneSector {
  id: string;
  label: string;
  mapLabel: string;
  colorToken: string;
  anchorPosition: Vec3;
  order: number;
}

export interface SceneNode {
  slug: string;
  title: string;
  url: string;
  desc: string;
  sector: string;
  featured: boolean;
  anchor: boolean;
  weight: number;
  status?: string | undefined;
  position: Vec3;
}

export interface SceneEdge {
  source: string;
  target: string;
  type: string;
  strength: number;
  reason: string;
  provenance: string;
}

export interface GalaxyGraph {
  catalogRevision: string;
  generatedAt: string;
  nodes: SceneNode[];
  edges: SceneEdge[];
  sectors: SceneSector[];
}

// Adaptive quality (docs/warroom/02_WEBGL_CRAFT.md section 8, BD36-BD37).
export type QualityTier = 'desktop-high' | 'desktop-low' | 'mobile';

export interface QualitySettings {
  tier: QualityTier;
  dprCap: number;
  ambientCount: number;
  nebulaFidelity: 'fbm' | 'gradient';
  lineSignals: boolean;
}

// Controller events. Phase 3a wires these to a minimal HTML readout line;
// Phase 3b consumes the same events for the full ProjectPanel/MobileProjectSheet.
export interface HoverChange {
  slug: string | null;
}

export interface SelectChange {
  slug: string | null;
}

export type FallbackReason = 'unsupported' | 'context-lost' | 'init-error';
