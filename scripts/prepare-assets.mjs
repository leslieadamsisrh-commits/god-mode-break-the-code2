import { cp, mkdir, readdir, copyFile, stat } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const jadeSrc = path.join(root, "combat-lab", "assets", "cyberkitty");
const jadeDst = path.join(root, "public", "assets", "shotgun-v57");

await mkdir(jadeDst, { recursive: true });
await cp(jadeSrc, jadeDst, { recursive: true, force: true });

async function findFile(dir, target, depth = 0) {
  if (depth > 8) return null;
  let entries;
  try { entries = await readdir(dir, { withFileTypes: true }); } catch { return null; }
  for (const entry of entries) {
    if (entry.name === ".git" || entry.name === "node_modules" || entry.name === ".next") continue;
    const full = path.join(dir, entry.name);
    if (entry.isFile() && entry.name === target) return full;
    if (entry.isDirectory()) {
      const hit = await findFile(full, target, depth + 1);
      if (hit) return hit;
    }
  }
  return null;
}

const cover = await findFile(root, "cover-destruction-atlas.png");
if (cover) {
  const envDir = path.join(root, "public", "assets", "environment");
  await mkdir(envDir, { recursive: true });
  await copyFile(cover, path.join(envDir, "cover-destruction-atlas.png"));
}

console.log("Prepared GOD MODE Combat Master 250px atlases:", jadeDst, cover ? "cover atlas copied" : "cover atlas optional/missing");
