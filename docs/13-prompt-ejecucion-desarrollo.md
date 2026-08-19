# 13 · Prompt de Ejecución — Desarrollo Serio

Prompt para arrancar (o continuar) el desarrollo real del proyecto, fase por fase, con verificación en cada paso. Pensado para pegarse en una sesión de Kiro con el workspace `FondaAzabache` abierto.

---

## Cómo usarlo

- **Si vienes de la demo actual** (ya existe `app/` con Hero + una carta funcionando): pega el **Bloque A**. Retoma exactamente donde quedó el proyecto.
- **Si arrancas de cero en otro entorno**: pega el **Bloque B**, que es autocontenido.
- En ambos casos, ejecuta **una fase a la vez** y no avances a la siguiente sin que se cumpla su criterio de aceptación. Si algo falla, corrígelo antes de seguir.

---

## Bloque A — Continuar el proyecto existente

```
Estamos construyendo la carta digital de Fonda Azabache. El plan completo está en
docs/ (README.md y 01 a 12). Ya existe un proyecto Next.js en app/ con:

- Next.js 16.3 + React 19 + TypeScript strict + Tailwind v4.3, output: 'export'
- Tokens de diseño completos en src/styles/tokens.css, theme.css, base.css,
  textures.css, animations.css
- Componentes: WoodBackdrop, BurntTitle (con su fallback @supports), PlankFrame,
  HorseshoeRule, Hero (con wordmark SVG horneado), Button, Badge, PriceTag,
  MenuItemRow, CategorySection
- El catálogo REAL completo en src/content/menu/ (cervezas, pasantes,
  aguardientes, ron, de-fuera, tragos) — 6 secciones, ~41 productos, ya NO es
  el mock. Los precios en $0.000 son productos sin precio confirmado por el
  negocio: NO los inventes, déjalos en 0 hasta que te dé el dato real.
- app/src/app/page.tsx ya renderiza el Hero + las 6 secciones completas

Léete docs/10-roadmap-y-tareas.md primero para confirmar en qué fase estamos
(la nota de estado al inicio del documento dice exactamente qué hay hecho).
A partir de ahí, sigue las fases EN ORDEN:

- Lo que falta de Fase 0/1: revisar que ESLint, Stylelint, Prettier, Husky,
  lint-staged, commitlint y el CI de GitHub Actions estén configurados
  (docs/04 §4 y §6). Si no existen, créalos.
- Fase 2 (texturas): falta pulir el fondo de madera en dispositivo real,
  verificar que BurntTitle se vea bien con y sin el fallback activo.
- Fase 3 (contenido y validación): AÚN NO EXISTE el esquema Zod ni el
  validador. Esto es prioritario ahora que el contenido es real: crea
  src/lib/schemas.ts y scripts/validate-content.ts según docs/06 §2,
  y conéctalo a un script "content:check" + "prebuild" en package.json.
  Verifica que valida las 6 categorías y ~41 productos sin errores.
- Fase 4: falta CategoryNav (barra sticky con detección de sección activa),
  Reveal, Footer con InfoFonda y el wifi copiable, y el aviso legal de la
  Ley 30 de 1986 (OBLIGATORIO, no lo omitas).
- Fase 5: el bottom sheet (vaul) y la Ruleta del Azabache no existen todavía.
  Antes de construir la Ruleta, revisa qué productos del catálogo real
  tienen sentido con un `relato` (máximo 8 en toda la carta, ver docs/06 §1)
  y agrégaselos tú mismo con textos breves y coherentes con la voz de marca
  de docs/01, o pregúntame si prefiero escribirlos yo.
- Fase 6: presupuesto de rendimiento y accesibilidad, con Lighthouse CI.
- Fase 7: QA en dispositivo real y generación del QR.

Reglas que no se negocian (ya aplicadas en el código existente, mantenlas):
1. Los tokens de docs/02 son la única fuente de color/tamaño/sombra.
2. Server Components por defecto. Máximo 5 componentes cliente (docs/07).
3. Solo las 6 animaciones del inventario de docs/08 §8.
4. Sin fotos de producto. Sin librería de animación ni de iconos.
5. NO reintroduzcas datos mockeados: el contenido de src/content/menu/ es
   el catálogo real. Si necesitas más datos (volumen exacto, si algo está
   agotado, etc.) pregúntame en vez de inventar.
6. Cualquier precio en $0.000 se queda así hasta que yo confirme el valor.

Después de cada fase, corre `pnpm build` (o `pnpm lint` + `pnpm test` cuando
existan) y muéstrame el resultado antes de pasar a la siguiente fase.

Empieza por la Fase 3 (esquema Zod + validador), que es la que más protege el
contenido real que acabamos de cargar.
```

