// Custom camera rig (docs/warroom/02_WEBGL_CRAFT.md section 5, BD33). Never
// OrbitControls: state is a target point plus a spherical offset, damped
// framerate-independently, with roll impossible by construction.
import { PerspectiveCamera, Vector3 } from 'three';

const MIN_RADIUS = 8;
const MAX_RADIUS = 170;
const MIN_POLAR = (60 * Math.PI) / 180;
const MAX_POLAR = (85 * Math.PI) / 180;
// Tuned for a ~16:9 desktop frame; setAspectHint() widens this for portrait
// viewports, since a fixed vertical FOV loses horizontal coverage in direct
// proportion to a narrowing aspect ratio. Without that correction, most of
// the sector spread sits outside the frustum entirely on a phone.
const DEFAULT_RADIUS = 95;
const DEFAULT_POLAR = (72 * Math.PI) / 180;
const DAMP_LAMBDA = 8;
// Cap how far the aspect correction can push the overview out, so an
// extreme aspect ratio cannot produce an absurdly distant default view.
const MAX_ASPECT_CORRECTION = 1.8;

// Bounded box the target may pan within, so overview is always one gesture
// away (craft doc section 5). Matches the sector anchor spread in
// sectors.json (anchors sit at radius ~46 from origin).
const TARGET_BOUND = 70;

export interface CameraState {
  targetX: number;
  targetZ: number;
  azimuth: number;
  polar: number;
  radius: number;
}

function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

// Framerate-independent exponential damping (craft doc section 5): identical
// feel at 30fps and 60fps because it is expressed as a continuous rate, not
// a fixed per-frame lerp factor.
function dampScalar(current: number, goal: number, dt: number): number {
  const k = 1 - Math.exp(-DAMP_LAMBDA * dt);
  return current + (goal - current) * k;
}

// Shortest angular path damping so azimuth never spins the long way round
// when crossing the -PI/PI seam.
function dampAngle(current: number, goal: number, dt: number): number {
  let diff = goal - current;
  diff = ((diff + Math.PI) % (Math.PI * 2)) - Math.PI;
  if (diff < -Math.PI) diff += Math.PI * 2;
  const k = 1 - Math.exp(-DAMP_LAMBDA * dt);
  return current + diff * k;
}

export class CameraRig {
  readonly camera: PerspectiveCamera;

  // Goal state: what input and focus transitions write to.
  private goalTargetX = 0;
  private goalTargetZ = 0;
  private goalAzimuth = 0;
  private goalPolar = DEFAULT_POLAR;
  private goalRadius = DEFAULT_RADIUS;

  // Current (damped) state: what actually gets applied to the camera.
  private curTargetX = 0;
  private curTargetZ = 0;
  private curAzimuth = 0;
  private curPolar = DEFAULT_POLAR;
  private curRadius = DEFAULT_RADIUS;

  private readonly targetVec = new Vector3();
  private readonly posVec = new Vector3();
  private reducedMotion = false;
  private overviewRadius = DEFAULT_RADIUS;

  constructor(camera: PerspectiveCamera) {
    this.camera = camera;
    this.camera.up.set(0, 1, 0); // locked world Y; roll never expressed (BD33)
    this.applyImmediate();
  }

  setReducedMotion(reduced: boolean): void {
    this.reducedMotion = reduced;
  }

  /** Widen the default/overview radius for narrow (portrait) viewports so
   * the sector spread isn't mostly off-frame on a phone. Call once, at
   * init, before the first frame: it snaps the current radius immediately,
   * which would otherwise undo a live user zoom if called again later
   * (e.g. on a resize mid-session), so callers should not call this after
   * the visitor has interacted with the camera. */
  setAspectHint(aspect: number): void {
    const correction =
      aspect < 1 ? Math.min(1 / aspect, MAX_ASPECT_CORRECTION) : 1;
    this.overviewRadius = clamp(
      DEFAULT_RADIUS * correction,
      MIN_RADIUS,
      MAX_RADIUS,
    );
    this.goalRadius = this.overviewRadius;
    this.curRadius = this.overviewRadius;
    this.applyToCamera();
  }

  getState(): CameraState {
    return {
      targetX: this.goalTargetX,
      targetZ: this.goalTargetZ,
      azimuth: this.goalAzimuth,
      polar: this.goalPolar,
      radius: this.goalRadius,
    };
  }

