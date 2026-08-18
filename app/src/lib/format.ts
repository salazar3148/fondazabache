/**
 * docs/06 §3 · Formateo de precios en pesos colombianos.
 *
 * Se construye una sola vez el Intl.NumberFormat: instanciarlo por llamada
 * cuesta ~0.1 ms y son 46 llamadas por render.
 */
const cop = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/** 62000 → "$62.000". Sin decimales y con punto de miles, como en Colombia. */
export function formatCOP(valor: number): string {
  // Intl produce "$ 62.000" con espacio duro en algunos runtimes: se normaliza.
  // Una carta donde el precio se ve "$ 62.000" en Android y "$62.000" en iOS
  // es un detalle que sí se nota.
  return cop.format(valor).replace(/\s|\u00A0/g, '');
}
