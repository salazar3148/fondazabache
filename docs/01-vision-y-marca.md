# 01 · Visión y Marca

## 1. El concepto: por qué "Azabache" resuelve todo el diseño

El nombre ya trae el diseño adentro. Solo hay que leerlo bien.

**Azabache** tiene tres lecturas y las tres son útiles:

1. **La piedra.** Es carbón fósil pulido: **negro con brillo tibio**, no negro plano. Se usa en joyería popular y, sobre todo, es el **amuleto contra el mal de ojo** que en Colombia se le amarra a los recién nacidos. Azabache = protección, cábala, suerte de la casa.
2. **El caballo.** "Un caballo azabache" es un caballo **negro azabache**, el más lustroso. Conecta directo con el arriero antioqueño y con el pedido de "caballos, levemente".
3. **La superficie.** Negro pulido que refleja la luz de una vela. Eso es literalmente la interfaz que vamos a construir.

**Consecuencia de diseño número uno:** la carta es **oscura**. No es una decisión estética arbitraria, se sostiene sola:

- La fonda se vive de noche, con luz cálida y baja. Una pantalla clara a pleno brillo encandila, molesta al de al lado y rompe el ambiente.
- Sobre fondo oscuro, la **madera se lee como madera de verdad** (nogal, en penumbra), no como un tablero de melamina claro.
- **Las letras quemadas solo funcionan aquí.** Un hierro caliente sobre madera clara deja marca oscura; sobre madera oscura, la marca es el borde carbonizado y el brillo de la brasa. Ese segundo caso es infinitamente más bonito y es el que nos da el efecto firma.
- Ahorra batería en pantallas OLED, que es el 90 % de los celulares que van a escanear el QR.

