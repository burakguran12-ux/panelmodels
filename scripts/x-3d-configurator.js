// scripts/x-3d-configurator.js
// Model-Viewer'ı CDN'den yüklüyorsun (index.html'de), burada sadece modele bağlanıyoruz.

const ROOT = new URL('..', import.meta.url); // /scripts/ -> repo kökü
const viewer = document.querySelector('model-viewer');

async function loadCatalog() {
  const candidates = ['models.json', 'files.json'];
  for (const name of candidates) {
    try {
      const res = await fetch(new URL(name, ROOT), { cache: 'no-store' });
      if (res.ok) return { name, data: await res.json() };
    } catch (_) {}
  }
  return null;
}

(async () => {
  if (!viewer) {
    console.error('model-viewer etiketi bulunamadı.');
    return;
  }

  const cat = await loadCatalog();
  if (!cat || !cat.data || cat.data.length === 0) {
    console.warn('JSON kataloglarında model bulunamadı (models.json / files.json).');
    return;
  }

  let relPath = cat.name === 'models.json' ? cat.data[0].path : cat.data[0];
  const srcUrl = new URL(relPath, ROOT).toString();

  // temel ayarlar
  viewer.src = srcUrl;
  viewer.cameraControls = true;
  viewer.autoreveal = true;
  viewer.shadowIntensity = 1;

  console.log('Yüklenen model:', srcUrl);
})();
