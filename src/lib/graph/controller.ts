// The seam (docs/ARCHITECTURE.md section 3): the only module that talks to
// the DOM outside the canvas. Everything above it (renderer, layout, nodes,
// lines, camera, selection, quality) is scene implementation with no
// knowledge of DOM panels or URL state; everything below it (hydrated
// islands) talks to the shared store, not the renderer, per the
// architecture's seam rule. Phase 3a wires hover/select to a minimal HTML
// readout only; the full ProjectPanel/store/URL wiring is Phase 3b/4 scope
// (see this module's final report for the explicit list of what is and is
// not wired yet).
import { SceneRenderer } from './renderer';
import { CameraRig } from './camera';
import { buildStarField, type StarField } from './nodes';
import { buildSectorAtmosphere, type SectorAtmosphere } from './sectors';
import { buildRelationshipLines, type RelationshipLines } from './lines';
import { buildLabelLayer, type LabelLayer } from './labels';
import {
  createSelectionController,
  type SelectionController,
} from './selection';
import { QualityController, detectInitialTier } from './quality';
import { readSectorPalette, type SectorColor } from './palette';
import { shortestMeaningfulPath, type ComparePath } from './pathfind';
import type {
  GalaxyGraph,
  HoverChange,
  SelectChange,
  FallbackReason,
  SceneNode,
  SceneEdge,
  SceneTour,
} from './types';

export type MapState =
  'catalog-loading' | 'renderer-ready' | 'labels-ready' | 'online';

export interface ControllerOptions {
  labelHost: HTMLElement;
  keepOutEl?: HTMLElement | null;
  reducedMotion: boolean;
  onStateChange: (state: MapState) => void;
  onHover: (change: HoverChange) => void;
  onSelect: (change: SelectChange) => void;
  onFallback: (reason: FallbackReason) => void;
  onTour?: (state: {
    tourId: string | null;
    title: string | null;
    step: number;
    total: number;
    narration: string | null;
    atEnd: boolean;
  }) => void;
}

const IGNITION_DURATION = 1.2; // seconds (BD22 envelope, ART_DIRECTION.md "the ignition")
const DRAG_THRESHOLD = 6; // px; below this a press/release is a click, not a drag
const IDLE_THRESHOLD = 2.5; // seconds of no input before the render loop half-cadences
const PAN_SENSITIVITY = 0.0016;
const ORBIT_SENSITIVITY = 0.0055;
const ZOOM_SENSITIVITY = 0.045;

interface PointerState {
  x: number;
  y: number;
  button: number;
  pointerType: string;
}

export class GalaxyController {
  private canvas: HTMLCanvasElement | null = null;
  private opts: ControllerOptions | null = null;
  private renderer: SceneRenderer | null = null;
  private cameraRig: CameraRig | null = null;
  private starField: StarField | null = null;
  private atmosphere: SectorAtmosphere | null = null;
  private lines: RelationshipLines | null = null;
  private labels: LabelLayer | null = null;
  private selection: SelectionController | null = null;
  private quality: QualityController | null = null;
  private palette: Map<string, SectorColor> | null = null;
  private graph: GalaxyGraph | null = null;
  private unsubs: Array<() => void> = [];
  private domUnsubs: Array<() => void> = [];

  private reducedMotion = false;
  private motionPaused = false;
  private motionElapsed = 0;
  private ignitionComplete = false;

  private lastInputAt = 0;
  private disposed = false;
  private filteredSlugs = new Set<string>();
  private activeTour: SceneTour | null = null;
  private tourStep = -1;
  private keepOutEl: HTMLElement | null = null;

  private readonly pointers = new Map<number, PointerState>();
  private dragButton: number | null = null;
  private dragMoved = 0;
  private lastDragX = 0;
  private lastDragY = 0;
  private pinchStartDist = 0;
  private pinchStartRadius = 0;

