# Genera los assets de marca rasterizados que Next no puede producir en un
# export estático sin runtime: apple-icon.png y brand/og.jpg.
# Se ejecuta a mano cuando cambie la marca; el resultado se comitea.
#
# Tipografía: Georgia, que es exactamente el fallback declarado para Fraunces
# en docs/02 §3.1. Cuando exista wordmark.svg, este script se reemplaza por su
# rasterizado.

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$root = Resolve-Path (Join-Path $PSScriptRoot '..')
$publicDir = Join-Path $root 'public'
$brandDir = Join-Path $publicDir 'brand'
$appDir = Join-Path $root 'src\app'
New-Item -ItemType Directory -Force -Path $brandDir | Out-Null

# Paleta, tomada de tokens.css
$madera900 = [System.Drawing.ColorTranslator]::FromHtml('#15100b')
$madera800 = [System.Drawing.ColorTranslator]::FromHtml('#1c1510')
$laton500 = [System.Drawing.ColorTranslator]::FromHtml('#b08d57')
$laton300 = [System.Drawing.ColorTranslator]::FromHtml('#e3c77e')
$hueso300 = [System.Drawing.ColorTranslator]::FromHtml('#dccdb6')
$candela = [System.Drawing.ColorTranslator]::FromHtml('#e0752f')

function New-Canvas([int]$w, [int]$h) {
  $bmp = New-Object System.Drawing.Bitmap($w, $h)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = 'AntiAlias'
  $g.TextRenderingHint = 'ClearTypeGridFit'
  $g.InterpolationMode = 'HighQualityBicubic'

  # Base de madera: degradado vertical + viñeta radial simulada con tablones
  $rect = New-Object System.Drawing.Rectangle(0, 0, $w, $h)
  $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $madera800, $madera900, 80.0)
  $g.FillRectangle($brush, $rect)
  $brush.Dispose()

  # Tablones verticales cada 118 px, como la capa 2 de WoodBackdrop
  $junta = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(140, 14, 11, 8), 2)
  $filo = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(14, 246, 239, 227), 1)
  for ($x = 0; $x -lt $w; $x += 118) {
    $g.DrawLine($junta, $x, 0, $x, $h)
    $g.DrawLine($filo, $x + 2, 0, $x + 2, $h)
  }
  $junta.Dispose(); $filo.Dispose()

  return @{ Bitmap = $bmp; Graphics = $g }
}

function Draw-Horseshoe($g, [single]$cx, [single]$cy, [single]$size, [single]$grosor) {
  # Herradura abierta hacia abajo: la suerte se guarda.
  $pen = New-Object System.Drawing.Pen($laton300, $grosor)
  $pen.StartCap = 'Round'
  $pen.EndCap = 'Round'
  $r = $size / 2
  $g.DrawArc($pen, $cx - $r, $cy - $r, $size, $size, 180, 180)
  $brazo = $size * 0.42
  $g.DrawLine($pen, $cx - $r, $cy, $cx - $r, $cy + $brazo)
  $g.DrawLine($pen, $cx + $r, $cy, $cx + $r, $cy + $brazo)
  $pen.Dispose()

  # Clavos
  $clavo = New-Object System.Drawing.SolidBrush($laton500)
  $d = $size * 0.09
  foreach ($p in @(@(-0.30, -0.30), @(0.30, -0.30), @(-0.42, 0.02), @(0.42, 0.02))) {
    $g.FillEllipse($clavo, $cx + $r * 2 * $p[0] - $d / 2, $cy + $r * 2 * $p[1] - $d / 2, $d, $d)
  }
  $clavo.Dispose()
}

# ── apple-icon.png · 180×180 ────────────────────────────────────────
$c = New-Canvas 180 180
$g = $c.Graphics
$borde = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(120, 176, 141, 87), 3)
$g.DrawRectangle($borde, 3, 3, 173, 173)
$borde.Dispose()
Draw-Horseshoe $g 90 82 78 13
$c.Bitmap.Save((Join-Path $appDir 'apple-icon.png'), [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose(); $c.Bitmap.Dispose()
Write-Host 'src/app/apple-icon.png  180x180'

# ── brand/og.jpg · 1200×630 ─────────────────────────────────────────
$c = New-Canvas 1200 630
$g = $c.Graphics

# Marco de latón, como el plankFramed de la portada
$marco = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(90, 176, 141, 87), 2)
$g.DrawRectangle($marco, 40, 40, 1119, 549)
$marco.Dispose()

Draw-Horseshoe $g 600 148 92 14

$centrado = New-Object System.Drawing.StringFormat
$centrado.Alignment = 'Center'

$fWordmark = New-Object System.Drawing.Font('Georgia', 76, [System.Drawing.FontStyle]::Bold)
$fLema = New-Object System.Drawing.Font('Georgia', 34, [System.Drawing.FontStyle]::Regular)
$fPie = New-Object System.Drawing.Font('Georgia', 20, [System.Drawing.FontStyle]::Italic)

$bWordmark = New-Object System.Drawing.SolidBrush($laton300)
$bSombra = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(190, 24, 13, 5))
$bLema = New-Object System.Drawing.SolidBrush($hueso300)
$bPie = New-Object System.Drawing.SolidBrush($candela)

# El "quemado" se simula con una sombra oscura desplazada bajo el trazo claro
$g.DrawString('FONDA AZABACHE', $fWordmark, $bSombra, 603, 253, $centrado)
$g.DrawString('FONDA AZABACHE', $fWordmark, $bWordmark, 600, 250, $centrado)

$g.DrawString('Aquí se bebe bueno, se canta duro', $fLema, $bLema, 600, 384, $centrado)
$g.DrawString('y se sufre bonito.', $fLema, $bLema, 600, 434, $centrado)
$g.DrawString('Carta de licores  ·  Medellín', $fPie, $bPie, 600, 520, $centrado)

$encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$params = New-Object System.Drawing.Imaging.EncoderParameters(1)
$params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 72)
$ogPath = Join-Path $brandDir 'og.jpg'
$c.Bitmap.Save($ogPath, $encoder, $params)

foreach ($o in @($fWordmark, $fLema, $fPie, $bWordmark, $bSombra, $bLema, $bPie, $centrado, $g, $c.Bitmap)) { $o.Dispose() }

$kb = [math]::Round((Get-Item $ogPath).Length / 1KB, 1)
Write-Host "public/brand/og.jpg     1200x630  $kb KB"
