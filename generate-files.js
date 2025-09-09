// generate-files.js
// KULLANIM: `node generate-files.js`
// Bulunduğu klasörden başlayarak tüm alt klasörlerdeki .glb dosyalarını tarar
// ve files.json'a POSIX (/) ayıracıyla göreli yolları yazar.

import { promises as fs } from 'fs';
import path from 'path';

const ROOT = process.cwd();

async function walk(dir, acc=[]) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      await walk(full, acc);
    } else if (e.isFile() && e.name.toLowerCase().endsWith('.glb')) {
      const rel = path.relative(ROOT, full).split(path.sep).join('/'); // posix
      acc.push(rel);
    }
  }
  return acc;
}

(async () => {
  const files = await walk(ROOT, []);
  files.sort((a,b)=> a.localeCompare(b));
  const json = JSON.stringify(files, null, 2);
  await fs.writeFile(path.join(ROOT, 'files.json'), json, 'utf8');
  console.log(`✓ files.json oluşturuldu (${files.length} model)`);
})();