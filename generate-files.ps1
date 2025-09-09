# generate-files.ps1
# KULLANIM: PowerShell penceresinde bu dosyanın olduğu klasörde:
#   .\generate-files.ps1
# - Tüm alt klasörlerle birlikte *.glb dosyalarını tarar ve files.json yazar.

$ErrorActionPreference = "Stop"

$root = Get-Location
$files = Get-ChildItem -Recurse -File -Include *.glb | ForEach-Object {
    # Göreli yol ve POSIX ayıracı
    $rel = Resolve-Path -Relative $_.FullName
    $rel = $rel -replace '\\', '/'
    $rel.TrimStart('./')
}

# Sırala
$files = $files | Sort-Object

# JSON yaz
$json = $files | ConvertTo-Json -Depth 3
Set-Content -Path (Join-Path $root 'files.json') -Value $json -Encoding UTF8

Write-Host ("`u2713 files.json oluşturuldu ({0} model)" -f $files.Count)
