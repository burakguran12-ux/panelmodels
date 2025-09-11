#!/usr/bin/env node
const fs = require("fs/promises");
const path = require("path");

const ROOT = process.cwd();
const MODELS_DIR = path.join(ROOT, "models");
const THUMBS_DIR = path.join(ROOT, "thumbs");

// === Yardımcı Fonksiyonlar ===

// Dosya uzantısı olmadan isim döndür
function basenameNoExt(p) {
  return path.basename(p, path.extname(p));
}

// Title Case (örn: "vega" -> "Vega", "diamond_panel" -> "Diamond Panel")
function toTitleCase(str) {
  return str
    .toLowerCase()
    .replace(/(^|\s|_|-)\S/g, s => s.toUpperCase());
}

// Klasörü dolaş
async function walk(dir) {
  const files = await fs.readdir(dir, { withFileTypes: true });
  const out = [];
  for (const f of files) {
    const full = path.join(dir, f.name);
    if (f.isDirectory()) {
      out.push(...(await walk(full)));
    } else {
      out.push(full);
    }
  }
  return out;
}

async function main() {
  console.log("🚀 JSON katalogları oluşturuluyor...");

  const modelFiles = (await walk(MODELS_DIR)).filter(f => f.endsWith(".glb"));
  const thumbFiles = (await walk(THUMBS_DIR)).filter(f =>
    [".png", ".jpg", ".jpeg", ".webp"].some(ext => f.toLowerCase().endsWith(ext))
  );

  // === Thumb eşlemesi ===
  const thumbMap = new Map();
  for (const t of thumbFiles) {
    const id = basenameNoExt(t).toLowerCase();
    thumbMap.set(id, path.relative(ROOT, t).replace(/\\/g, "/"));
  }

  // === Models.json için veri ===
  const models = modelFiles.map((p) => {
    const id = basenameNoExt(p);
    const key = id.toLowerCase();
    const thumb = thumbMap.get(key) || null;
    return {
      id,
      name: toTitleCase(id),
      path: path.relative(ROOT, p).replace(/\\/g, "/"),
      thumb,
      ext: ".glb",
    };
  });

  // === Catalog.json için veri ===
  const catalog = models.map(m => ({
    name: `${m.name} Panel`,
    src: m.path,
    thumb: m.thumb || "thumbs/default.png",
    targetMaterials: ["mdf-panel"],
    defaults: { cameraPreset: "iso45", rotationY: 0 }
  }));

  // === Çıktı dosyaları ===
  const outFiles = [
    ["files.json", modelFiles.map(p => path.relative(ROOT, p).replace(/\\/g, "/"))],
    ["thumbs.json", thumbFiles.map(p => path.relative(ROOT, p).replace(/\\/g, "/"))],
    ["models.json", models],
    ["catalog.json", catalog],
  ];

  for (const [filename, data] of outFiles) {
    const json = JSON.stringify(data, null, 2) + "\n";
    await fs.writeFile(path.join(ROOT, filename), json, "utf8");
    console.log(`✅ ${filename} yazıldı (${Array.isArray(data) ? data.length : Object.keys(data).length} kayıt)`);
  }

  console.log("🎉 Katalog üretimi tamamlandı!");
}

main().catch(err => {
  console.error("❌ Hata:", err);
  process.exit(1);
});
