# Corre la misma secuencia que el CI, en orden, y para en el primer fallo.
# Uso: pnpm verify

$ErrorActionPreference = 'Continue'
$pasos = @(
  @{ Nombre = 'content:check'; Cmd = 'content:check' },
  @{ Nombre = 'lint (eslint + stylelint + tsc)'; Cmd = 'lint' },
  @{ Nombre = 'format:check'; Cmd = 'format:check' },
  @{ Nombre = 'build (export estatico)'; Cmd = 'build' }
)

foreach ($paso in $pasos) {
  & pnpm run $paso.Cmd *> $null
  if ($LASTEXITCODE -ne 0) {
    Write-Host ("[FALLA]  " + $paso.Nombre) -ForegroundColor Red
    Write-Host ("         Corre `pnpm " + $paso.Cmd + "` para ver el detalle.")
    exit 1
  }
  Write-Host ("[OK]     " + $paso.Nombre) -ForegroundColor Green
}

Write-Host ''
& pnpm run budget