  async init(
    canvas: HTMLCanvasElement,
    opts: ControllerOptions,
  ): Promise<void> {
    this.canvas = canvas;
    this.opts = opts;
    this.reducedMotion = opts.reducedMotion;
    this.keepOutEl = opts.keepOutEl ?? null;

    opts.onStateChange('catalog-loading');
    const res = await fetch('/graph.json');
    if (!res.ok) {
      throw new Error(`graph.json fetch failed: ${res.status}`);
    }
    const graph = (await res.json()) as GalaxyGraph;
    if (this.disposed) return;
    this.graph = graph;

    this.palette = readSectorPalette();
    const tier = detectInitialTier();
    this.quality = new QualityController(tier);
    const settings = this.quality.getSettings();

    this.renderer = new SceneRenderer({
      canvas,
      antialias: tier === 'desktop-high',
      dprCap: settings.dprCap,
      onContextLost: () => this.handleContextLost(),
    });
    opts.onStateChange('renderer-ready');

    this.cameraRig = new CameraRig(this.renderer.camera);
    this.cameraRig.setReducedMotion(this.reducedMotion);
    // Widen the default framing on narrow (portrait) viewports before
    // anything has rendered or been interacted with, so the initial
    // overview isn't mostly off-frame on a phone (camera.ts setAspectHint).
    this.cameraRig.setAspectHint(this.renderer.camera.aspect);

    const nodesBySlug = new Map(graph.nodes.map((n) => [n.slug, n]));

    this.starField = buildStarField(
      graph.nodes,
      graph.sectors,
      this.palette,
      settings.ambientCount,
    );
    this.starField.setPixelRatio(this.renderer.renderer.getPixelRatio());
    this.renderer.scene.add(
      this.starField.ambient,
      this.starField.stars,
      this.starField.hitProxies,
    );

    this.atmosphere = buildSectorAtmosphere(graph.sectors, this.palette);
    this.atmosphere.setNebulaFidelity(settings.nebulaFidelity);
    this.renderer.scene.add(this.atmosphere.group);

    this.lines = buildRelationshipLines(graph.edges, nodesBySlug, this.palette);
    this.renderer.scene.add(this.lines.group);
    this.lines.resize(canvas.clientWidth || 1, canvas.clientHeight || 1);
    this.lines.setSignalsEnabled(settings.lineSignals && !this.reducedMotion);

    this.labels = buildLabelLayer(graph.nodes);
    opts.labelHost.appendChild(this.labels.container);
    opts.onStateChange('labels-ready');

    this.selection = createSelectionController(
      this.renderer.camera,
      this.starField.hitProxies,
      graph.nodes,
    );
    this.unsubs.push(
      this.selection.onHoverChange((change) => {
        this.labels?.setHovered(change.slug);
        if (canvas) canvas.style.cursor = change.slug ? 'pointer' : 'default';
        opts.onHover(change);
      }),
    );
    this.unsubs.push(
      this.selection.onSelectChange((change) => {
        this.labels?.setSelected(change.slug);
        this.lines?.setActiveNode(change.slug);
        this.applySelectionFocus(change.slug, nodesBySlug);
        opts.onSelect(change);
      }),
    );

    if (this.reducedMotion) {
      this.starField.setIgnitionProgress(1);
      this.ignitionComplete = true;
    }

    this.wireInput(canvas);
    this.wireResize(canvas);

    this.unsubs.push(
      this.renderer.onFrame((delta, elapsed) => this.frame(delta, elapsed)),
    );
    this.renderer.start();
    // First-paint correctness: a hidden tab gets no RAF callbacks, so draw
    // one synchronous frame now. Without this, a page loaded in a background
    // tab reveals a black canvas when it becomes visible (found by real
    // browser evidence during Phase 3a verification).
    this.renderer.renderOnce();

    opts.onStateChange('online');
  }

  /** Called by GalaxyStage's SKIP control and by the reduced-motion path:
   * jump straight to the fully-lit map with no further ignition animation. */
  skipEntrance(): void {
    this.starField?.setIgnitionProgress(1);
    this.ignitionComplete = true;
  }

