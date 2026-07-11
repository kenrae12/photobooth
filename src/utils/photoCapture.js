import { CAPTURE_WIDTH, CAPTURE_HEIGHT, CAPTURE_GUTTER } from '../constants/filters';

/**
 * Draws a single mirrored video frame into a 2D context at the given x offset.
 */
function drawMirroredFrame(ctx, videoEl, xOffset) {
  ctx.save();
  ctx.translate(xOffset + CAPTURE_WIDTH, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(videoEl, 0, 0, CAPTURE_WIDTH, CAPTURE_HEIGHT);
  ctx.restore();
}

/**
 * Composites the local + remote video feeds side by side into a single PNG data URL,
 * with the given CSS filter baked in. Returns null if either video isn't ready yet.
 */
export function capturePairedFrame(localVideoEl, remoteVideoEl, filter) {
  if (!localVideoEl || !remoteVideoEl) return null;

  const canvas = document.createElement('canvas');
  canvas.width = CAPTURE_WIDTH * 2 + CAPTURE_GUTTER;
  canvas.height = CAPTURE_HEIGHT;
  const ctx = canvas.getContext('2d');

  ctx.filter = filter === 'none' ? 'none' : filter;
  drawMirroredFrame(ctx, localVideoEl, 0);

  ctx.filter = 'none';
  ctx.fillStyle = '#0f0b08';
  ctx.fillRect(CAPTURE_WIDTH, 0, CAPTURE_GUTTER, CAPTURE_HEIGHT);

  ctx.filter = filter === 'none' ? 'none' : filter;
  drawMirroredFrame(ctx, remoteVideoEl, CAPTURE_WIDTH + CAPTURE_GUTTER);

  return canvas.toDataURL('image/png');
}
