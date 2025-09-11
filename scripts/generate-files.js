// scripts/generate-files.js
// Node 18/20 uyumlu (CommonJS, ESM gerektirmez)

const fs = require("fs").promises;
const path = require("path");

const ROOT = process.cwd();
const MODELS_DIR = path.join(ROOT, "models");
const THUMBS_DIR = path.join(ROOT, "thumbs");

// Yardımcılar
const toPosix = (p) => p.split(path.sep).join("/"); // windows \ -> /
const basenameNoExt = (p) => path.basename(p, path.extname(p));
const sortLocale = (a, b) => a.localeCompare(b, "en", { numeric: true, sensitivity: "base" });

async function walk(dir, filterFn) {
  const out = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      out.push(...(await walk(full, filterFn)));
    } else if (e.isFile()) {
      if (!filterFn || filterFn(full)) out.push(full);
    }
  }
  return out;
}

async function ensureExists(p) {
  try { await fs.access(p); }
  catch {
    throw new Error(`Gerekli klasör bulunamadı: ${toPosix(path.relative(ROOT, p))}`);
  }
}

async function main() {
  console.log("▶️  generate-files.js başlıyor…");

  await ensureExists(MODELS_DIR);
  await ensureExists(THUMBS_DIR);

  // 1) Modelleri tara (.glb)
  const glbs = (await walk(MODELS_DIR, (f) => path.extname(f).toLowerCase() === ".glb"))
    .map((abs) => toPosix(path.relative(ROOT, abs)))
    .sort(sortLocale);

  // 2) Thumbnail’ları tara (.png/.webp)
  const thumbs = (await walk(THUMBS_DIR, (f) => [".png", ".webp"].includes(path.extname(f).toLowerCase())))
    .map((abs) => toPosix(path.relative(ROOT, abs)))
    .sort(sortLocale);

  // 3) Eşleştirme: aynı basename’e sahip olanları bağla
  const thumbMap = new Map(
    thumbs.map((p) => [basenameNoExt(p).toLowerCase(), p])
  );

  const models = glbs.map((p) => {
    const id = basenameNoExt(p);
    const key = id.toLowerCase();
    const thumb = thumbMap.get(key) || null;
    return {
      id,                     // "antares" gibi
      name: id,               // UI’da göstermek istersen
      path: p,                // "models/antares.glb"
      thumb,                  // "thumbs/antares.png" | null
      ext: ".glb",
    };
  });

  // 4) Çıktıları yaz
  const outFiles = [
    ["files.json", glbs],
    ["thumbs.json", thumbs],
    ["models.json", models],
  ];

  for (const [filename, data] of outFiles) {
    const json = JSON.stringify(data, null, 2) + "\n";
    await fs.writeFile(path.join(ROOT, filename), json, "utf8");
    console.log(`✅ ${filename} yazıldı (${typeof data === "object" ? (Array.isArray(data) ? data.length : Object.keys(data).length) : "?"} kayıt)`);
  }

  // 5) Basit sağlık uyarıları
  const missingThumbs = models.filter((m) => !m.thumb).map((m) => m.id);
  if (missingThumbs.length) {
    console.warn(`⚠️  Thumbnail bulunamayan modeller: ${missingThumbs.join(", ")}`);
    console.warn(`    Eşleştirme kuralları: "models/foo.glb" ↔ "thumbs/foo.png|webp" (aynı basename)`);
  }

  console.log("🎯 Bitti.");
}

main().catch((err) => {
  console.error("❌ Hata:", err.message);
  process.exit(1);
});
