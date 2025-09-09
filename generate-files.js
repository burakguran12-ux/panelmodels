// generate-files.js
import { promises as fs } from 'fs';
import path from 'path';
const ROOT = process.cwd();
async function walk(dir, acc=[]) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) await walk(full, acc);
    else if (e.isFile() && e.name.toLowerCase().endsWith('.glb')) {
      const rel = path.relative(ROOT, full).split(path.sep).join('/');
      acc.push(rel);
    }
  }
  return acc;
}
const files = (await walk(ROOT, [])).sort((a,b)=> a.localeCompare(b));
await fs.writeFile('files.json', JSON.stringify(files, null, 2));
console.log(`✓ files.json (${files.length})`);
