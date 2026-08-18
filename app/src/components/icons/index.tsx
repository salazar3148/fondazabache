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

export function Wifi(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path
        d="M2.5 9.5a14 14 0 0 1 19 0M6 13a9 9 0 0 1 12 0M9.5 16.5a4 4 0 0 1 5 0"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="12" cy="20" r="1.2" fill="currentColor" />
    </svg>
  );
}

export function Clock(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function MapPin(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path
        d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.6" />
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
