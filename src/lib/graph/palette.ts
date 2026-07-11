// Sector colors read once from the CSS custom properties in
// src/styles/tokens.css (BD02), never re-declared as a second source of
// truth here. WebGL cannot consume `var(--sector-it)` directly, so this
// reads getComputedStyle(document.documentElement) once at scene init and
// converts each hex string to a numeric value THREE.Color accepts.
import { Color } from 'three';

export interface SectorColor {
  core: Color;
  halo: Color;
}

const SECTOR_IDS = [
  'it',
  'labs',
  'work',
  'signal',
  'clients',
  'personal',
] as const;

export function readSectorPalette(): Map<string, SectorColor> {
  const style = getComputedStyle(document.documentElement);
  const palette = new Map<string, SectorColor>();
  for (const id of SECTOR_IDS) {
    const coreHex = style.getPropertyValue(`--sector-${id}`).trim();
    const haloHex = style.getPropertyValue(`--sector-${id}-halo`).trim();
    palette.set(id, {
      core: new Color(coreHex || '#38bdf8'),
      // The halo token is an intentionally dark base (BD02); the emissive
      // atmosphere shader wants the lighter, saturated glow hue, so mix the
      // halo base toward the core rather than rendering the near-black base.
      halo: new Color(haloHex || '#122a38').lerp(
        new Color(coreHex || '#38bdf8'),
        0.55,
      ),
    });
  }
  return palette;
}

export function readAccentSignal(): Color {
  const style = getComputedStyle(document.documentElement);
  const hex = style.getPropertyValue('--accent-signal').trim();
  return new Color(hex || '#38bdf8');
}

export function readSurface0(): Color {
  const style = getComputedStyle(document.documentElement);
  const hex = style.getPropertyValue('--surface-0').trim();
  return new Color(hex || '#05070a');
}
