# Mide el peso real (gzip) de lo que la carta descarga en la primera visita.
# Lee out/index.html, resuelve sus referencias y suma. docs/09 §1.
# Uso: pnpm budget  (requiere haber corrido pnpm build antes)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression

$root = Join-Path $PSScriptRoot '..'
$out = Join-Path $root 'out'
$index = Join-Path $out 'index.html'

if (-not (Test-Path $index)) { throw 'No existe out/index.html. Corre `pnpm build` primero.' }

function Get-GzKB([string]$path) {
  $bytes = [IO.File]::ReadAllBytes($path)
  $ms = New-Object IO.MemoryStream
  $gz = New-Object IO.Compression.GZipStream($ms, [IO.Compression.CompressionLevel]::Optimal)
  $gz.Write($bytes, 0, $bytes.Length)
  $gz.Close()
  return [math]::Round($ms.ToArray().Length / 1KB, 1)
}

$html = Get-Content $index -Raw
$refs = [regex]::Matches($html, '(?:/_next|/textures|/fonts)[^"''\)\s]+') |
  ForEach-Object { $_.Value } |
  Sort-Object -Unique

$grupos = @{ JS = 0.0; CSS = 0.0; Fuentes = 0.0; Texturas = 0.0 }

foreach ($ref in $refs) {
  $rel = $ref.TrimStart('/')
  $path = Join-Path $out $rel
  if (-not (Test-Path $path)) { continue }
  $kb = Get-GzKB $path
  switch -Wildcard ($ref) {
    '*.js' { $grupos.JS += $kb }
    '*.css' { $grupos.CSS += $kb }
    '*.woff2' { $grupos.Fuentes += $kb }
    default { $grupos.Texturas += $kb }
  }
}

$htmlKb = Get-GzKB $index
$total = $htmlKb + $grupos.JS + $grupos.CSS + $grupos.Fuentes + $grupos.Texturas

Write-Host ''
Write-Host 'Primera visita (gzip, solo lo referenciado por index.html)'
Write-Host ('  HTML      {0,7:N1} KB' -f $htmlKb)
Write-Host ('  JS        {0,7:N1} KB   presupuesto: 90 KB' -f $grupos.JS)
Write-Host ('  CSS       {0,7:N1} KB' -f $grupos.CSS)
Write-Host ('  Fuentes   {0,7:N1} KB' -f $grupos.Fuentes)
Write-Host ('  Texturas  {0,7:N1} KB' -f $grupos.Texturas)
Write-Host ('  ------------------------')
Write-Host ('  TOTAL     {0,7:N1} KB   presupuesto: 300 KB' -f $total)
Write-Host ''

if ($grupos.JS -gt 90) { Write-Host 'JS por encima del presupuesto (docs/09 §1).' -ForegroundColor Yellow }
if ($total -gt 300) { Write-Host 'Peso total por encima del presupuesto (docs/09 §1).' -ForegroundColor Yellow }
