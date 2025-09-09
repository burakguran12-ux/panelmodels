PanelModels — Upgrade Paketi
================================

Bu paket; gelişmiş bir `index.html`, otomatik manifest üretimi ve workflow ile birlikte gelir.

Kullanım
--------
1) Bu paketi repo köküne koyun (PanelModels/ altında).
2) `index-advanced.html` dosyasını **index.html** yerine kullanın (isterseniz adını index.html yapın).
3) İsterseniz GitHub Actions workflow'unu ekleyin:
   - `.github/workflows/generate-files.yml` dosyasını oluşturun ve buradaki içeriği kopyalayın.
   - Bundan sonra **her push'ta `files.json` otomatik güncellenir**.

Elle çalıştırma
---------------
- Node yüklüyse: `npm run gen` (package.json + generate-files.js ile) → `files.json` oluşur.
- Windows PowerShell için ayrı bir script de sağlayabilirim.

Paylaşılabilir link
-------------------
- Her model için: `?model=dosya.glb`
- Örn: `?model=models/atlas.glb`
