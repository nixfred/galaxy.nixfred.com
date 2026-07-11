// Adaptive quality tiers and the runtime FPS watchdog
// (docs/warroom/02_WEBGL_CRAFT.md section 8, docs/DESIGN_BIBLE.md BD36-BD37).
// DPR cap is the first and strongest lever: fill rate scales with DPR
// squared, so this module owns nothing else about rendering, only the
// numbers other modules read.
import type { QualitySettings, QualityTier } from './types';

const TIERS: Record<QualityTier, QualitySettings> = {
  'desktop-high': {
    tier: 'desktop-high',
    dprCap: 2,
    ambientCount: 4500,
    nebulaFidelity: 'fbm',
    lineSignals: true,
  },
  'desktop-low': {
    tier: 'desktop-low',
    dprCap: 1.5,
    ambientCount: 1500,
    nebulaFidelity: 'gradient',
    lineSignals: true,
  },
  mobile: {
    tier: 'mobile',
    dprCap: 1.5,
    ambientCount: 700,
    nebulaFidelity: 'gradient',
    lineSignals: false,
  },
};

// Fixed step-down order (BD37): DPR, then signals, then ambient count, then
// nebula fidelity. Bloom is never shipped (BD20), so it is not a step.
type StepKey = 'dpr' | 'signals' | 'ambient' | 'nebula';
const STEP_ORDER: StepKey[] = ['dpr', 'signals', 'ambient', 'nebula'];

const DPR_STEPS = [2, 1.5, 1.25, 1] as const;

export function detectInitialTier(): QualityTier {
  const coarsePointer =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(pointer: coarse)').matches;
  const lowConcurrency =
    typeof navigator !== 'undefined' &&
    (navigator.hardwareConcurrency ?? 8) <= 4;
  const saveData =
    typeof navigator !== 'undefined' &&
    // @ts-expect-error -- navigator.connection is not in the DOM lib yet.
    Boolean(navigator.connection?.saveData);

  if (coarsePointer) return 'mobile';
  if (saveData) return 'mobile';
  if (lowConcurrency) return 'desktop-low';
  return 'desktop-high';
}

export class QualityController {
  private settings: QualitySettings;
  private dprStepIndex = 0;
  private stepIndex = 0; // index into STEP_ORDER already stepped down
  private readonly ceilingTier: QualityTier;

  // Rolling 60-frame delta average, sampled every frame.
  private readonly window: number[] = [];
  private belowThresholdSince: number | null = null;
  private aboveThresholdSince: number | null = null;

  constructor(initialTier: QualityTier) {
    this.ceilingTier = initialTier;
    this.settings = { ...TIERS[initialTier] };
    this.dprStepIndex = DPR_STEPS.indexOf(this.settings.dprCap as never);
    if (this.dprStepIndex === -1) this.dprStepIndex = 0;
  }

  getSettings(): QualitySettings {
    return this.settings;
  }

  /** Feed one frame's delta and the clock's elapsed time, both in seconds
   * (matching THREE.Clock). Returns 'down', 'up', or null if the watchdog
   * took no action this frame. */
  recordFrame(delta: number, elapsedSeconds: number): 'down' | 'up' | null {
    this.window.push(delta);
    if (this.window.length > 60) this.window.shift();
    if (this.window.length < 60) return null;

    const avgMs =
      (this.window.reduce((a, b) => a + b, 0) / this.window.length) * 1000;

    if (avgMs > 22) {
      this.aboveThresholdSince = null;
      if (this.belowThresholdSince === null) {
        this.belowThresholdSince = elapsedSeconds;
      } else if (elapsedSeconds - this.belowThresholdSince > 2.5) {
        this.belowThresholdSince = null;
        return this.stepDown() ? 'down' : null;
      }
    } else if (avgMs < 14) {
      this.belowThresholdSince = null;
      if (this.aboveThresholdSince === null) {
        this.aboveThresholdSince = elapsedSeconds;
      } else if (elapsedSeconds - this.aboveThresholdSince > 9) {
        this.aboveThresholdSince = null;
        return this.stepUp() ? 'up' : null;
      }
    } else {
      this.belowThresholdSince = null;
      this.aboveThresholdSince = null;
    }
    return null;
  }

  private stepDown(): boolean {
    if (this.stepIndex >= STEP_ORDER.length) return false;
    const key = STEP_ORDER[this.stepIndex]!;
    this.applyStep(key, true);
    this.stepIndex++;
    return true;
  }

  private stepUp(): boolean {
    if (this.stepIndex <= 0) return false;
    this.stepIndex--;
    const key = STEP_ORDER[this.stepIndex]!;
    this.applyStep(key, false);
    return true;
  }

  private applyStep(key: StepKey, down: boolean): void {
    switch (key) {
      case 'dpr': {
        this.dprStepIndex = Math.min(
          DPR_STEPS.length - 1,
          Math.max(0, this.dprStepIndex + (down ? 1 : -1)),
        );
        this.settings = {
          ...this.settings,
          dprCap: Math.min(
            DPR_STEPS[this.dprStepIndex]!,
            TIERS[this.ceilingTier].dprCap,
          ),
        };
        break;
      }
      case 'signals':
        this.settings = { ...this.settings, lineSignals: !down };
        break;
      case 'ambient':
        this.settings = {
          ...this.settings,
          ambientCount: down
            ? Math.floor(this.settings.ambientCount * 0.5)
            : Math.min(
                TIERS[this.ceilingTier].ambientCount,
                Math.floor(this.settings.ambientCount * 2),
              ),
        };
        break;
      case 'nebula':
        this.settings = {
          ...this.settings,
          nebulaFidelity: down
            ? 'gradient'
            : TIERS[this.ceilingTier].nebulaFidelity,
        };
        break;
    }
  }
}
