/**
 * Sonido de la Ruleta del Azabache, sintetizado con Web Audio.
 *
 * Va sintetizado y NO con un archivo: un mp3 decente de ruleta pesa 8–15 KB
 * que hay que descargar por una carta que se lee desde un QR con datos
 * móviles, y encima habría que precargarlo para que suene sin retardo. Esto
 * cuesta ~1 KB de JS que solo baja con el sheet, suena instantáneo y se puede
 * afinar (el tic baja de tono a medida que la rueda frena, que es lo que
 * vende la ilusión).
 *
 * Reglas que no se rompen:
 *   · el contexto se crea DENTRO del gesto del usuario, nunca al cargar. Los
 *     navegadores lo exigen y además nadie quiere que una carta suene sola;
 *   · volumen bajo: esto es un guiño, no una tragamonedas;
 *   · quien llama decide si suena (ver hooks/useSound.ts). Este módulo no sabe
 *     de preferencias.
 */

type ConstructorAudio = typeof AudioContext;

/** Safari viejo solo expone el constructor con prefijo. */
type GlobalConAudio = typeof globalThis & {
  AudioContext?: ConstructorAudio;
  webkitAudioContext?: ConstructorAudio;
};

/** Techo de volumen de todo el módulo. Se aplica en el nodo maestro. */
const VOLUMEN_MAESTRO = 0.14;

let ctx: AudioContext | null = null;
let maestro: GainNode | null = null;

/**
 * Devuelve un contexto listo para sonar, o null si el navegador no soporta
 * Web Audio. Hay que llamarlo desde un gesto del usuario la primera vez.
 */
function preparar(): AudioContext | null {
  if (typeof window === 'undefined') return null;

  const g = globalThis as GlobalConAudio;
  const Ctor = g.AudioContext ?? g.webkitAudioContext;
  if (!Ctor) return null;

  if (!ctx) {
    ctx = new Ctor();
    maestro = ctx.createGain();
    maestro.gain.value = VOLUMEN_MAESTRO;
    maestro.connect(ctx.destination);
  }

  // Tras volver de segundo plano el contexto queda suspendido. resume()
  // devuelve una promesa que aquí no interesa esperar: si tarda, se pierde un
  // tic y no pasa nada.
  if (ctx.state === 'suspended') void ctx.resume();

  return ctx;
}

interface Golpe {
  frecuencia: number;
  /** Segundos. */
  duracion: number;
  tipo: OscillatorType;
  /** Relativo al maestro, 0–1. */
  volumen: number;
  /** Agudeza del filtro. Alto = más "madera", bajo = más "tono". */
  q: number;
  /** Segundos de retardo desde ahora. */
  retardo?: number;
}

/**
 * Una nota corta con envolvente exponencial. La rampa de 4 ms al atacar y la
 * caída exponencial existen para que no suene un chasquido digital al empezar
 * y al cortar: con `setValueAtTime` en seco, el salto de amplitud se oye.
 */
function golpe({ frecuencia, duracion, tipo, volumen, q, retardo = 0 }: Golpe): void {
  const c = preparar();
  if (!c || !maestro) return;

  const t = c.currentTime + retardo;

  const osc = c.createOscillator();
  osc.type = tipo;
  osc.frequency.setValueAtTime(frecuencia, t);

  const filtro = c.createBiquadFilter();
  filtro.type = 'bandpass';
  filtro.frequency.setValueAtTime(frecuencia, t);
  filtro.Q.setValueAtTime(q, t);

  const env = c.createGain();
  env.gain.setValueAtTime(0.0001, t);
  env.gain.exponentialRampToValueAtTime(volumen, t + 0.004);
  env.gain.exponentialRampToValueAtTime(0.0001, t + duracion);

  osc.connect(filtro).connect(env).connect(maestro);
  osc.start(t);
  osc.stop(t + duracion + 0.02);
}

/**
 * El tic del trinquete. `paso` va de 1 a `total`: la frecuencia baja con cada
 * paso, y eso es lo que se oye como "la rueda está frenando".
 */
export function tic(paso: number, total: number): void {
  const avance = total > 1 ? (paso - 1) / (total - 1) : 1;
  golpe({
    frecuencia: 1460 - avance * 620,
    duracion: 0.05,
    tipo: 'square',
    volumen: 0.55,
    q: 7,
  });
}

/**
 * El premio: dos notas de latón, la segunda una quinta arriba y 70 ms después.
 * Es el "ding" de que la casa ya eligió.
 */
export function premio(): void {
  golpe({ frecuencia: 784, duracion: 0.34, tipo: 'triangle', volumen: 0.5, q: 1.4 });
  golpe({
    frecuencia: 1175,
    duracion: 0.42,
    tipo: 'triangle',
    volumen: 0.34,
    q: 1.4,
    retardo: 0.07,
  });
}

/**
 * Suspende el contexto al cerrar el sheet. No se cierra del todo (`close()`)
 * porque volver a crearlo cuesta unos milisegundos y el usuario suele darle
 * "otra vez" a los pocos segundos.
 */
export function dormir(): void {
  if (ctx && ctx.state === 'running') void ctx.suspend();
}
