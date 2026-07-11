// Hovered/selected node state (docs/ARCHITECTURE.md section 3: "Tracks
// hovered and selected node state inside the scene graph and raises the
// events the controller and store consume"). Raycasts a dedicated invisible
// hit-target InstancedMesh, never the small visible star cores (BD35, craft
// doc section 7). Hover is throttled to at most once per animation frame and
// only when the pointer moved since the previous sample.
import {
  Raycaster,
  Vector2,
  type PerspectiveCamera,
  type InstancedMesh,
} from 'three';
import type { SceneNode, HoverChange, SelectChange } from './types';

export interface SelectionController {
  /** Call on pointer move with normalized device coordinates (-1..1). Only
   * actually raycasts once per animation frame via poll(). */
  setPointerNdc: (x: number, y: number) => void;
  clearPointer: () => void;
  /** Raycast at most once per frame; call from the render loop. Returns true
   * if the hover target changed. */
  poll: () => boolean;
  selectByIndex: (index: number | null) => void;
  selectBySlug: (slug: string | null) => void;
  getHoveredSlug: () => string | null;
  getSelectedSlug: () => string | null;
  onHoverChange: (cb: (change: HoverChange) => void) => () => void;
  onSelectChange: (cb: (change: SelectChange) => void) => () => void;
}

export function createSelectionController(
  camera: PerspectiveCamera,
  hitProxies: InstancedMesh,
  nodes: SceneNode[],
): SelectionController {
  const raycaster = new Raycaster();
  const ndc = new Vector2();
  let hasPointer = false;
  let pointerDirty = false;

  let hoveredIndex: number | null = null;
  let selectedIndex: number | null = null;

  const hoverListeners = new Set<(change: HoverChange) => void>();
  const selectListeners = new Set<(change: SelectChange) => void>();

  function indexToSlug(index: number | null): string | null {
    if (index === null) return null;
    return nodes[index]?.slug ?? null;
  }

  function emitHover(): void {
    const change: HoverChange = { slug: indexToSlug(hoveredIndex) };
    for (const cb of hoverListeners) cb(change);
  }

  function emitSelect(): void {
    const change: SelectChange = { slug: indexToSlug(selectedIndex) };
    for (const cb of selectListeners) cb(change);
  }

  function raycastIndex(): number | null {
    raycaster.setFromCamera(ndc, camera);
    const hits = raycaster.intersectObject(hitProxies, false);
    const first = hits[0];
    if (!first || first.instanceId === undefined) return null;
    return first.instanceId;
  }

  return {
    setPointerNdc(x: number, y: number) {
      ndc.set(x, y);
      hasPointer = true;
      pointerDirty = true;
    },
    clearPointer() {
      hasPointer = false;
      pointerDirty = false;
      if (hoveredIndex !== null) {
        hoveredIndex = null;
        emitHover();
      }
    },
    poll(): boolean {
      if (!hasPointer || !pointerDirty) return false;
      pointerDirty = false;
      const index = raycastIndex();
      if (index !== hoveredIndex) {
        hoveredIndex = index;
        emitHover();
        return true;
      }
      return false;
    },
    selectByIndex(index: number | null) {
      if (index === selectedIndex) return;
      selectedIndex = index;
      emitSelect();
    },
    selectBySlug(slug: string | null) {
      if (slug === null) {
        this.selectByIndex(null);
        return;
      }
      const index = nodes.findIndex((n) => n.slug === slug);
      this.selectByIndex(index === -1 ? null : index);
    },
    getHoveredSlug: () => indexToSlug(hoveredIndex),
    getSelectedSlug: () => indexToSlug(selectedIndex),
    onHoverChange(cb) {
      hoverListeners.add(cb);
      return () => hoverListeners.delete(cb);
    },
    onSelectChange(cb) {
      selectListeners.add(cb);
      return () => selectListeners.delete(cb);
    },
  };
}