  setReducedMotion(reduced: boolean): void {
    this.reducedMotion = reduced;
    this.cameraRig?.setReducedMotion(reduced);
    this.lines?.setSignalsEnabled(
      !reduced && (this.quality?.getSettings().lineSignals ?? true),
    );
    if (reduced) this.skipEntrance();
  }

  setMotionPaused(paused: boolean): void {
    this.motionPaused = paused;
  }

  private applySelectionFocus(
    slug: string | null,
    nodesBySlug: Map<string, SceneNode>,
  ): void {
    if (!this.starField || !this.graph || !this.cameraRig) return;
    if (!slug) {
      this.starField.resetEnergyOverrides();
      this.cameraRig.returnToOverview();
      if (this.reducedMotion) this.cameraRig.snapToGoal();
      return;
    }
    const selected = nodesBySlug.get(slug);
    if (!selected) return;

    this.recomputeEnergies();

    this.cameraRig.focusOn(selected.position.x, selected.position.z, 28);
    if (this.reducedMotion) this.cameraRig.snapToGoal();
  }

  // One composition point for star brightness: filtered stars fade to a
  // whisper (fades communicate filtering), and with a selection active,
  // unrelated visible stars fall back without disappearing (ART_DIRECTION
  // "the project focus"). Selection dimming never resurrects filtered stars.
  private recomputeEnergies(): void {
    if (!this.starField || !this.graph) return;
    this.starField.resetEnergyOverrides();
    const selected = this.getSelectedSlug();
    let related: Set<string> | null = null;
    if (selected) {
      related = new Set<string>([selected]);
      for (const edge of this.graph.edges) {
        if (edge.source === selected) related.add(edge.target);
        if (edge.target === selected) related.add(edge.source);
      }
    }
    this.graph.nodes.forEach((node, index) => {
      if (this.filteredSlugs.has(node.slug)) {
        this.starField?.setEnergyOverride(index, 0.04);
        return;
      }
      if (related && !related.has(node.slug)) {
        this.starField?.setEnergyOverride(index, 0.32);
      }
    });
  }

  /** Sector filter (FR028-FR031): isolate one or more sectors. Camera and
   * selection are preserved unless the selection itself is hidden (FR029).
   * Returns the visible project count for the FR030 count line. */
  setSectorFilter(sectors: ReadonlySet<string> | null): number {
    if (!this.graph) return 0;
    const active = sectors && sectors.size ? sectors : null;
    this.filteredSlugs = new Set(
      active
        ? this.graph.nodes
            .filter((n) => !active.has(n.sector))
            .map((n) => n.slug)
        : [],
    );
    const mask = this.filteredSlugs.size ? this.filteredSlugs : null;
    const selectedSlug = this.getSelectedSlug();
    if (selectedSlug && this.filteredSlugs.has(selectedSlug)) {
      this.select(null);
    }
    this.labels?.setFilteredOut(mask);
    this.lines?.setFilteredOut(mask);
    this.selection?.setPickPredicate(
      (index) => !this.filteredSlugs.has(this.graph?.nodes[index]?.slug ?? ''),
    );
    this.recomputeEnergies();
    return this.graph.nodes.length - this.filteredSlugs.size;
  }

  /** SURPRISE ME (FR059): a seeded session sequence over currently visible
   * projects, avoiding everything already visited this session when
   * possible. Exploration, not a slot machine. */
  surpriseMe(): string | null {
    if (!this.graph) return null;
    const visible = this.graph.nodes
      .map((n) => n.slug)
      .filter((s) => !this.filteredSlugs.has(s));
    if (!visible.length) return null;
    const seenRaw = sessionStorage.getItem('galaxy-surprise-seen') ?? '[]';
    const seen = new Set<string>(JSON.parse(seenRaw) as string[]);
    let pool = visible.filter(
      (s) => !seen.has(s) && s !== this.getSelectedSlug(),
    );
    if (!pool.length) {
      sessionStorage.setItem('galaxy-surprise-seen', '[]');
      pool = visible.filter((s) => s !== this.getSelectedSlug());
    }
    let seed = Number(sessionStorage.getItem('galaxy-surprise-seed'));
    if (!Number.isFinite(seed) || seed === 0) {
      seed = (Date.now() % 2147483647) | 1;
    }
    // mulberry32 step, persisted so the session sequence is deterministic.
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    const rand = ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    sessionStorage.setItem('galaxy-surprise-seed', String(seed));
    const pick = pool[Math.floor(rand * pool.length)]!;
    seen.add(pick);
    sessionStorage.setItem('galaxy-surprise-seen', JSON.stringify([...seen]));
    this.select(pick);
    return pick;
  }