---

## Bloque B — Arranque autocontenido (sin acceso a `docs/`)

Usa este bloque solo si no tienes el folder `docs/` disponible en el contexto. Es más largo porque repite lo esencial del sistema de diseño y la arquitectura.

```
Continúa/construye la carta digital de "Fonda Azabache", una fonda antioqueña que
SOLO vende licores y bebidas (sin cocina). Next.js 16.3 App Router, output:
'export', React 19, TypeScript strict, Tailwind v4.3 para layout, CSS Modules
para texturas/efectos. Mobile-only (360-430px), tema oscuro fijo.

CONTENIDO: el catálogo YA es real (no es un mock), tomado de la carta física
del negocio. 6 secciones: Bien fría (cervezas), Pasantes (gaseosas/aguas),
Del estante (aguardientes), De la cava (ron), De fuera (vodka/tequila/whisky),
Tragos (por copa). Los precios en $0.000 son productos SIN precio confirmado:
no los inventes bajo ninguna circunstancia, pregúntame el valor real.

DISEÑO: paleta "Azabache & Candela" (madera oscura #15100B de fondo, hueso
#F6EFE3 de texto, candela #E0752F de acento/precios, latón #B08D57 decorativo).
Tipografía Fraunces (display) + Instrument Sans (cuerpo), autohospedadas.
El efecto firma es "letras quemadas" en los títulos de sección: degradado +
-webkit-text-stroke + paint-order:stroke fill + drop-shadow, CON fallback
@supports obligatorio para que el texto nunca quede invisible. Fondo de madera
de 6 capas CSS (gradientes + ruido SVG), sin fotos.

Si tienes acceso a los archivos del proyecto, revisa primero:
- app/src/styles/tokens.css (todos los valores de diseño)
- app/src/content/menu/*.ts (el catálogo real completo)
- app/src/components/ (los componentes ya construidos)

Luego dime en qué fase seguir: validación de contenido con Zod, barra de
navegación sticky, bottom sheet de producto, Ruleta del Azabache, o
rendimiento/accesibilidad. Empieza preguntándome cuál priorizo si no es obvio
por el estado del código.
```

---

## Qué decisiones tuyas necesito antes de seguir

Estas no las puedo resolver solo, y bloquean partes del plan:

1. **Los precios en `$0.000`** (13 productos: Manzanares botella/media, Aguardiente Real botella/media, 1800 Reposado, José Cuervo botella, Old Parr, Buchanan's 12, Jägermeister). Sin esto, la carta no se puede publicar.
2. **"Tequila Jugador"** en Tragos ($15.000) — confírmame si es el nombre correcto de la marca o si es otra cosa.
3. **Volúmenes exactos** de cada presentación (puse estándares de industria: cerveza 330 ml, gaseosa 400 ml, etc. — corrígelos si son distintos).
4. **Cuáles productos merecen un `relato`** para el bottom sheet (máximo 8 en toda la carta). Puedo proponerte candidatos con la voz de marca ya definida, o los escribes tú.
5. **Disponibilidad real**: si algo de la carta ya no se consigue, dime cuál para marcarlo `disponible: false`.

Cuando tengas esos datos, dímelos y actualizo el contenido directamente.
