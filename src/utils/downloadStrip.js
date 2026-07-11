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

/** Simple hand-drawn-style squiggle, used by the doodle theme. */
function drawScribble(ctx, x, y, size, color) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x, y);
  for (let i = 1; i <= 5; i++) {
    ctx.quadraticCurveTo(
      x + size * (i - 0.5) * 0.4,
      y + (i % 2 === 0 ? -size * 0.3 : size * 0.3),
      x + size * i * 0.4,
      y,
    );
  }
  ctx.stroke();
  ctx.restore();
}

/** Curved arrow doodle pointing toward a photo, used by the doodle theme. */
function drawArrow(ctx, x, y, length, angleDeg, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((angleDeg * Math.PI) / 180);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(length * 0.5, -length * 0.3, length, 0);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(length, 0);
  ctx.lineTo(length - 10, -6);
  ctx.lineTo(length - 10, 6);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawHeartOutline(ctx, x, y, size, color) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y + size / 4);
  ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + size / 4);
  ctx.bezierCurveTo(x - size / 2, y + size / 1.7, x, y + size, x, y + size * 1.1);
  ctx.bezierCurveTo(x, y + size, x + size / 2, y + size / 1.7, x + size / 2, y + size / 4);
  ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + size / 4);
  ctx.stroke();
  ctx.restore();
}

function drawCommentOutline(ctx, x, y, size, color) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x - size, y);
  ctx.arcTo(x - size, y - size, x, y - size, size * 0.4);
  ctx.arcTo(x + size, y - size, x + size, y, size * 0.4);
  ctx.arcTo(x + size, y + size * 0.5, x, y + size * 0.5, size * 0.4);
  ctx.lineTo(x - size * 0.3, y + size);
  ctx.lineTo(x - size * 0.3, y + size * 0.5);
  ctx.arcTo(x - size, y + size * 0.5, x - size, y, size * 0.4);
  ctx.closePath();
  ctx.stroke();
  ctx.restore();
}

function drawShareOutline(ctx, x, y, size, color) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - size, y + size * 0.7);
  ctx.lineTo(x + size, y - size * 0.1);
  ctx.lineTo(x - size, y - size * 0.9);
  ctx.lineTo(x - size * 0.3, y - size * 0.1);
  ctx.closePath();
  ctx.stroke();
  ctx.restore();
}

