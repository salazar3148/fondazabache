import type { SVGProps } from 'react';
import { cn } from '@/lib/cn';
import styles from './Wordmark.module.css';

export interface WordmarkProps {
  /**
   * Prefijo de los ids de <defs>. Un id repetido en el documento es HTML
   * inválido y, peor, en Safari la segunda instancia hereda el degradado de
   * la primera. Cada aparición del wordmark en la página pasa el suyo.
   */
  uid?: string | undefined;
  /** Solo decorativo (cuando el nombre ya lo da un texto vecino). */
  decorative?: boolean | undefined;
  className?: string | undefined;
}

/**
 * El letrero de la casa: "FONDA / AZABACHE" grabado a hierro sobre la tabla.
 *
 * Va en SVG y no en texto con `background-clip` porque el letrero necesita dos
 * tamaños distintos por línea, interletra propia y la herradura alineada al
 * ancho del bloque: eso en HTML pide tres elementos y un `position: absolute`
 * que se rompe con cualquier zoom de texto. Aquí el trazado escala solo y el
 * archivo pesa lo que pesa el markup.
 *
 * Los hexadecimales viven en el JSX (no en CSS) porque son valores del propio
 * dibujo: el degradado del quemado y el filtro de brasa. Son los mismos de
 * BurntTitle.module.css, que tokens.css documenta como excepción (docs/03).
 */
export function Wordmark({ uid = 'wordmark', decorative = false, className }: WordmarkProps) {
  const burnId = `${uid}-burn`;
  const emberId = `${uid}-ember`;

  /**
   * En la portada el letrero ES el nombre de la casa, así que se anuncia como
   * imagen con su texto alternativo. En el pie es un eco decorativo del mismo
   * nombre que ya está en los créditos: anunciarlo dos veces solo alarga el
   * recorrido del lector de pantalla.
   */
  const semantica: SVGProps<SVGSVGElement> = decorative
    ? { 'aria-hidden': true, focusable: false }
    : { role: 'img', 'aria-label': 'Fonda Azabache' };

  return (
    <svg viewBox="0 0 300 120" className={cn(styles.wordmark, className)} {...semantica}>
      <defs>
        {/*
         * La fibra tostada: crema arriba (recibe luz) y tostado abajo (quemó
         * más). Los cuatro tonos son los mismos de BurntTitle.module.css y se
         * mueven con él: el letrero y los títulos de sección tienen que ser el
         * mismo hierro. Van en rango crema porque los marrones medios de antes
         * (#dcae6c → #b3814a en el tramo bajo) se fundían con la tabla del
         * fondo y el letrero se leía apagado.
         */}
        <linearGradient id={burnId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fffaf1" />
          <stop offset="34%" stopColor="#f7e6c6" />
          <stop offset="66%" stopColor="#ebd0a2" />
          <stop offset="100%" stopColor="#d3ab73" />
        </linearGradient>

        {/* Chispa de luz, penumbra cálida y rescoldo naranja alrededor. El
            rescoldo sube de opacidad junto con BurntTitle: separa el trazo de
            la tabla oscura y ayuda a leer el letrero. */}
        <filter id={emberId} x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="1" stdDeviation="0" floodColor="#f6efe3" floodOpacity="0.22" />
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#0e0b08" floodOpacity="0.85" />
          <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#e0752f" floodOpacity="0.52" />
        </filter>
      </defs>

      <g filter={`url(#${emberId})`}>
        {/* paint-order dibuja el surco carbonizado ANTES del relleno, así el
            contorno queda por fuera de la letra y no se la come. */}
        <text
          x="150"
          y="42"
          textAnchor="middle"
          className={styles.linea}
          fontSize="30"
          letterSpacing="6"
          fill={`url(#${burnId})`}
          stroke="#180d05"
          strokeWidth="2.25"
          paintOrder="stroke fill"
        >
          FONDA
        </text>
        <text
          x="150"
          y="80"
          textAnchor="middle"
          className={styles.linea}
          fontSize="34"
          letterSpacing="4"
          fill={`url(#${burnId})`}
          stroke="#180d05"
          strokeWidth="2.55"
          paintOrder="stroke fill"
        >
          AZABACHE
        </text>
      </g>

      {/* Herradura de latón clavada bajo el nombre. Abierta hacia abajo: la
          suerte se guarda (docs/01). */}
      <g stroke="#b08d57" strokeWidth="1.6" fill="none" opacity="0.85">
        <path d="M118 96v6a26 26 0 0 0 64 0v-6" strokeLinecap="round" />
        <circle cx="123" cy="94" r="1.4" fill="#b08d57" stroke="none" />
        <circle cx="177" cy="94" r="1.4" fill="#b08d57" stroke="none" />
      </g>
    </svg>
  );
}
