# Descarga los woff2 variables (subset latin) de Fraunces e Instrument Sans
# desde Google Fonts y los deja en public/fonts/. Se ejecuta una sola vez;
# los archivos resultantes se comitean (docs/02 §3.1).

$ErrorActionPreference = 'Stop'
$ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36'
$out = Join-Path $PSScriptRoot '..\public\fonts'
New-Item -ItemType Directory -Force -Path $out | Out-Null

function Get-LatinWoff2 {
  param([string]$Url, [string]$Style)
  $css = (Invoke-WebRequest -Uri $Url -UserAgent $ua -UseBasicParsing).Content
  $blocks = [regex]::Matches($css, '@font-face\s*\{[^}]*\}')
  foreach ($b in $blocks) {
    $t = $b.Value
    if ($t -notmatch 'U\+0000-00FF') { continue }
    if ($Style -eq 'italic' -and $t -notmatch 'font-style:\s*italic') { continue }
    if ($Style -eq 'normal' -and $t -match 'font-style:\s*italic') { continue }
    if ($t -match "url\((https://fonts\.gstatic\.com/[^)]+\.woff2)\)") { return $Matches[1] }
  }
  throw "No se encontró el subset latin para $Url ($Style)"
}

$fraunces = 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300..700&display=swap'
# La itálica solo se usa en coplas (--t-copla: display 400 itálica). Se pide
# fijada en opsz 72 / wght 400 para no pagar un variable completo de ~80 KB.
$frauncesItalic = 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@1,72,400&display=swap'
$instrument = 'https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400..700&display=swap'

$targets = @(
  @{ Url = $fraunces;       Style = 'normal'; File = 'Fraunces-Variable.woff2' },
  @{ Url = $frauncesItalic; Style = 'italic'; File = 'Fraunces-Italic.woff2' },
  @{ Url = $instrument;     Style = 'normal'; File = 'InstrumentSans-Variable.woff2' }
)

foreach ($t in $targets) {
  $src = Get-LatinWoff2 -Url $t.Url -Style $t.Style
  $dest = Join-Path $out $t.File
  Invoke-WebRequest -Uri $src -OutFile $dest -UserAgent $ua -UseBasicParsing
  $kb = [math]::Round((Get-Item $dest).Length / 1KB, 1)
  Write-Host "$($t.File)  $kb KB"
}
