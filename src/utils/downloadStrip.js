const STRIP_PADDING = 24;
const STRIP_GAP = 16;
const STRIP_SHOT_WIDTH = 400;
const STRIP_FOOTER_HEIGHT = 60;
const PAIR_WIDTH = 480 * 2 + 20;
const PAIR_HEIGHT = 640;

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Stacks the given shots (data URLs) into a single vertical photo-strip PNG
 * and triggers a browser download. No-ops if there are no shots.
 */
export async function downloadPhotoStrip(shots, filename = 'two-of-us-photobooth.png') {
  if (shots.length === 0) return;

  const scale = STRIP_SHOT_WIDTH / PAIR_WIDTH;
  const scaledShotHeight = PAIR_HEIGHT * scale;

  const canvas = document.createElement('canvas');
  canvas.width = STRIP_SHOT_WIDTH + STRIP_PADDING * 2;
  canvas.height =
    STRIP_PADDING * 2 +
    shots.length * scaledShotHeight +
    (shots.length - 1) * STRIP_GAP +
    STRIP_FOOTER_HEIGHT;

  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#f3e9da';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const images = await Promise.all(shots.map(loadImage));

  images.forEach((img, i) => {
    const y = STRIP_PADDING + i * (scaledShotHeight + STRIP_GAP);
    ctx.drawImage(img, STRIP_PADDING, y, STRIP_SHOT_WIDTH, scaledShotHeight);
    ctx.strokeStyle = '#1a1410';
    ctx.lineWidth = 2;
    ctx.strokeRect(STRIP_PADDING, y, STRIP_SHOT_WIDTH, scaledShotHeight);
  });

  ctx.fillStyle = '#1a1410';
  ctx.font = 'italic 22px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText(
    `Two of Us · ${new Date().toLocaleDateString()}`,
    canvas.width / 2,
    canvas.height - 22,
  );

  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();
}
