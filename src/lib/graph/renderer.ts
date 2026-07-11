// Renderer, scene, camera, and the single animation loop
// (docs/warroom/02_WEBGL_CRAFT.md sections 5 and 9, docs/ARCHITECTURE.md
// section 3). Owns nothing about stars, lines, or camera framing: it is the
// GPU plumbing every other module renders into via onFrame().
import { WebGLRenderer, Scene, PerspectiveCamera, Timer, FogExp2 } from 'three';
import { readSurface0 } from './palette';

export type FrameCallback = (delta: number, elapsed: number) => void;

export interface RendererOptions {
  canvas: HTMLCanvasElement;
  antialias: boolean;
  dprCap: number;
  onContextLost: () => void;
}

// Background must stay genuinely near-black for additive blending to have
// headroom (BD21, craft doc section 1). Read from --surface-0 so this can
// never drift from the token.
const CLEAR_ALPHA = 1;
// Clamp a stalled/backgrounded tab's first delta so it cannot fling the
// camera or animation state in one giant catch-up step (craft doc section 9).
const MAX_DELTA = 0.1;

export class SceneRenderer {
  readonly renderer: WebGLRenderer;
  readonly scene: Scene;
  readonly camera: PerspectiveCamera;

  private readonly canvas: HTMLCanvasElement;
  // THREE.Clock is deprecated in this three.js version; Timer is the
  // replacement (explicit update(timestamp) instead of an implicit internal
  // clock, and it does not silently keep advancing while start()/stop()
  // gate our own requestAnimationFrame loop below).
  private readonly timer = new Timer();
  private readonly onContextLost: () => void;
  private frameCallbacks: FrameCallback[] = [];
  private rafId = 0;
  private running = false;
  private disposed = false;
  private dprCap: number;
  private idle = false;
  private frameParity = 0;

  private readonly visibilityHandler = (): void => this.handleVisibility();
  private readonly contextLostHandler = (event: Event): void =>
    this.handleContextLost(event);

  constructor(opts: RendererOptions) {
    this.canvas = opts.canvas;
    this.dprCap = opts.dprCap;
    this.onContextLost = opts.onContextLost;

    this.renderer = new WebGLRenderer({
      canvas: opts.canvas,
      antialias: opts.antialias,
      alpha: false,
      powerPreference: 'high-performance',
    });
    this.renderer.setPixelRatio(
      Math.min(window.devicePixelRatio || 1, this.dprCap),
    );
    this.renderer.setClearColor(readSurface0(), CLEAR_ALPHA);
    this.renderer.setScissorTest(false);

    this.scene = new Scene();
    // Low density depth cue that also keeps overview labels from fogging out
    // (BD42, craft doc section 3). Density tuned to the ~60-unit sector spread
    // in layout.ts/sectors.json so only the farthest stars desaturate.
    this.scene.fog = new FogExp2(readSurface0().getHex(), 0.0065);

    this.camera = new PerspectiveCamera(45, 1, 0.1, 400);

    this.canvas.addEventListener(
      'webglcontextlost',
      this.contextLostHandler,
      false,
    );
    document.addEventListener('visibilitychange', this.visibilityHandler);

    this.resize();
  }

  /** Register a per-frame callback. Returns an unsubscribe function. */
  onFrame(cb: FrameCallback): () => void {
    this.frameCallbacks.push(cb);
    return () => {
      const idx = this.frameCallbacks.indexOf(cb);
      if (idx !== -1) this.frameCallbacks.splice(idx, 1);
    };
  }

  setDprCap(cap: number): void {
    this.dprCap = cap;
    this.renderer.setPixelRatio(
      Math.min(window.devicePixelRatio || 1, this.dprCap),
    );
  }

  /** Idle throttle (craft doc section 9): halve render cadence while there is
   * no input and no active transition. Frame callbacks (damping, labels)
   * still run every frame so motion resumes instantly on input. */
  setIdle(idle: boolean): void {
    this.idle = idle;
  }

  resize(): void {
    const parent = this.canvas.parentElement;
    const width = parent?.clientWidth ?? window.innerWidth;
    const height = parent?.clientHeight ?? window.innerHeight;
    this.camera.aspect = width / Math.max(height, 1);
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  }

  start(): void {
    if (this.running || this.disposed) return;
    this.running = true;
    // Reset the timer's internal previous-time so the next update() call
    // computes a small real delta instead of one spanning the entire paused
    // interval (mirrors Clock's old start()/stop() gating, craft doc
    // section 9's "pause on hidden" without a giant catch-up frame).
    this.timer.reset();
    this.rafId = requestAnimationFrame(this.loop);
  }

  stop(): void {
    this.running = false;
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.rafId = 0;
  }

  isRunning(): boolean {
    return this.running;
  }

  private readonly loop = (timestamp: number): void => {
    if (!this.running) return;
    this.rafId = requestAnimationFrame(this.loop);

    this.timer.update(timestamp);
    let delta = this.timer.getDelta();
    if (delta > MAX_DELTA) delta = MAX_DELTA;
    const elapsed = this.timer.getElapsed();

    for (let i = 0; i < this.frameCallbacks.length; i++) {
      this.frameCallbacks[i]!(delta, elapsed);
    }

    this.frameParity ^= 1;
    if (this.idle && this.frameParity === 0) return;
    this.renderer.render(this.scene, this.camera);
  };

  private handleVisibility(): void {
    if (document.hidden) {
      this.stop();
    } else if (!this.disposed) {
      this.start();
    }
  }

  private handleContextLost(event: Event): void {
    // Required or the context never restores (craft doc section 9).
    event.preventDefault();
    this.stop();
    this.onContextLost();
  }

  dispose(): void {
    this.disposed = true;
    this.stop();
    this.canvas.removeEventListener(
      'webglcontextlost',
      this.contextLostHandler,
      false,
    );
    document.removeEventListener('visibilitychange', this.visibilityHandler);
    this.frameCallbacks = [];
    this.renderer.dispose();
    this.renderer.forceContextLoss();
  }
}
