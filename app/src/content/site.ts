/**
 * docs/06 §5 · Todo el texto de negocio de la aplicación.
 * Ningún componente escribe texto de negocio hardcodeado (docs/05, Regla 3).
 *
 * PENDIENTE con el negocio: dirección, teléfono, horarios y clave del wifi
 * son valores de referencia. Reemplazarlos antes de imprimir el QR.
 */
export const site = {
  nombre: 'Fonda Azabache',
  url: 'https://carta.fondaazabache.co',

  lema: ['Aquí se bebe bueno,', 'se canta duro', 'y se sufre bonito.'],
  bajada: 'Trago derecho, cerveza bien fría y música de la que duele. Bienvenido a la mesa.',

  cta: 'Ver la carta',

  coplas: {
    mitad: 'El arriero no llega rápido: llega bien acompañado.',
    pie: 'Al que le sirvan poco, que reclame. Al que le duela el pecho, que cante.',
  },

  horarios: [
    { dias: 'Martes a jueves', horas: '4:00 p. m. – 12:00 a. m.' },
    { dias: 'Viernes y sábado', horas: '2:00 p. m. – 2:00 a. m.' },
    { dias: 'Domingo', horas: '12:00 m. – 10:00 p. m.' },
    { dias: 'Lunes', horas: 'Cerrado' },
  ],

  contacto: {
    direccion: 'Cra. 43A #x-xx, El Poblado, Medellín',
    telefono: '+57 300 000 0000',
    whatsapp: 'https://wa.me/573000000000',
    instagram: 'https://instagram.com/fondaazabache',
    mapa: 'https://maps.google.com/?q=Fonda+Azabache',
  },

  wifi: { red: 'FondaAzabache', clave: 'sesufrebonito' },

  avisos: {
    propina: 'La propina es voluntaria y va completa para el equipo.',
    precios: 'Precios en pesos colombianos. Incluyen impuestos.',
    sinConfirmar: 'Los precios marcados como "Pregunte" se confirman en la barra.',
    // Obligación legal en Colombia. No es opcional ni se omite.
    alcohol:
      'El exceso de alcohol es perjudicial para la salud. Ley 30 de 1986. Prohibida la venta de bebidas embriagantes a menores de 18 años.',
  },
} as const;
