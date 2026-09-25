import sharp from "../node_modules/.pnpm/sharp@0.35.4_@types+node@22.19.19/node_modules/sharp/dist/index.mjs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve("public/assets/r13");

const sheets = [
  { id: "floor-navigation", input: "arena-floor-navigation-atlas-v1.png", output: "arena-floor-navigation-atlas-v2.png", anchor: "ground" },
  { id: "rear-architecture", input: "arena-rear-architecture-atlas-v1.png", output: "arena-rear-architecture-atlas-v2.png", anchor: "ground" },
  { id: "overhead-stadium", input: "arena-overhead-stadium-atlas-v1.png", output: "arena-overhead-stadium-atlas-v2.png", anchor: "ceiling" },
  { id: "broadcast-trench", input: "arena-broadcast-trench-atlas-v1.png", output: "arena-broadcast-trench-atlas-v2.png", anchor: "foreground" },
];

function isBackdrop(data, offset, channels) {
  const r = data[offset], g = data[offset + 1], b = data[offset + 2];
  const high = Math.max(r, g, b), low = Math.min(r, g, b);
  const alpha = channels === 4 ? data[offset + 3] : 255;
  return alpha < 12 || (high - low < 22 && (r + g + b) / 3 > 160);
}

function removeConnectedMatte(data, width, height, channels) {
  const count = width * height;
  const outside = new Uint8Array(count);
  const queue = new Int32Array(count);
  let head = 0, tail = 0;
  const visit = (index) => {
    if (index < 0 || index >= count || outside[index]) return;
    if (!isBackdrop(data, index * channels, channels)) return;
    outside[index] = 1;
    queue[tail++] = index;
  };
  for (let x = 0; x < width; x++) { visit(x); visit((height - 1) * width + x); }
  for (let y = 1; y < height - 1; y++) { visit(y * width); visit(y * width + width - 1); }
  while (head < tail) {
    const i = queue[head++], x = i % width;
    if (x) visit(i - 1);
    if (x < width - 1) visit(i + 1);
    if (i >= width) visit(i - width);
    if (i < count - width) visit(i + width);
  }
  const rgba = Buffer.alloc(count * 4);
  for (let i = 0; i < count; i++) {
    const src = i * channels, dst = i * 4;
    rgba[dst] = data[src]; rgba[dst + 1] = data[src + 1]; rgba[dst + 2] = data[src + 2];
    rgba[dst + 3] = outside[i] ? 0 : (channels === 4 ? data[src + 3] : 255);
  }
  return rgba;
}

function components(rgba, width, height) {
  const count = width * height, seen = new Uint8Array(count), queue = new Int32Array(count), result = [];
  const solid = (i) => rgba[i * 4 + 3] > 24;
  for (let start = 0; start < count; start++) {
    if (seen[start] || !solid(start)) continue;
    let head = 0, tail = 0, minX = width, minY = height, maxX = 0, maxY = 0, pixels = 0;
    seen[start] = 1; queue[tail++] = start;
    while (head < tail) {
      const i = queue[head++], x = i % width, y = (i / width) | 0;
      minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y); pixels++;
      const add = (n) => { if (!seen[n] && solid(n)) { seen[n] = 1; queue[tail++] = n; } };
      if (x) add(i - 1); if (x < width - 1) add(i + 1); if (y) add(i - width); if (y < height - 1) add(i + width);
    }
    if (pixels > 1200 && maxX - minX > 24 && maxY - minY > 24) result.push({ x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1, pixels });
  }
  return result.sort((a, b) => a.y - b.y || a.x - b.x);
}

function anchors(frame, kind) {
  const cx = Math.round(frame.w / 2);
  if (kind === "ceiling") return { ceiling: { x: cx, y: 0 }, shadowOrigin: { x: cx, y: frame.h } };
  if (kind === "foreground") return { screenBottom: { x: cx, y: frame.h }, occlusionTop: { x: cx, y: Math.round(frame.h * .24) } };
  return { groundCenter: { x: cx, y: frame.h }, collisionCenter: { x: cx, y: Math.round(frame.h * .68) }, topCenter: { x: cx, y: 0 } };
}

await mkdir(root, { recursive: true });
const registry = { version: "R13-modular-architecture-v2", sourcePlate: "dimension33-architectural-master-plate-v1.png", sheets: {} };
for (const sheet of sheets) {
  const source = sharp(path.join(root, sheet.input));
  const { data, info } = await source.raw().toBuffer({ resolveWithObject: true });
  const rgba = removeConnectedMatte(data, info.width, info.height, info.channels);
  await sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } }).png({ compressionLevel: 9, adaptiveFiltering: true }).toFile(path.join(root, sheet.output));
  const frames = components(rgba, info.width, info.height).map((frame, index) => ({ id: `${sheet.id}-${String(index + 1).padStart(2, "0")}`, ...frame, anchors: anchors(frame, sheet.anchor) }));
  registry.sheets[sheet.id] = { file: sheet.output, width: info.width, height: info.height, alpha: true, frames };
}
await writeFile(path.join(root, "arena-sprite-frames.json"), `${JSON.stringify(registry, null, 2)}\n`);
console.log(JSON.stringify(Object.fromEntries(Object.entries(registry.sheets).map(([id, value]) => [id, value.frames.length])), null, 2));
