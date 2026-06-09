// v1.0.0 | 2026-06-09 MEZ
// Generates PWA icons as real PNGs – no external deps (uses built-in zlib)
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function crc32(buf) {
  let crc = 0xFFFFFFFF;
  const table = new Uint32Array(256).map((_, i) => {
    let c = i;
    for (let j = 0; j < 8; j++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    return c;
  });
  for (const byte of buf) crc = table[(crc ^ byte) & 0xFF] ^ (crc >>> 8);
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const t = Buffer.from(type);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([t, data])));
  return Buffer.concat([len, t, data, crc]);
}

function makePNG(width, height, drawFn) {
  // Build raw RGBA rows
  const rows = [];
  for (let y = 0; y < height; y++) {
    const row = Buffer.alloc(width * 4);
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = drawFn(x, y, width, height);
      row.writeUInt8(r, x * 4);
      row.writeUInt8(g, x * 4 + 1);
      row.writeUInt8(b, x * 4 + 2);
      row.writeUInt8(a, x * 4 + 3);
    }
    // PNG filter byte 0 (None) prepended to each row
    rows.push(Buffer.concat([Buffer.from([0]), row]));
  }
  const raw = Buffer.concat(rows);
  const compressed = zlib.deflateSync(raw);

  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 6;  // RGBA
  ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;

  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', compressed),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

function drawIcon(x, y, w, h) {
  const cx = w / 2, cy = h / 2;
  // Background: dark blue #1a2a3a with rounded feel
  const margin = w * 0.07;
  if (x < margin || x > w - margin || y < margin || y > h - margin) {
    const r = w * 0.15;
    const dx = Math.max(margin - x, 0, x - (w - margin));
    const dy = Math.max(margin - y, 0, y - (h - margin));
    if (Math.sqrt(dx*dx + dy*dy) > r) return [0, 0, 0, 0]; // transparent corner
  }

  // Mountain triangle: peak at (cx, h*0.08), base at (h*0.82)
  const peakY = h * 0.08, baseY = h * 0.82;
  const peakX = cx;
  // Check if point inside mountain triangle
  const leftEdge  = peakX - (y - peakY) / (baseY - peakY) * (cx - w * 0.10);
  const rightEdge = peakX + (y - peakY) / (baseY - peakY) * (w * 0.90 - cx);
  const inMountain = y >= peakY && y <= baseY && x >= leftEdge && x <= rightEdge;

  // Snow cap: top 30% of mountain
  const snowBase = peakY + (baseY - peakY) * 0.28;
  const leftSnow  = peakX - (y - peakY) / (snowBase - peakY) * cx * 0.32;
  const rightSnow = peakX + (y - peakY) / (snowBase - peakY) * cx * 0.32;
  const inSnow = y >= peakY && y <= snowBase && x >= leftSnow && x <= rightSnow;

  if (inSnow) return [240, 248, 255, 255];
  if (inMountain) return [84, 110, 122, 255];

  // Hiker body (simple green dot + stick)
  const hx = cx - w * 0.05, headY = h * 0.58;
  if (Math.sqrt((x - hx) ** 2 + (y - headY) ** 2) < w * 0.055) return [76, 175, 80, 255];
  if (x > hx - w*0.06 && x < hx + w*0.06 && y > headY && y < headY + h*0.18) return [76, 175, 80, 255];

  // Background
  return [26, 42, 58, 255];
}

const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir);

[192, 512].forEach(size => {
  const buf = makePNG(size, size, drawIcon);
  fs.writeFileSync(path.join(publicDir, `pwa-${size}x${size}.png`), buf);
  console.log(`✅ pwa-${size}x${size}.png (${buf.length} bytes)`);
});

// apple-touch-icon
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), makePNG(180, 180, drawIcon));
console.log('✅ apple-touch-icon.png');

// favicon (simple 32x32)
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), makePNG(32, 32, drawIcon));
console.log('✅ favicon.ico (PNG-encoded)');
