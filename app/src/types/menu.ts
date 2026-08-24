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
}

/** Una sección de la carta. */
export interface MenuCategory {
  /** Ancla de la URL y del chip de navegación. kebab-case, estable. */
  id: string;
  /**
   * Qué se vende en la sección, en la palabra con que se pide: "Aguardientes",
   * "Ron", "Whisky". Va quemado, es lo primero que se lee.
   *
   * En las secciones de licor este renglón dice el producto y NO la frase de
   * fonda: la frase bajó a `subtitulo`. Cerveza y pasantes conservan la voz
   * arriba ("Bien fría") porque ahí el producto no admite duda.
   */
  titulo: string;
  /**
   * El renglón chico bajo el título, en mayúsculas pequeñas de latón: la voz
   * de la fonda ("Del estante", "De la cava", "De fuera") o el matiz que el
   * título no dice ("Por copa").
   */
  subtitulo: string;
  /** Texto corto del chip. Puede ser más breve que el título. */
  chip: string;
  /** Nota opcional bajo el título. */
  nota?: string;
  /**
   * `true` si la sección es de licores: aguardiente, ron, importados y tragos
   * por copa. La Ruleta del Azabache sortea SOLO entre estas.
   *
   * Cerveza y pasantes quedan fuera a propósito: quien abre la Ruleta no está
   * indeciso entre una Póker y un agua, está indeciso entre licores. Sugerirle
   * "Agua" arruina el juguete de una sola vez.
   *
   * Es obligatorio y no opcional para que al crear una sección haya que
   * decidirlo. Con un `?` la sección nueva se quedaría fuera del sorteo en
   * silencio, que es exactamente el bug que nadie encuentra.
   */
  licor: boolean;
  /**
   * `true` si las filas de esta sección muestran `descripcion`. Solo cervezas
   * la tiene en `true`: es la única sección donde la frase corta se queda
   * visible en la carta. En el resto (aguardiente, ron, whisky, tequila,
   * vodka, tragos y pasantes) la fila no la muestra, aunque el dato puede
   * seguir viviendo en el producto — la Ruleta del Azabache sí la lee y la
   * enseña al sortear un licor, por eso no se borra del contenido, solo se
   * oculta en la lista.
   *
   * Igual que `licor`, es obligatorio para forzar la decisión en cada
   * sección nueva.
   */
  descripciones: boolean;
  items: MenuItem[];
}

export type Menu = MenuCategory[];

/** Producto enriquecido con su categoría. Lo usa la Ruleta del Azabache. */
export interface ItemConCategoria extends MenuItem {
  categoriaId: string;
  categoriaTitulo: string;
}