> Si en algún momento se necesita una variante clara (carta de almuerzo, terraza a mediodía), está contemplada como tema alterno en [`02-sistema-de-diseno.md`](./02-sistema-de-diseno.md#9-apéndice-tema-claro-roble-de-mediodía). No es el tema por defecto.

---

## 2. Posicionamiento

Fonda Azabache no es un restaurante temático ni un bar con guitarras colgadas. Es la actualización honesta de la fonda de arriero como sitio de trago: **un lugar de paso que se volvió lugar de encuentro**. Se bebe sin misterio, se pone música que duele y se conversa fuerte.

**La carta digital tiene que sentirse como:** una tabla de nogal que alguien marcó con hierro, colgada con herrajes de latón, iluminada por una bombilla amarilla. Impecable, no rústica de mentiras. Bien hecha, como un buen aparejo de montura.

**La carta digital NO puede sentirse como:** un restaurante mexicano de centro comercial, un western de Hollywood, un bar de whisky de Nueva York, ni un menú de app de delivery.

### Territorio visual (referencias por concepto, no por copia)

| Sí | No |
|---|---|
| Marca de hierro sobre madera | Tipografía "western" tipo saloon |
| Herrajes y remaches de latón envejecido | Dorado brillante metálico |
| Nogal oscuro, veta larga y sutil | Tablones rústicos con astillas |
| Sello de lacre rojo vino | Cactus, sombreros gigantes, calaveras |
| Luz de bombilla amarilla, viñeta | Neón, gradientes morados |
| Trazo de tinta / grabado antiguo | Ilustración cartoon |

---

## 3. La frase

**Lema principal (portada):**

> **Aquí se bebe bueno,**
> **se canta duro**
> **y se sufre bonito.**

Se compone en tres líneas, quemada, centrada, con la última línea en cursiva de Fraunces. Es el corazón del proyecto y ocupa el lugar de honor de la primera pantalla.

**Bajada de la portada (una línea, tono explicativo, no poético):**

> Cocina de olla, trago derecho y música de la que duele. Bienvenido a la mesa.

**Coplas y remates** — se usan como separadores entre secciones y en el pie. Máximo **tres en toda la carta**, o pierden gracia:

- *"Al que le sirvan poco, que reclame. Al que le duela el pecho, que cante."* → pie de página
- *"El arriero no llega rápido: llega bien acompañado."* → separador antes de la sección de platos
- *"Lo que se pide con hambre, sabe doble."* → separador antes de picadas

**Micro-copys funcionales** (aquí manda la claridad, el chiste es secundario):

| Situación | Copy | Nota |
|---|---|---|
| CTA de portada | `Ver la carta` | Directo. No "Explorar", no "Comenzar" |
| Botón de la ruleta | `¿No sabe qué pedir?` | La pregunta funciona mejor que el nombre del feature |
| Resultado de la ruleta | `El azabache eligió` | Sobre sello de lacre |
| Repetir ruleta | `Otra vez` | |
| Cerrar bottom sheet | `Cerrar` + gesto de arrastre | Siempre las dos vías |
| Wi-Fi en el pie | `Clave del wifi` | Se toca y se copia. Alto valor real |
| Sección sin licor | `Pa' la sed` / *Sin licor* | Etiqueta con voz + subtítulo literal |
| Aviso de disponibilidad | `Hoy no hay` | Honesto, en vez de esconder el producto |
| Propina en el pie | `La propina es voluntaria y va completa para el equipo.` | Transparencia. Genera confianza |

---

## 4. Voz y tono

**Paisa, cálido, breve, con dignidad.** El tono "disco-maleante" que se pidió se logra con **ritmo y elisiones**, no con jerga forzada ni faltas de ortografía.

Reglas concretas:

1. **Usted, no tú.** "Bienvenido a la mesa", "¿No sabe qué pedir?". El usted paisa es cariñoso, no distante.
2. **Elisión medida y solo en etiquetas decorativas.** `Pa' picar`, `Bien fría`. Nunca en la información crítica: el nombre del plato y el precio se escriben completos y correctos.
3. **Descripciones de máximo 12 palabras.** Notas reales del trago, cero adjetivos de folleto. "Aguardiente, limón, clara y amargo de angostura" gana a "una explosión de sabor tradicional".
4. **Ni una sola exclamación.** El énfasis se hace con tipografía, no con signos.
5. **Doble capa en cada título de sección:** nombre con voz + subtítulo literal. `De la olla` con `Platos fuertes` debajo, en letra pequeña. La gracia no puede costarle a nadie entender dónde está.
6. **Emojis: cero.** Los iconos son SVG dibujados a mano, en línea con el resto.

---

## 5. Los motivos gráficos

Tres, y ni uno más. Se dibujan como SVG de trazo, estilo grabado, `stroke` de latón, `fill: none`.

| Motivo | Dónde | Regla |
|---|---|---|
| **Herradura** | Separador entre bloques, marco del logo, sello de la ruleta | El motivo principal. Es "caballo" sin dibujar un caballo |
| **Silueta de caballo** | Una sola aparición en toda la carta: la marca de agua del pie | Al 6 % de opacidad. Se intuye, no se mira |
| **Remache de latón** | Cuatro esquinas del marco de la portada y de los títulos de sección | 4 px de diámetro, degradado radial |

**Complementos permitidos:** filete de latón de 1 px, esquinas biseladas, sello de lacre (solo ruleta y destacados).

**Prohibido:** cuerdas, cactus, revólveres, ruedas de carreta, barriles, tipografías de "cartel de rodeo".

---

## 6. El logo

El wordmark es **`FONDA AZABACHE`** en Fraunces, versalitas, `letter-spacing` amplio, con el efecto quemado en su versión más elaborada, y **una herradura invertida (abierta hacia abajo, como manda la cábala para que la suerte no se escape... o hacia arriba para que se guarde: se elige hacia arriba)** encerrando o coronando la palabra "AZABACHE".

**Decisión técnica:** el logo de la portada **no** se hace con CSS en tiempo real. Se entrega como **SVG con los degradados y el grano ya horneados** (paths + `linearGradient` + una máscara de ruido estática). Motivos:

- Consistencia pixel-perfect entre navegadores, que es imposible con `-webkit-text-stroke` + `background-clip: text`.
- Es el elemento LCP de la página: tiene que pintar de una, sin esperar la fuente.
- Pesa menos de 12 KB y se puede inlinear.

Los **títulos de sección sí** usan el efecto quemado en CSS, porque cambian con el contenido y ahí la variación natural entre dispositivos no molesta. Ver [`03-texturas-y-efectos.md`](./03-texturas-y-efectos.md).

---

## 7. La experiencia en una frase

> Escaneo el QR. En dos segundos tengo delante una tabla de nogal iluminada, con el nombre de la fonda marcado a fuego y una frase que me hace sonreír. Bajo, y la carta está ahí: grande, clara, sin estorbos. Toco una categoría y voy directo. Si no sé qué pedir, la casa decide por mí. Cierro el celular sabiendo qué quiero y con ganas de que suene Darío Gómez.

Eso es todo lo que hay que lograr.
