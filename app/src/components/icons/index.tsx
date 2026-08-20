/**
 * docs/04 ADR-008 · Iconos como componentes inline, sin librería.
 * viewBox 24×24, stroke currentColor, fill none, aria-hidden por defecto.
 * Server Components: cero JS.
 */
import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  width: 24,
  height: 24,
  'aria-hidden': true,
  focusable: false,
} as const;

/** Herradura abierta hacia abajo: la suerte se guarda. */
export function Horseshoe(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path
        d="M6 20.5V12a6 6 0 0 1 12 0v8.5"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <circle cx="8.6" cy="10" r="0.85" fill="currentColor" />
      <circle cx="15.4" cy="10" r="0.85" fill="currentColor" />
      <circle cx="7.4" cy="14.4" r="0.85" fill="currentColor" />
      <circle cx="16.6" cy="14.4" r="0.85" fill="currentColor" />
    </svg>
  );
}

/** Silueta de cabeza de caballo. Marca de agua del pie. */
export function HorseHead(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path
        d="M8.5 21c-.6-3.2.2-5.6 2-7.6 1.2-1.3 1.7-2.4 1.4-3.7l-2 .9c-.7.3-1.4-.4-1.1-1.1l1.3-3C10.9 4.3 12.8 3 15 3l.6 1.9 2.1.8c1.4.6 2.3 2 2.3 3.5v1.2c0 2.2-1 4.3-2.7 5.7l-1.6 1.3c-.9.7-1.4 1.7-1.4 2.8V21"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Chili(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path
        d="M14 4c0 1.7 1.2 2.6 2.6 2.6M16.6 6.6c1.4 2.6 1 6.1-1.3 9-2.4 3-6 4.6-9.3 4.3-.9-.1-1.2-1.2-.5-1.8 1.6-1.3 2.4-2.9 2.7-4.9.4-3 2.6-5.4 5.4-6 1.2-.3 2.4-.1 3 .4Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Leaf(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path
        d="M4 20c0-8 5-14 16-14 0 9-5 13-11 13H4Zm3-1.5C9 14 12.5 11 17 9.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Instagram. Trazo, no el logotipo con degradado: aquí manda el latón. */
export function Instagram(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect
        x="2.5"
        y="2.5"
        width="19"
        height="19"
        rx="5.5"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="17.4" cy="6.6" r="1.2" fill="currentColor" />
    </svg>
  );
}

/**
 * WhatsApp. Es la única marca registrada de la carta, así que va con su
 * silueta rellena tal cual: reconocerla de un vistazo es justamente el punto.
 */
export function WhatsApp(props: IconProps) {
  return (
    <svg {...base} fill="currentColor" {...props}>
      <path d="M12 2a10 10 0 0 0-8.5 15.3L2 22l4.8-1.4A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-2.8.8.8-2.7-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.6-6.1c-.25-.13-1.5-.74-1.7-.82-.23-.08-.4-.13-.56.13-.17.25-.65.82-.8.99-.14.17-.3.19-.55.06a6.7 6.7 0 0 1-2-1.23 7.5 7.5 0 0 1-1.37-1.7c-.14-.26 0-.4.11-.53.11-.11.25-.3.38-.44.12-.15.16-.25.25-.42.08-.17.04-.32-.02-.45-.06-.13-.56-1.35-.77-1.85-.2-.48-.4-.42-.56-.42h-.48c-.16 0-.42.06-.64.31-.22.25-.85.83-.85 2.03s.87 2.35.99 2.51c.13.17 1.72 2.62 4.16 3.67.58.25 1.04.4 1.4.51.58.19 1.11.16 1.53.1.47-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.47-.29Z" />
    </svg>
  );
}

export function Share(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path
        d="M12 16V4m0 0L8 8m4-4 4 4M5 14v4.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V14"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Bocina con ondas: el sonido de la Ruleta está encendido. */
export function Volume(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path
        d="M4 9.5h3L11.5 6v12L7 14.5H4a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.5 9.2a4 4 0 0 1 0 5.6M18.4 6.4a8 8 0 0 1 0 11.2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Bocina tachada: el sonido de la Ruleta está apagado. */
export function VolumeOff(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path
        d="M4 9.5h3L11.5 6v12L7 14.5H4a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m15.5 9.5 5 5m0-5-5 5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ChevronDown(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path
        d="M6 9.5 12 15.5 18 9.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
