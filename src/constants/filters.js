/**
 * CSS `filter` presets applied to both video feeds and baked into captured photos.
 * Add new looks here — nothing else needs to change.
 */
export const FILTERS = [
  { label: 'No filter', value: 'none' },
  { label: 'Black & White', value: 'grayscale(1) contrast(1.1)' },
  { label: 'Noir', value: 'grayscale(1) contrast(1.6) brightness(0.9)' },
  { label: 'Warm Sepia', value: 'sepia(0.6) saturate(1.4)' },
  { label: 'Vivid', value: 'saturate(1.6) contrast(1.05)' },
  { label: 'Soft Glow', value: 'brightness(1.1) contrast(0.95) blur(0.3px)' },
  { label: 'Vintage Film', value: 'sepia(0.3) contrast(1.2) brightness(0.9) saturate(1.3)' },
  { label: 'Golden Hour', value: 'sepia(0.35) saturate(1.5) brightness(1.08) hue-rotate(-8deg)' },
  { label: 'Cool Blue', value: 'saturate(1.3) brightness(1.05) contrast(1.1) hue-rotate(160deg)' },
  { label: 'Dreamy Pink', value: 'saturate(1.25) brightness(1.12) contrast(0.9) hue-rotate(-12deg)' },
  { label: 'Old Polaroid', value: 'sepia(0.25) saturate(1.1) contrast(0.9) brightness(1.1)' },
  { label: 'Moody Dark', value: 'contrast(1.3) brightness(0.85) saturate(0.9)' },
];

export const DEFAULT_FILTER = FILTERS[0].value;

/** Max photos kept in a single strip before the oldest is dropped. */
export const MAX_SHOTS = 4;

/** Frame dimensions used for every captured photo pair. */
export const CAPTURE_WIDTH = 480;
export const CAPTURE_HEIGHT = 640;
export const CAPTURE_GUTTER = 20;
