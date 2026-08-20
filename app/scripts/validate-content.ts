/**
 * docs/06 §2 · Validador de contenido. Corre en `prebuild`: si la carta está
 * mal, el build falla. Es la red de seguridad del flujo "cambio un precio el
 * jueves a las 11 de la noche".
 *
 * Cuatro invariantes además del esquema:
 *   1. ids de producto únicos
 *   2. tope de relatos (8)
 *   3. referencias de vaBienCon existentes
 *   4. ids de categoría únicos (son anclas de la URL)
 *   5. la Ruleta tiene de dónde sortear
 */
import { licores, menu } from '../src/content/menu';
import { menuSchema } from '../src/lib/schemas';

let fallo = false;

const error = (msg: string) => {
  console.error(`  ✖ ${msg}`);
  fallo = true;
};

// ── Esquema ────────────────────────────────────────────────────────
const result = menuSchema.safeParse(menu);
if (!result.success) {
  console.error('\n✖ La carta no pasó la validación de esquema:\n');
  for (const issue of result.error.issues) {
    error(`${issue.path.join('.')} → ${issue.message}`);
  }
}

const items = menu.flatMap((c) => c.items);
const ids = items.map((i) => i.id);

// ── 1 · ids de producto únicos ─────────────────────────────────────
const duplicados = [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))];
if (duplicados.length) error(`IDs de producto duplicados: ${duplicados.join(', ')}`);

// ── 4 · ids de categoría únicos ────────────────────────────────────
const catIds = menu.map((c) => c.id);
const catDup = [...new Set(catIds.filter((id, i) => catIds.indexOf(id) !== i))];
if (catDup.length) error(`IDs de categoría duplicados: ${catDup.join(', ')}`);

// ── 2 · tope de relatos ────────────────────────────────────────────
const conRelato = items.filter((i) => i.relato);
if (conRelato.length > 8) {
  error(`${conRelato.length} productos con relato. El máximo es 8 (docs/06 §1).`);
}

// ── 3 · referencias de vaBienCon ───────────────────────────────────
const idsSet = new Set(ids);
for (const item of items) {
  for (const ref of item.vaBienCon ?? []) {
    if (!idsSet.has(ref)) error(`"${item.id}".vaBienCon apunta a "${ref}", que no existe.`);
    if (ref === item.id) error(`"${item.id}".vaBienCon se apunta a sí mismo.`);
  }
}

// ── 5 · la Ruleta tiene de dónde sortear ───────────────────────────
// Sin esto, marcar `licor: false` de más deja la Ruleta mostrando "Hoy no hay
// nada que sortear" y nadie se enteraría hasta abrirla en producción.
if (licores.length < 3) {
  error(
    `La Ruleta solo tiene ${licores.length} licores para sortear. ` +
      'Revisa la bandera `licor` de cada sección: hacen falta al menos 3.',
  );
}

if (fallo) {
  console.error('');
  process.exit(1);
}

// ── Informe ────────────────────────────────────────────────────────
const sinPrecio = items.filter((i) => i.precio === 0);
const agotados = items.filter((i) => i.disponible === false);

const seccionesLicor = menu.filter((c) => c.licor).map((c) => c.titulo);

console.log(`✔ Carta válida: ${menu.length} secciones, ${ids.length} productos.`);
console.log(`  · Con relato: ${conRelato.length}/8`);
console.log(
  `  · Ruleta: ${licores.length} licores de ${seccionesLicor.length} secciones ` +
    `(${seccionesLicor.join(', ')})`,
);
if (agotados.length) console.log(`  · Marcados agotados: ${agotados.length}`);
if (sinPrecio.length) {
  console.log(
    `\n⚠ ${sinPrecio.length} productos SIN precio confirmado (se muestran como "Pregunte"):`,
  );
  for (const i of sinPrecio) console.log(`  · ${i.id} — ${i.nombre} ${i.volumen ?? ''}`.trimEnd());
  console.log('  Confírmalos con el negocio antes de imprimir el QR (docs/13).');
}
