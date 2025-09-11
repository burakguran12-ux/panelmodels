// generate-files.js
import { promises as fs } from 'fs';
import path from 'path';

const ROOT = process.cwd();
const MODELS_DIR = path.join(ROOT, 'models');
const THUMBS_DIR = path.join(ROOT, 'thumbs');

function toPosix(p) { return p.split(path.sep).join('/'); }
function titleize(basename) {
  const name = basename.replace(/\.[^.]+$/, '');
  return name.charAt(0).toUpperCase() + name.slice(1) + ' Panel';
}

async function fileExists(p) {
  try { await fs.access(p); return true; } catch { return false; }
}

async function walkGlb(dir, acc = []) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) await walkGlb(full, acc);
    else if (e.isFile() && e.name.toLowerCase().endsWith('.glb')) {
      acc.push(full);
    }
  }
  return acc;
}

(async () => {
  // 1) files.json (tüm .glb yolları)
  const glbAbs = await walkGlb(MODELS_DIR, []);
  const glbRel = glbAbs
    .map(f => toPosix(path.relative(ROOT, f)))
    .sort((a, b) => a.localeCompare(b));
  await fs.writeFile('files.json', JSON.stringify(glbRel, null, 2));
  console.log(`✓ files.json (${glbRel.length})`);

  // 2) catalog.json (galeri için)
  const catalog = [];
  for (const rel of glbRel) {
    const base = path.basename(rel, path.extname(rel)).toLowerCase();
    const name = titleize(base);
    const thumbPath = path.join(THUMBS_DIR, `${base}.png`);
    const thumbRel = await fileExists(thumbPath)
      ? toPosix(path.relative(ROOT, thumbPath))
      : 'thumbs/default.png';

    catalog.push({
      name,
      src: rel,
      thumb: thumbRel,
      targetMaterials: ['mdf-panel']
    });
  }

  await fs.writeFile('catalog.json', JSON.stringify(catalog, null, 2));
  console.log(`✓ catalog.json (${catalog.length})`);
})();
