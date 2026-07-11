// HTML overlay labels (docs/warroom/02_WEBGL_CRAFT.md section 6, BD34). Real
// text in a DOM layer above the canvas, not SDF in-scene text: crisp at any
// zoom/DPR, in the accessibility tree's mirror already (the accessible star
// list is the real interface; this layer is a decorative, aria-hidden visual
// echo positioned over the canvas). Anchor stars stay always-on; minor stars
// reveal only on hover/selection. Updates are transform-only writes, never
// touching top/left/width, so there is no layout reflow thrash.
import type { PerspectiveCamera, Vector3 } from 'three';
import { Vector3 as Vector3Impl } from 'three';
import type { SceneNode } from './types';

interface LabelEntry {
  node: SceneNode;
  el: HTMLDivElement;
  world: Vector3;
}

export interface LabelLayer {
  container: HTMLDivElement;
  setHovered: (slug: string | null) => void;
  setSelected: (slug: string | null) => void;
  setFilteredOut: (slugs: Set<string> | null) => void;
  update: (camera: PerspectiveCamera, width: number, height: number) => void;
  dispose: () => void;
}

// Coarse collision grid: bucket size in CSS pixels. Cheap O(n) pass at the
// 30-100 node scale this product ships at (craft doc section 6).
const GRID_CELL = 26;

export function buildLabelLayer(nodes: SceneNode[]): LabelLayer {
  const container = document.createElement('div');
  container.className = 'galaxy-labels';
  container.setAttribute('aria-hidden', 'true');

  const entries: LabelEntry[] = [];
  for (const node of nodes) {
    const el = document.createElement('div');
    el.className = node.anchor
      ? 'galaxy-label galaxy-label--anchor'
      : 'galaxy-label';
    el.textContent = node.title;
    el.dataset.slug = node.slug;
    el.style.display = 'none';
    container.appendChild(el);
    entries.push({
      node,
      el,
      world: new Vector3Impl(node.position.x, node.position.y, node.position.z),
    });
  }

  // Anchors win collision priority (ART_DIRECTION.md label hierarchy):
  // process them first so their grid cells are claimed before minor labels.
  entries.sort((a, b) => Number(b.node.anchor) - Number(a.node.anchor));

  let hoveredSlug: string | null = null;
  let selectedSlug: string | null = null;
  let filteredOut: Set<string> | null = null;
  const projected = new Vector3Impl();
  const occupied = new Set<string>();

  return {
    container,
    setHovered(slug: string | null) {
      hoveredSlug = slug;
    },
    setSelected(slug: string | null) {
      selectedSlug = slug;
    },
    setFilteredOut(slugs: Set<string> | null) {
      filteredOut = slugs;
    },
    update(camera: PerspectiveCamera, width: number, height: number) {
      occupied.clear();
      for (const entry of entries) {
        if (filteredOut?.has(entry.node.slug)) {
          entry.el.style.display = 'none';
          continue;
        }
        const isAnchor = entry.node.anchor;
        const isHovered = entry.node.slug === hoveredSlug;
        const isSelected = entry.node.slug === selectedSlug;
        const shouldShow = isAnchor || isHovered || isSelected;
        if (!shouldShow) {
          entry.el.style.display = 'none';
          continue;
        }

        projected.copy(entry.world).project(camera);
        if (projected.z > 1 || projected.z < -1) {
          entry.el.style.display = 'none';
          continue;
        }

        const x = (projected.x * 0.5 + 0.5) * width;
        const y = (-projected.y * 0.5 + 0.5) * height;
        if (x < -80 || x > width + 80 || y < -40 || y > height + 40) {
          entry.el.style.display = 'none';
          continue;
        }

        // Simple collision fade: one label per grid cell, priority to
        // anchors then selected then hovered (ART_DIRECTION.md label
        // hierarchy). Skipped labels stay hidden rather than overlapping.
        const cellKey = `${Math.round(x / GRID_CELL)}:${Math.round(y / GRID_CELL)}`;
        if (occupied.has(cellKey) && !isSelected) {
          entry.el.style.display = 'none';
          continue;
        }
        occupied.add(cellKey);

        entry.el.style.display = 'block';
        entry.el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
        entry.el.classList.toggle('galaxy-label--selected', isSelected);
      }
    },
    dispose() {
      container.remove();
    },
  };
}
