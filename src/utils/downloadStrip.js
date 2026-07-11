import { DEFAULT_STRIP_THEME } from '../constants/stripThemes';

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

function drawHeart(ctx, x, y, size, color) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y + size / 4);
  ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + size / 4);
  ctx.bezierCurveTo(x - size / 2, y + size / 1.7, x, y + size, x, y + size * 1.1);
  ctx.bezierCurveTo(x, y + size, x + size / 2, y + size / 1.7, x + size / 2, y + size / 4);
  ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + size / 4);
  ctx.fill();
  ctx.restore();
}

function drawStar(ctx, x, y, size, color) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const angle = (Math.PI / 2.5) * i - Math.PI / 2;
    const px = x + Math.cos(angle) * size;
    const py = y + Math.sin(angle) * size;
    ctx.lineTo(px, py);
    const innerAngle = angle + Math.PI / 5;
    ctx.lineTo(x + Math.cos(innerAngle) * (size / 2.5), y + Math.sin(innerAngle) * (size / 2.5));
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawDecorations(ctx, canvas, theme) {
  const marginX = STRIP_PADDING / 2;

  if (theme.decoration === 'hearts') {
    const positions = [0.12, 0.32, 0.55, 0.72, 0.9];
    positions.forEach((p, i) => {
      const y = canvas.height * p;
      drawHeart(ctx, marginX, y, 10, theme.border);
      drawHeart(ctx, canvas.width - marginX, y, 10, theme.border);
    });
  }

  if (theme.decoration === 'sprockets') {
    const holeSize = 8;
    const gap = 22;
    for (let y = STRIP_PADDING; y < canvas.height - STRIP_PADDING; y += gap) {
      ctx.fillStyle = theme.border;
      ctx.fillRect(marginX - holeSize / 2, y, holeSize, holeSize);
      ctx.fillRect(canvas.width - marginX - holeSize / 2, y, holeSize, holeSize);
    }
  }

  if (theme.decoration === 'stars') {
    const positions = [
      [0.15, 0.1], [0.85, 0.18], [0.1, 0.45], [0.9, 0.5],
      [0.15, 0.8], [0.85, 0.85],
    ];
    positions.forEach(([xr, yr]) => {
      drawStar(ctx, canvas.width * xr, canvas.height * yr, 6, theme.text);
    });
  }
}

/**
 * Stacks the given shots (data URLs) into a single vertical photo-strip PNG
 * styled with the given theme, and triggers a browser download.
 * No-ops if there are no shots.
 */
export async function downloadPhotoStrip(
  shots,
  theme = DEFAULT_STRIP_THEME,
  filename = 'two-of-us-photobooth.png',
) {
  if (shots.length === 0) return;

  const scale = STRIP_SHOT_WIDTH / PAIR_WIDTH;
  const scaledShotHeight = PAIR_HEIGHT * scale;
  const isPolaroid = theme.decoration === 'polaroid';
  const photoBottomGap = isPolaroid ? STRIP_GAP + 26 : STRIP_GAP;

  const canvas = document.createElement('canvas');
  canvas.width = STRIP_SHOT_WIDTH + STRIP_PADDING * 2;
  canvas.height =
    STRIP_PADDING * 2 +
    shots.length * scaledShotHeight +
    (shots.length - 1) * photoBottomGap +
    STRIP_FOOTER_HEIGHT;

  const ctx = canvas.getContext('2d');
  ctx.fillStyle = theme.background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const images = await Promise.all(shots.map(loadImage));

  images.forEach((img, i) => {
    const y = STRIP_PADDING + i * (scaledShotHeight + photoBottomGap);
    ctx.drawImage(img, STRIP_PADDING, y, STRIP_SHOT_WIDTH, scaledShotHeight);
    ctx.strokeStyle = theme.border;
    ctx.lineWidth = isPolaroid ? 6 : 2;
    ctx.strokeRect(STRIP_PADDING, y, STRIP_SHOT_WIDTH, scaledShotHeight);
  });

  drawDecorations(ctx, canvas, theme);

  ctx.fillStyle = theme.text;
  ctx.font = theme.font;
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
