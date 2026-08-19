/** Alto del header pegajoso. Debe coincidir con --header-h de tokens.css. */
export const HEADER_HEIGHT_PX = 56;

/** Alto de la barra sticky de categorías. Debe coincidir con --nav-h. */
export const NAV_HEIGHT_PX = 56;

/**
 * Lo que tapan las dos barras juntas. Es el offset que necesita el scroll-spy
 * para no activar una sección que en realidad está detrás del header.
 * Equivale a --barra-h.
 */
export const BARRA_HEIGHT_PX = HEADER_HEIGHT_PX + NAV_HEIGHT_PX;

/** Ancla de la sección principal de la carta. */
export const CARTA_ID = 'carta';

/** Portada. La Ruleta la observa para saber cuándo mostrar su botón. */
export const PORTADA_ID = 'portada';

/**
 * Un precio en 0 significa "sin confirmar con el negocio", no "gratis".
 * La vista lo muestra como "Pregunte" y el validador lo reporta.
 * docs/13 · pendiente #1.
 */
export const PRECIO_SIN_CONFIRMAR = 0;
