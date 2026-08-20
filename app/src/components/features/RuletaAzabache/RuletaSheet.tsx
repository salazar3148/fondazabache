'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { ItemConCategoria } from '@/types/menu';
import { Sheet } from '@/components/primitives/Sheet';
import { Button } from '@/components/primitives/Button';
import { BurntTitle } from '@/components/decor/BurntTitle';
import { Sello } from '@/components/decor/Sello';
import { PriceTag } from '@/components/menu/PriceTag';
import { Horseshoe, Volume, VolumeOff } from '@/components/icons';
import { useRandomItem } from '@/hooks/useRandomItem';
import { useHaptics } from '@/hooks/useHaptics';
import { useSound } from '@/hooks/useSound';
import { dormir, premio, tic } from '@/lib/audio';
import { cn } from '@/lib/cn';
import styles from './RuletaAzabache.module.css';

export interface RuletaSheetProps {
  items: readonly ItemConCategoria[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** Cuánto dura el resaltado de la fila al llegar desde la Ruleta. */
const DESTACADO_MS = 3000;

/** Vueltas completas que da la corona en cada tirada, antes del resto al azar. */
const VUELTAS = 3;

export function RuletaSheet({ items, open, onOpenChange }: RuletaSheetProps) {
  const vibrar = useHaptics();
  const { activo, habilitado, alternar } = useSound();

  /**
   * El sonido se dispara desde los callbacks del hook y no desde un
   * temporizador propio: el ritmo del barajeo lo marca useRandomItem, y tener
   * dos relojes para el mismo compás es garantía de desfase.
   *
   * El contexto de audio se crea en el primer tic, ~90 ms después de abrir el
   * sheet. Eso ya está dentro de la activación pegajosa que dejó el toque en
   * el botón flotante, así que los navegadores lo dejan sonar. Si alguno se
   * pusiera estricto, lo único que se pierde es el primer tic.
   */
  const alPaso = useCallback(
    (paso: number, total: number) => {
      if (habilitado) tic(paso, total);
    },
    [habilitado],
  );

  const alFijar = useCallback(() => {
    if (habilitado) premio();
  }, [habilitado]);

  const { actual, barajeando, vistazo, giros, girar } = useRandomItem(items, { alPaso, alFijar });

  /**
   * Rotación acumulada de la corona. Se acumula (nunca se reinicia) para que la
   * transición de CSS siempre vaya hacia delante: si volviera a 0, la rueda
   * giraría al revés en la tirada siguiente.
   *
   * El resto al azar es lo que hace que no pare dos veces en el mismo gajo.
   */
  const [rotacion, setRotacion] = useState(0);
  const giroVisto = useRef(0);

  useEffect(() => {
    if (giros === giroVisto.current) return;
    giroVisto.current = giros;
    setRotacion((previa) => previa + VUELTAS * 360 + Math.floor(Math.random() * 360));
  }, [giros]);

  // Al abrir, gira solo: el usuario ya expresó su intención al tocar.
  useEffect(() => {
    if (open && !actual && !barajeando) girar();
    // girar cambia de identidad en cada resultado; solo interesa el momento de apertura.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Vibración de 12 ms al fijar el resultado (docs/08 §6.2).
  useEffect(() => {
    if (actual) vibrar(12);
  }, [actual, vibrar]);

  // Al cerrar, el contexto de audio se suspende: no se deja el hardware
  // despierto por un juguete que ya nadie está usando.
  useEffect(() => {
    if (!open) dormir();
  }, [open]);

  /**
   * "Ver en la carta": cierra, salta a la sección y resalta la fila 3 s.
   *
   * El resaltado se aplica por DOM sobre la clase global `destacado-ruleta` en
   * vez de subir estado hasta la página: sin él, el usuario llega a la sección
   * y tiene que buscar el producto entre trece. Con él, lo ve de una.
   */
  const verEnLaCarta = () => {
    if (!actual) return;
    const id = actual.id;
    const categoriaId = actual.categoriaId;
    onOpenChange(false);

    window.setTimeout(() => {
      window.location.hash = `#${categoriaId}`;
      const fila = document.getElementById(`item-${id}`);
      if (!fila) return;
      fila.classList.add('destacado-ruleta');
      window.setTimeout(() => fila.classList.remove('destacado-ruleta'), DESTACADO_MS);
    }, 260);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange} title="El azabache eligió">
      <div className={styles.panel}>
        <div className={styles.cabecera}>
          <button
            type="button"
            className={styles.sonido}
            onClick={alternar}
            /* Patrón canónico de interruptor: la etiqueta dice QUÉ controla y
               aria-pressed dice cómo está. Cambiar también la etiqueta con el
               estado haría que el lector de pantalla lo anunciara dos veces. */
            aria-pressed={activo}
            aria-label="Sonido de la ruleta"
          >
            {activo ? (
              <Volume className={styles.sonidoIcono} />
            ) : (
              <VolumeOff className={styles.sonidoIcono} />
            )}
          </button>
        </div>

        {/* La rueda. Decorativa de arriba abajo: lo que se anuncia es el
            resultado de más abajo, no el giro. */}
        <div className={styles.rueda}>
          <span
            className={cn(styles.corona, barajeando && styles.coronaGirando)}
            style={{ rotate: `${rotacion}deg` }}
            aria-hidden="true"
          />
          <span className={styles.brillo} aria-hidden="true" />
          <span className={cn(styles.centro, actual && styles.centroGanador)} aria-hidden="true">
            <Horseshoe className={styles.centroIcono} />
          </span>
          <span className={styles.aguja} aria-hidden="true" />

          {/* Dos palabras cortas y no una frase: en el lacre `sm` caben 40 px de
              texto por renglón, y cualquier palabra de más de cinco letras se
              parte por la mitad. */}
          {actual && (
            <Sello size="sm" className={styles.sello}>
              La casa
            </Sello>
          )}
        </div>

        <div className={styles.marquesina}>
          {/* Durante el barajeo el área es aria-hidden: no se marea al lector de
              pantalla con siete nombres que no son el resultado. La `key` es lo
              que reinicia la animación en cada nombre. */}
          {barajeando && (
            <p key={vistazo ?? 'inicio'} className={styles.barajeo} aria-hidden="true">
              {vistazo ?? '…'}
            </p>
          )}

          {/* Solo el resultado final se anuncia, y sin interrumpir. */}
          <div aria-live="polite" className={styles.anuncio}>
            {actual && (
              <>
                <p className={styles.categoria}>{actual.categoriaTitulo}</p>
                <BurntTitle as="p" className={styles.nombre}>
                  {actual.nombre}
                </BurntTitle>
                <span className={styles.placa}>
                  <PriceTag valor={actual.precio} />
                </span>
                {actual.descripcion && <p className={styles.descripcion}>{actual.descripcion}</p>}
              </>
            )}
          </div>
        </div>

        {!actual && !barajeando && <p className={styles.vacio}>Hoy no hay nada que sortear.</p>}

        <div className={styles.acciones}>
          <Button variant="brass" className={styles.accion} onClick={girar}>
            Otra vez
          </Button>
          <Button
            variant="primary"
            className={styles.accion}
            onClick={verEnLaCarta}
            disabled={!actual}
          >
            Ver en la carta
          </Button>
        </div>

        <Button variant="ghost" className={styles.accion} onClick={() => onOpenChange(false)}>
          Cerrar
        </Button>
      </div>
    </Sheet>
  );
}
