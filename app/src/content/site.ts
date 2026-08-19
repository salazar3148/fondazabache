/**
 * docs/06 §5 · Todo el texto de negocio de la aplicación.
 * Ningún componente escribe texto de negocio hardcodeado (docs/05, Regla 3).
 *
 * PENDIENTE con el negocio: el teléfono y el usuario de Instagram son valores
 * de referencia. Reemplazarlos antes de imprimir el QR.
 */

/** Solo dígitos, con indicativo país. Es lo que espera wa.me. */
const WHATSAPP_E164 = '573000000000';
const WHATSAPP_MENSAJE = 'Hola, quiero reservar mesa en la Fonda Azabache.';

export const site = {
  nombre: 'Fonda Azabache',
  url: 'https://carta.fondaazabache.co',

  /** Ciudad, no dirección: ubica el negocio para SEO sin publicar el local. */
  ciudad: 'Medellín',
  region: 'Antioquia',
  pais: 'CO',

  lema: ['Aquí se bebe bueno,', 'se canta duro', 'y se sufre bonito.'],
  bajada: 'Trago derecho, cerveza bien fría y música de la que duele. Bienvenido a la mesa.',

  cta: 'Ver la carta',
  ctaReservar: 'Reservar mesa',
  pistaScroll: 'Desliza para ver la carta',
  volverArriba: 'Volver a la portada',

  coplas: {
    // La imagen del caballo se queda; el oficio de la mula no. Esto es una
    // fonda, no una recua.
    mitad: 'Caballo que va sin afán, llega bien acompañado.',
    pie: 'Al que le sirvan poco, que reclame. Al que le duela el pecho, que cante.',
  },

  social: {
    instagram: {
      handle: 'fondaazabache',
      url: 'https://instagram.com/fondaazabache',
    },
    whatsapp: {
      /** Formato humano para mostrar. */
      display: '300 000 0000',
      /** Formato internacional para `tel:` y para schema.org. */
      telefono: '+57 300 000 0000',
      url: `https://wa.me/${WHATSAPP_E164}`,
      /** Con el mensaje precargado: el cliente no tiene que redactar nada. */
      reservarUrl: `https://wa.me/${WHATSAPP_E164}?text=${encodeURIComponent(WHATSAPP_MENSAJE)}`,
    },
  },

  pie: {
    firma: 'Aquí la mesa nunca se queda sola.',
    derechos: 'Fonda, cantina y velorio de canciones',
  },
} as const;