function drawPlayControls(ctx, centerX, y, color) {
  ctx.save();
  ctx.fillStyle = color;
  // previous (two triangles)
  ctx.beginPath();
  ctx.moveTo(centerX - 46, y);
  ctx.lineTo(centerX - 36, y - 8);
  ctx.lineTo(centerX - 36, y + 8);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(centerX - 36, y);
  ctx.lineTo(centerX - 26, y - 8);
  ctx.lineTo(centerX - 26, y + 8);
  ctx.closePath();
  ctx.fill();
  // play circle
  ctx.beginPath();
  ctx.arc(centerX, y, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#121212';
  ctx.beginPath();
  ctx.moveTo(centerX - 5, y - 8);
  ctx.lineTo(centerX - 5, y + 8);
  ctx.lineTo(centerX + 8, y);
  ctx.closePath();
  ctx.fill();
  // next (two triangles)
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(centerX + 26, y);
  ctx.lineTo(centerX + 36, y - 8);
  ctx.lineTo(centerX + 36, y + 8);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(centerX + 36, y);
  ctx.lineTo(centerX + 46, y - 8);
  ctx.lineTo(centerX + 46, y + 8);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function roundedRectPath(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** Row of little flower/leaf emoji used for the blossom theme's header/footer bands. */
function drawFlowerBand(ctx, canvas, bandTop, bandHeight) {
  const motifs = ['🌸', '🌼', '🍃', '🌸', '🌿', '🌼'];
  const count = 6;
  const spacing = canvas.width / count;
  ctx.save();
  ctx.font = '26px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (let i = 0; i < count; i++) {
    const x = spacing * i + spacing / 2;
    const y = bandTop + bandHeight / 2 + (i % 2 === 0 ? -4 : 4);
    ctx.fillText(motifs[i % motifs.length], x, y);
  }
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

  if (theme.decoration === 'doodle') {
    // scattered scribble, arrow, and stars around the strip like a scrapbook page
    drawScribble(ctx, canvas.width * 0.14, canvas.height * 0.08, 40, '#8a5fd6');
    drawArrow(ctx, canvas.width * 0.6, canvas.height * 0.1, 46, 35, '#e0507a');
    drawStar(ctx, canvas.width * 0.88, canvas.height * 0.06, 7, '#f2b705');
    drawStar(ctx, canvas.width * 0.1, canvas.height * 0.9, 6, '#e0507a');
  }

  if (theme.decoration === 'floral') {
    ctx.save();
    ctx.font = '30px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🦋', canvas.width * 0.86, canvas.height * 0.28);
    ctx.fillText('🦋', canvas.width * 0.14, canvas.height * 0.66);
    ctx.restore();
  }
}

/** Header content drawn above the photos (currently only the bold-title theme). */
function drawHeader(ctx, canvas, theme, headerHeight) {
  if (!headerHeight) return;
  if (theme.decoration === 'redbold') {
    ctx.save();
    ctx.fillStyle = theme.text;
    ctx.font = 'bold 26px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '2px';
    ctx.fillText('PORTRAIT OF US', canvas.width / 2, STRIP_PADDING + headerHeight / 2 + 9);
    ctx.restore();
  }
  if (theme.decoration === 'floral') {
    drawFlowerBand(ctx, canvas, STRIP_PADDING - 6, headerHeight);
  }
}

/** Footer content drawn below the photos; varies a lot per theme. */
function drawFooter(ctx, canvas, theme, footerTop, footerHeight) {
  const dateStr = new Date().toLocaleDateString();

  if (theme.decoration === 'social') {
    const iconY = footerTop + 26;
    drawHeartOutline(ctx, STRIP_PADDING + 12, iconY, 11, theme.text);
    drawCommentOutline(ctx, STRIP_PADDING + 48, iconY, 10, theme.text);
    drawShareOutline(ctx, STRIP_PADDING + 82, iconY, 10, theme.text);

    ctx.save();
    ctx.textAlign = 'left';
    ctx.fillStyle = theme.text;
    ctx.font = 'bold 15px -apple-system, Helvetica, Arial, sans-serif';
    ctx.fillText('Liked by you and 247 others', STRIP_PADDING, footerTop + 56);

    ctx.font = '14px -apple-system, Helvetica, Arial, sans-serif';
    ctx.fillText('two.of.us · our little photobooth moment 💛', STRIP_PADDING, footerTop + 78);

    ctx.fillStyle = theme.mutedText || '#8e8e8e';
    ctx.font = '12px -apple-system, Helvetica, Arial, sans-serif';
    ctx.fillText(dateStr.toUpperCase(), STRIP_PADDING, footerTop + 100);
    ctx.restore();
    return;
  }

  if (theme.decoration === 'player') {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.fillStyle = theme.text;
    ctx.font = 'bold 17px -apple-system, Helvetica, Arial, sans-serif';
    ctx.fillText('Two of Us', canvas.width / 2, footerTop + 22);

    ctx.fillStyle = theme.mutedText || '#a7a7a7';
    ctx.font = '13px -apple-system, Helvetica, Arial, sans-serif';
    ctx.fillText(dateStr, canvas.width / 2, footerTop + 40);

    // progress bar
    const barY = footerTop + 58;
    const barX = STRIP_PADDING + 6;
    const barW = canvas.width - STRIP_PADDING * 2 - 12;
    ctx.strokeStyle = theme.mutedText || '#555';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(barX, barY);
    ctx.lineTo(barX + barW, barY);
    ctx.stroke();
    ctx.strokeStyle = theme.accent || '#e8594c';
    ctx.beginPath();
    ctx.moveTo(barX, barY);
    ctx.lineTo(barX + barW * 0.4, barY);
    ctx.stroke();
    ctx.fillStyle = theme.accent || '#e8594c';
    ctx.beginPath();
    ctx.arc(barX + barW * 0.4, barY, 5, 0, Math.PI * 2);
    ctx.fill();

    drawPlayControls(ctx, canvas.width / 2, footerTop + 92, theme.text);
    ctx.restore();
    return;
  }

  if (theme.decoration === 'doodle') {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.fillStyle = '#e0507a';
    ctx.font = '26px "Comic Sans MS", cursive';
    ctx.fillText('xoxo', canvas.width * 0.28, footerTop + 30);

    ctx.fillStyle = theme.text;
    ctx.font = theme.font;
    ctx.fillText(`Two of Us · ${dateStr}`, canvas.width / 2, footerTop + 62);
    ctx.restore();
    return;
  }

  if (theme.decoration === 'redbold') {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.fillStyle = theme.border;
    ctx.font = '16px Georgia, serif';
    ctx.fillText(dateStr, canvas.width / 2, footerTop + 30);
    ctx.restore();
    return;
  }

  if (theme.decoration === 'floral') {
    drawFlowerBand(ctx, canvas, footerTop, footerHeight);
    return;
  }

  // default caption used by classic / love / noir / polaroid / datenight themes
  ctx.save();
  ctx.fillStyle = theme.text;
  ctx.font = theme.font;
  ctx.textAlign = 'center';
  ctx.fillText(`Two of Us · ${dateStr}`, canvas.width / 2, footerTop + footerHeight - 38);
  ctx.restore();
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
  const headerHeight = theme.headerHeight || 0;
  const footerHeight = theme.footerHeight || STRIP_FOOTER_HEIGHT;

  const canvas = document.createElement('canvas');
  canvas.width = STRIP_SHOT_WIDTH + STRIP_PADDING * 2;
  canvas.height =
    STRIP_PADDING * 2 +
    headerHeight +
    shots.length * scaledShotHeight +
    (shots.length - 1) * photoBottomGap +
    footerHeight;

  const ctx = canvas.getContext('2d');
  ctx.fillStyle = theme.background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawHeader(ctx, canvas, theme, headerHeight);

  const images = await Promise.all(shots.map(loadImage));

  images.forEach((img, i) => {
    const y = STRIP_PADDING + headerHeight + i * (scaledShotHeight + photoBottomGap);

    if (theme.roundedCorners) {
      const radius = 18;
      ctx.save();
      roundedRectPath(ctx, STRIP_PADDING, y, STRIP_SHOT_WIDTH, scaledShotHeight, radius);
      ctx.clip();
      ctx.drawImage(img, STRIP_PADDING, y, STRIP_SHOT_WIDTH, scaledShotHeight);
      ctx.restore();
      ctx.strokeStyle = theme.border;
      ctx.lineWidth = 5;
      roundedRectPath(ctx, STRIP_PADDING, y, STRIP_SHOT_WIDTH, scaledShotHeight, radius);
      ctx.stroke();
    } else {
      ctx.drawImage(img, STRIP_PADDING, y, STRIP_SHOT_WIDTH, scaledShotHeight);
      ctx.strokeStyle = theme.border;
      ctx.lineWidth = isPolaroid ? 6 : 2;
      ctx.strokeRect(STRIP_PADDING, y, STRIP_SHOT_WIDTH, scaledShotHeight);
    }

    if (theme.decoration === 'floral') {
      const caption = theme.captions?.[i % theme.captions.length];
      if (caption) {
        const onLeft = i % 2 === 0;
        const captionX = onLeft ? STRIP_PADDING + 60 : STRIP_PADDING + STRIP_SHOT_WIDTH - 60;
        const captionY = y + scaledShotHeight - 24;
        ctx.save();
        ctx.translate(captionX, captionY);
        ctx.rotate((onLeft ? -6 : 6) * (Math.PI / 180));
        ctx.fillStyle = theme.text;
        ctx.font = theme.font;
        ctx.textAlign = 'center';
        ctx.fillText(caption, 0, 0);
        ctx.restore();
      }
    }
  });

  drawDecorations(ctx, canvas, theme);

  const footerTop = canvas.height - footerHeight;
  drawFooter(ctx, canvas, theme, footerTop, footerHeight);

  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();
}
