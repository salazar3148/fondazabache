/**
 * docs/06 §1 · Tipos del dominio.
 * Sin dependencias, sin Zod, importable desde cualquier parte.
 */

/** Etiquetas visibles como badge en la fila del producto. */
export type ItemTag =
  | 'casa' // De la casa. Sello de vino
  | 'favorita' // La favorita. Filete de latón
  | 'picante' // Michelada con ají, etc.
  | 'sin-alcohol' // 0 %. Badge musgo
  | 'compartir' // Botella, litro o garrafa para 2 o más
  | 'fuerte' // Trago cargado / alta graduación
  | 'temporada'; // Diciembre, edición limitada...

/** Un producto de la carta. */
export interface MenuItem {
  /** Identificador estable e inmutable. Nunca se recicla. */
  id: string;
  nombre: string;
  /** Máximo 14 palabras. Ingredientes reales, cero adjetivos de folleto. */
  descripcion?: string;
  /**
   * Pesos colombianos, entero, sin decimales. Se escribe con `_`: 48_000.
   * `0` significa **precio sin confirmar con el negocio**, no gratis:
   * la vista lo muestra como "Pregunte". Ver lib/constants.ts.
   */
  precio: number;
  /** Presentación cuando aplica: "Botella · 750 ml", "Media · 375 ml" */
  volumen?: string;
  etiquetas?: ItemTag[];
  /** `false` muestra la fila atenuada con "Hoy no hay". Por defecto true. */
  disponible?: boolean;
  /**
   * Relato corto (1–2 frases) que se muestra en el bottom sheet.
   * Su presencia habilita el sheet. Máximo 8 en toda la carta.
   */
  relato?: string;
  /** "Va bien con": ids de otros productos. Máximo 2. */
  vaBienCon?: string[];
}

/** Una sección de la carta. */
export interface MenuCategory {
  /** Ancla de la URL y del chip de navegación. kebab-case, estable. */
  id: string;
  /** Nombre con voz de fonda. Va quemado. */
  titulo: string;
  /** Subtítulo literal, en mayúsculas pequeñas. */
  subtitulo: string;
  /** Texto corto del chip. Puede ser más breve que el título. */
  chip: string;
  /** Nota opcional bajo el título. */
  nota?: string;
  items: MenuItem[];
}

export type Menu = MenuCategory[];

/** Producto enriquecido con su categoría. Lo usa la Ruleta del Azabache. */
export interface ItemConCategoria extends MenuItem {
  categoriaId: string;
  categoriaTitulo: string;
}
