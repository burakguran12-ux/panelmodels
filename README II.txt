Manifest Tools (files.json otomatikleyici)
==========================================

Bu araçlar, repo kökünden itibaren *tüm alt klasörlerdeki* `.glb` dosyalarını tarayıp
`files.json` dosyasını otomatik oluşturur.

Seçenek 1 — Node.js ile
-----------------------
1) Bu dosyaları repo *kök klasörüne* kopyalayın:
   - generate-files.js
   - package.json
2) Node yüklü değilse: https://nodejs.org
3) Komut satırında (repo klasöründe):
   npm run gen
   # veya
   node generate-files.js

Seçenek 2 — PowerShell ile (Windows)
------------------------------------
1) `generate-files.ps1` dosyasını repo *kök klasörüne* kopyalayın.
2) PowerShell açın, repo klasörüne gidin ve çalıştırın:
   .\generate-files.ps1

Sonra:
------
- `files.json` güncellenecek → GitHub Desktop'ta **Commit** ve **Push** yapın.
- Siteniz otomatik olarak yeni liste ile güncellenecek.