  // Public selection API for the stage: deep links, keyboard navigation, and
  // the detail panel all drive selection through here (FR015: pointer,
  // keyboard, search, tour, and deep link actions can all select).
  select(slug: string | null): void {
    this.selection?.selectBySlug(slug);
  }

  getSelectedSlug(): string | null {
    return this.selection?.getSelectedSlug() ?? null;
  }

  /** Ordered slugs for keyboard cycling: anchors first, then by title.
   * Filtered-out stars are skipped (FR028 isolate semantics). */
  getKeyboardOrder(): string[] {
    if (!this.graph) return [];
    return this.graph.nodes
      .slice()
      .filter((n) => !this.filteredSlugs.has(n.slug))
      .sort((a, b) =>
        a.anchor === b.anchor
          ? a.title.localeCompare(b.title)
          : a.anchor
            ? -1
            : 1,
      )
      .map((n) => n.slug);
  }

  getNode(slug: string): SceneNode | null {
    if (!this.graph) return null;
    return this.graph.nodes.find((n) => n.slug === slug) ?? null;
  }

  /** All nodes, for the command palette search index. */
  listNodes(): SceneNode[] {
    return this.graph?.nodes ?? [];
  }

  listTours(): SceneTour[] {
    return this.graph?.tours ?? [];
  }

  // Guided tour runner (FR039-FR043). A tour is an ordered walk of selections
  // with narration; the visitor can advance, go back, exit, and the state is
  // observable so the stage can render controls and a shareable URL.
  startTour(id: string): SceneTour | null {
    const tour = this.graph?.tours.find((t) => t.id === id) ?? null;
    if (!tour) return null;
    this.activeTour = tour;
    this.tourStep = -1;
    this.tourNext();
    return tour;
  }

  tourNext(): number {
    if (!this.activeTour) return -1;
    if (this.tourStep >= this.activeTour.stops.length - 1) {
      return this.tourStep;
    }
    this.tourStep += 1;
    this.select(this.activeTour.stops[this.tourStep]!.slug);
    this.opts?.onTour?.(this.tourState());
    return this.tourStep;
  }

  tourPrev(): number {
    if (!this.activeTour || this.tourStep <= 0) return this.tourStep;
    this.tourStep -= 1;
    this.select(this.activeTour.stops[this.tourStep]!.slug);
    this.opts?.onTour?.(this.tourState());
    return this.tourStep;
  }

  tourExit(): void {
    this.activeTour = null;
    this.tourStep = -1;
    this.opts?.onTour?.(this.tourState());
  }

  tourState(): {
    tourId: string | null;
    title: string | null;
    step: number;
    total: number;
    narration: string | null;
    atEnd: boolean;
  } {
    const t = this.activeTour;
    const stop = t?.stops[this.tourStep];
    return {
      tourId: t?.id ?? null,
      title: t?.title ?? null,
      step: this.tourStep,
      total: t?.stops.length ?? 0,
      narration: stop?.narration ?? null,
      atEnd: t ? this.tourStep >= t.stops.length - 1 : false,
    };
  }

  getEdgesFor(slug: string): SceneEdge[] {
    if (!this.graph) return [];
    return this.graph.edges.filter(
      (e) => e.source === slug || e.target === slug,
    );
  }

