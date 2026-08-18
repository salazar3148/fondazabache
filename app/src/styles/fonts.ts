import localFont from 'next/font/local';

/**
 * docs/02 §3.1 · Fuentes autohospedadas en public/fonts (subset latin).
 * Se descargan una sola vez con scripts/fetch-fonts.ps1 y se comitean.
 *
 * Nota: el woff2 de Google expone los ejes registrados (opsz, wght, ital).
 * Los ejes propios de Fraunces (SOFT, WONK) no vienen en ese archivo, así que
 * `font-variation-settings: 'SOFT' .. 'WONK' ..` actúa como mejora progresiva
 * y se ignora sin daño. Para tenerlos hay que subsetear el TTF original.
 */
export const fraunces = localFont({
  src: '../../public/fonts/Fraunces-Variable.woff2',
  variable: '--font-fraunces',
  display: 'swap',
  preload: true, // el lema de portada es el LCP
  fallback: ['Georgia', 'serif'],
  adjustFontFallback: 'Times New Roman',
});

/**
 * La itálica va en su propia familia y SIN preload: solo la usan las coplas y
 * las notas de sección, todas por debajo del pliegue. Meterla en la misma
 * familia que la redonda obligaría a precargar 22 KB que nadie necesita para
 * el primer pintado.
 */
export const frauncesItalic = localFont({
  src: '../../public/fonts/Fraunces-Italic.woff2',
  variable: '--font-fraunces-italic',
  display: 'swap',
  preload: false,
  fallback: ['Georgia', 'serif'],
  adjustFontFallback: 'Times New Roman',
});

export const instrument = localFont({
  src: '../../public/fonts/InstrumentSans-Variable.woff2',
  variable: '--font-instrument',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'sans-serif'],
  adjustFontFallback: 'Arial',
});
