import { z } from 'zod';

/**
 * docs/06 §2 · Validación de contenido.
 *
 * ADR-005: este módulo lo importan ÚNICAMENTE scripts/validate-content.ts y
 * los tests. Ningún componente ni módulo de src/app lo toca (lo hace cumplir
 * la regla no-restricted-imports de eslint.config.mjs).
 *
 * Los límites no son caprichos: son el diseño hecho código.
 */

const kebab = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export const itemTagSchema = z.enum([
  'casa',
  'favorita',
  'picante',
  'sin-alcohol',
  'compartir',
  'fuerte',
  'temporada',
]);

export const menuItemSchema = z.object({
  id: z.string().regex(kebab, 'id debe ser kebab-case'),
  nombre: z.string().min(3).max(48),
  descripcion: z
    .string()
    .max(90)
    .optional()
    .refine((d) => !d || d.split(/\s+/).length <= 14, 'descripción: máximo 14 palabras'),
  precio: z
    .number()
    .int()
    .min(0, 'el precio no puede ser negativo')
    .max(2_000_000)
    // 0 es el marcador de "precio sin confirmar" y también es múltiplo de 500.
    .refine((p) => p % 500 === 0, 'los precios van en múltiplos de 500'),
  volumen: z.string().max(24).optional(),
  etiquetas: z.array(itemTagSchema).max(2, 'máximo 2 etiquetas por producto').optional(),
  disponible: z.boolean().optional(),
  relato: z.string().min(20).max(220).optional(),
  vaBienCon: z.array(z.string()).max(2).optional(),
});

export const menuCategorySchema = z.object({
  id: z.string().regex(kebab),
  titulo: z.string().min(3).max(24),
  subtitulo: z.string().min(3).max(28),
  chip: z.string().min(2).max(14, 'el chip debe caber en la barra'),
  nota: z.string().max(70).optional(),

  /** Sin default: obligar a declararlo es el punto (ver types/menu.ts). */
  licor: z.boolean(),
  /**
   * El tope se subió de 9 a 14 respecto a docs/06: el catálogo real de
   * aguardientes tiene 13 presentaciones (3 referencias × 3 tamaños + 4
   * marcas alternas) y partirlas en dos secciones confundiría más que
   * ayudar. 14 sigue siendo un techo que obliga a pensar antes de crecer.
   */
  items: z.array(menuItemSchema).min(2).max(14, 'más de 14 productos por sección abruma'),
});

export const menuSchema = z
  .array(menuCategorySchema)
  .min(1)
  .max(9, 'más de 9 categorías no caben cómodas en la barra');