  // Compare mode (FR035, FR036): illuminate the shortest meaningful path
  // between the current selection and a second project, dim everything else,
  // and return the typed path so the panel can explain each hop. Returns null
  // if nothing is selected to compare from.
  compareWith(fromSlug: string, otherSlug: string): ComparePath | null {
    if (!this.graph || !this.starField) return null;
    const from = fromSlug;
    if (!from || from === otherSlug) return null;
    const path = shortestMeaningfulPath(this.graph.edges, from, otherSlug);
    const onPath = new Set(path.slugs);
    this.starField.resetEnergyOverrides();
    this.graph.nodes.forEach((node, index) => {
      if (!onPath.has(node.slug)) {
        this.starField?.setEnergyOverride(index, 0.12);
      }
    });
    // Frame both endpoints: aim the camera at their midpoint.
    const a = this.getNode(from);
    const b = this.getNode(otherSlug);
    if (a && b) {
      this.cameraRig?.focusOn(
        (a.position.x + b.position.x) / 2,
        (a.position.z + b.position.z) / 2,
        38,
      );
      if (this.reducedMotion) this.cameraRig?.snapToGoal();
    }
    return path;
  }

  clearCompare(): void {
    this.recomputeEnergies();
  }

  private handleContextLost(): void {
    this.opts?.onFallback('context-lost');
    this.dispose();
  }

  private frame(delta: number, elapsed: number): void {
    const motionActive = !this.reducedMotion && !this.motionPaused;
    if (motionActive) this.motionElapsed += delta;

    if (!this.ignitionComplete && this.starField) {
      const progress = Math.min(1, this.motionElapsed / IGNITION_DURATION);
      this.starField.setIgnitionProgress(progress);
      if (progress >= 1) this.ignitionComplete = true;
    }

    this.cameraRig?.update(delta);
    this.starField?.update(delta, this.motionElapsed);
    this.atmosphere?.update(delta, this.motionElapsed);
    this.lines?.update(delta, this.motionElapsed);
    if (this.renderer && this.labels) {
      // Feed the hero copy bounds as a label keep-out so star labels never
      // collide with the reading text (WC03/WC10). Recomputed each frame is
      // cheap and survives layout changes; sampled from the canvas rect space.
      if (this.keepOutEl && this.canvas) {
        const hero = this.keepOutEl.getBoundingClientRect();
        const c = this.canvas.getBoundingClientRect();
        this.labels.setKeepOut(
          new DOMRect(
            hero.left - c.left,
            hero.top - c.top,
            hero.width,
            hero.height,
          ),
        );
      }
      this.labels.update(
        this.renderer.camera,
        this.canvas?.clientWidth || 1,
        this.canvas?.clientHeight || 1,
      );
    }
    // Hover raycast, throttled to at most once per frame inside poll()
    // (craft doc section 7); listeners already fired on change.
    this.selection?.poll();

    if (this.quality && this.renderer) {
      const step = this.quality.recordFrame(delta, elapsed);
      if (step) this.applyQualitySettings();
    }

    const idle = performance.now() - this.lastInputAt > IDLE_THRESHOLD * 1000;
    this.renderer?.setIdle(idle && motionActive);
    // The living-sky drift (ART_DIRECTION motion language): only when idle,
    // only when motion is active, never while a star is selected so the
    // composed panel framing stays put.
    if (
      idle &&
      motionActive &&
      this.ignitionComplete &&
      !this.getSelectedSlug()
    ) {
      this.cameraRig?.driftAzimuth(delta);
    }
  }

  private applyQualitySettings(): void {
    if (
      !this.quality ||
      !this.renderer ||
      !this.starField ||
      !this.atmosphere ||
      !this.lines
    ) {
      return;
    }
    const settings = this.quality.getSettings();
    this.renderer.setDprCap(settings.dprCap);
    this.starField.setPixelRatio(this.renderer.renderer.getPixelRatio());
    this.atmosphere.setNebulaFidelity(settings.nebulaFidelity);
    this.lines.setSignalsEnabled(settings.lineSignals && !this.reducedMotion);
  }

  private markInput(): void {
    this.lastInputAt = performance.now();
  }