  /** Visitor-driven orbit (pointer drag / keyboard). Azimuth unconstrained,
   * polar clamped so the horizon never inverts and labels stay legible. */
  orbit(deltaAzimuth: number, deltaPolar: number): void {
    this.goalAzimuth += deltaAzimuth;
    this.goalPolar = clamp(this.goalPolar + deltaPolar, MIN_POLAR, MAX_POLAR);
  }

  /** Idle drift: "slow drift communicates that the system is alive"
   * (docs/ART_DIRECTION.md motion language). One full orbit takes about
   * fourteen minutes; the caller gates this on idle state, motion being
   * active, and reduced motion being off, and any input interrupts it. */
  driftAzimuth(delta: number): void {
    this.goalAzimuth += 0.0075 * delta;
  }

  /** Visitor-driven pan across the ground plane, bounded so the visitor
   * cannot drift into empty space forever. */
  pan(deltaX: number, deltaZ: number): void {
    this.goalTargetX = clamp(
      this.goalTargetX + deltaX,
      -TARGET_BOUND,
      TARGET_BOUND,
    );
    this.goalTargetZ = clamp(
      this.goalTargetZ + deltaZ,
      -TARGET_BOUND,
      TARGET_BOUND,
    );
  }

  /** Visitor-driven zoom, clamped between a comfortable single-star framing
   * and the full overview. */
  zoom(deltaRadius: number): void {
    this.goalRadius = clamp(
      this.goalRadius + deltaRadius,
      MIN_RADIUS,
      MAX_RADIUS,
    );
  }

  /** Focus transition: move target/radius/polar toward a world position.
   * Eased over time by the damping in update(); under reduced motion the
   * caller should follow this with snapToGoal() for an instant reframe. */
  focusOn(x: number, z: number, radius = 32): void {
    this.goalTargetX = clamp(x, -TARGET_BOUND, TARGET_BOUND);
    this.goalTargetZ = clamp(z, -TARGET_BOUND, TARGET_BOUND);
    this.goalRadius = clamp(radius, MIN_RADIUS, MAX_RADIUS);
  }

  returnToOverview(): void {
    this.goalTargetX = 0;
    this.goalTargetZ = 0;
    this.goalAzimuth = this.curAzimuth;
    this.goalPolar = DEFAULT_POLAR;
    this.goalRadius = this.overviewRadius;
  }

  /** Instant reframe: current state jumps to the goal with no interpolation
   * (reduced motion, craft doc section 5 / DESIGN_BIBLE BD26). */
  snapToGoal(): void {
    this.applyImmediate();
  }

  private applyImmediate(): void {
    this.curTargetX = this.goalTargetX;
    this.curTargetZ = this.goalTargetZ;
    this.curAzimuth = this.goalAzimuth;
    this.curPolar = this.goalPolar;
    this.curRadius = this.goalRadius;
    this.applyToCamera();
  }

  /** Advance damping by dt (seconds) and write the result onto the THREE
   * camera. Call once per frame from the render loop. Zero allocations:
   * targetVec/posVec are preallocated at construction. */
  update(dt: number): void {
    if (this.reducedMotion) {
      this.applyImmediate();
      return;
    }
    this.curTargetX = dampScalar(this.curTargetX, this.goalTargetX, dt);
    this.curTargetZ = dampScalar(this.curTargetZ, this.goalTargetZ, dt);
    this.curAzimuth = dampAngle(this.curAzimuth, this.goalAzimuth, dt);
    this.curPolar = dampScalar(this.curPolar, this.goalPolar, dt);
    this.curRadius = dampScalar(this.curRadius, this.goalRadius, dt);
    this.applyToCamera();
  }

  private applyToCamera(): void {
    const sinPolar = Math.sin(this.curPolar);
    const x =
      this.curTargetX + this.curRadius * sinPolar * Math.sin(this.curAzimuth);
    const y = this.curRadius * Math.cos(this.curPolar);
    const z =
      this.curTargetZ + this.curRadius * sinPolar * Math.cos(this.curAzimuth);

    this.posVec.set(x, y, z);
    this.targetVec.set(this.curTargetX, 0, this.curTargetZ);
    this.camera.position.copy(this.posVec);
    // up stays locked to world Y (set once in the constructor); always
    // lookAt(target) so roll can never be expressed (BD33).
    this.camera.lookAt(this.targetVec);
  }
}