  private toNdc(
    canvas: HTMLCanvasElement,
    clientX: number,
    clientY: number,
  ): { x: number; y: number } {
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((clientX - rect.left) / rect.width) * 2 - 1,
      y: -((clientY - rect.top) / rect.height) * 2 + 1,
    };
  }

  private openNode(slug: string): void {
    const node = this.graph?.nodes.find((n) => n.slug === slug);
    if (!node) return;
    window.open(node.url, '_blank', 'noopener,noreferrer');
  }

  private wireInput(canvas: HTMLCanvasElement): void {
    const onPointerMove = (e: PointerEvent): void => {
      this.markInput();
      this.pointers.set(e.pointerId, {
        x: e.clientX,
        y: e.clientY,
        button: e.button,
        pointerType: e.pointerType,
      });

      const ndc = this.toNdc(canvas, e.clientX, e.clientY);
      if (this.dragButton === null) {
        this.selection?.setPointerNdc(ndc.x, ndc.y);
      }

      if (this.pointers.size === 2) {
        this.handlePinch();
        return;
      }

      if (this.dragButton === null) return;
      const dx = e.clientX - this.lastDragX;
      const dy = e.clientY - this.lastDragY;
      this.dragMoved += Math.abs(dx) + Math.abs(dy);
      this.lastDragX = e.clientX;
      this.lastDragY = e.clientY;

      if (this.dragMoved > DRAG_THRESHOLD) {
        this.selection?.clearPointer();
      }

      if (this.dragButton === 2) {
        this.cameraRig?.orbit(-dx * ORBIT_SENSITIVITY, -dy * ORBIT_SENSITIVITY);
      } else {
        this.applyPan(dx, dy);
      }
    };

    const onPointerDown = (e: PointerEvent): void => {
      this.markInput();
      // Without this, a drag that happens to cross nearby hero text can be
      // hijacked by the browser's native text-selection drag instead of
      // orbiting/panning the camera.
      e.preventDefault();
      canvas.setPointerCapture(e.pointerId);
      this.pointers.set(e.pointerId, {
        x: e.clientX,
        y: e.clientY,
        button: e.button,
        pointerType: e.pointerType,
      });

      if (this.pointers.size === 2) {
        this.beginPinch();
        return;
      }
      if (this.pointers.size > 2) return;

      this.dragButton = e.button;
      this.lastDragX = e.clientX;
      this.lastDragY = e.clientY;
      this.dragMoved = 0;
    };

    const onPointerUp = (e: PointerEvent): void => {
      this.markInput();
      this.pointers.delete(e.pointerId);
      if (this.pointers.size >= 1) return; // still mid-gesture (pinch winding down)

      const wasClick =
        this.dragButton !== null && this.dragMoved <= DRAG_THRESHOLD;
      const clickButton = this.dragButton;
      this.dragButton = null;
      this.pinchStartDist = 0;

      if (!wasClick || clickButton !== 0) return;

      const ndc = this.toNdc(canvas, e.clientX, e.clientY);
      this.selection?.setPointerNdc(ndc.x, ndc.y);
      this.selection?.poll();
      const hovered = this.selection?.getHoveredSlug() ?? null;
      const wasSelected = this.selection?.getSelectedSlug() ?? null;

      if (hovered) {
        if (e.pointerType !== 'mouse' && hovered === wasSelected) {
          // Second tap on the already-selected star opens it (touch model).
          this.openNode(hovered);
        } else {
          this.selection?.selectBySlug(hovered);
        }
      } else {
        // Click on empty space closes any open selection context.
        this.selection?.selectBySlug(null);
      }
    };

    const onWheel = (e: WheelEvent): void => {
      this.markInput();
      e.preventDefault();
      this.cameraRig?.zoom(e.deltaY * ZOOM_SENSITIVITY);
    };

    const onDblClick = (e: MouseEvent): void => {
      this.markInput();
      const ndc = this.toNdc(canvas, e.clientX, e.clientY);
      this.selection?.setPointerNdc(ndc.x, ndc.y);
      this.selection?.poll();
      const hovered = this.selection?.getHoveredSlug() ?? null;
      if (hovered) {
        this.selection?.selectBySlug(hovered);
        this.openNode(hovered);
      }
    };

    const onContextMenu = (e: MouseEvent): void => {
      e.preventDefault(); // right-drag orbits; never shows the browser menu
    };

    const onKeyDown = (e: KeyboardEvent): void => {
      const target = e.target as HTMLElement | null;
      if (target && ['INPUT', 'TEXTAREA'].includes(target.tagName)) return;
      this.markInput();
      switch (e.key) {
        case 'Escape':
          this.selection?.selectBySlug(null);
          break;
        case '+':
        case '=':
          this.cameraRig?.zoom(-6);
          break;
        case '-':
        case '_':
          this.cameraRig?.zoom(6);
          break;
        case 'r':
        case 'R':
          this.cameraRig?.returnToOverview();
          this.selection?.selectBySlug(null);
          break;
        default:
          return;
      }
      e.preventDefault();
    };

    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointercancel', onPointerUp);
    canvas.addEventListener('pointerleave', () =>
      this.selection?.clearPointer(),
    );
    canvas.addEventListener('wheel', onWheel, { passive: false });
    canvas.addEventListener('dblclick', onDblClick);
    canvas.addEventListener('contextmenu', onContextMenu);
    window.addEventListener('keydown', onKeyDown);

    this.domUnsubs.push(() => {
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointercancel', onPointerUp);
      canvas.removeEventListener('wheel', onWheel);
      canvas.removeEventListener('dblclick', onDblClick);
      canvas.removeEventListener('contextmenu', onContextMenu);
      window.removeEventListener('keydown', onKeyDown);
    });
  }

  private applyPan(dxPx: number, dyPx: number): void {
    if (!this.cameraRig) return;
    const state = this.cameraRig.getState();
    const scale = state.radius * PAN_SENSITIVITY;
    const rightX = Math.cos(state.azimuth);
    const rightZ = -Math.sin(state.azimuth);
    const fwdX = Math.sin(state.azimuth);
    const fwdZ = Math.cos(state.azimuth);
    const dx = -dxPx * scale;
    const dy = dyPx * scale;
    this.cameraRig.pan(rightX * dx + fwdX * dy, rightZ * dx + fwdZ * dy);
  }

  private beginPinch(): void {
    const pts = Array.from(this.pointers.values());
    if (pts.length < 2) return;
    this.pinchStartDist = Math.hypot(
      pts[0]!.x - pts[1]!.x,
      pts[0]!.y - pts[1]!.y,
    );
    this.pinchStartRadius = this.cameraRig?.getState().radius ?? 60;
    this.dragButton = null;
    this.selection?.clearPointer();
  }

  private handlePinch(): void {
    const pts = Array.from(this.pointers.values());
    if (pts.length < 2 || this.pinchStartDist === 0 || !this.cameraRig) return;
    const dist = Math.hypot(pts[0]!.x - pts[1]!.x, pts[0]!.y - pts[1]!.y);
    const ratio = this.pinchStartDist / Math.max(dist, 1);
    const targetRadius = this.pinchStartRadius * ratio;
    const state = this.cameraRig.getState();
    this.cameraRig.zoom(targetRadius - state.radius);
  }

  private wireResize(canvas: HTMLCanvasElement): void {
    const onResize = (): void => {
      this.renderer?.resize();
      this.lines?.resize(canvas.clientWidth || 1, canvas.clientHeight || 1);
    };
    window.addEventListener('resize', onResize);
    this.domUnsubs.push(() => window.removeEventListener('resize', onResize));
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    for (const unsub of this.unsubs) unsub();
    for (const unsub of this.domUnsubs) unsub();
    this.unsubs = [];
    this.domUnsubs = [];
    this.pointers.clear();

    this.starField?.dispose();
    this.atmosphere?.dispose();
    this.lines?.dispose();
    this.labels?.dispose();
    this.renderer?.dispose();

    this.renderer = null;
    this.cameraRig = null;
    this.starField = null;
    this.atmosphere = null;
    this.lines = null;
    this.labels = null;
    this.selection = null;
    this.quality = null;
  }
}
