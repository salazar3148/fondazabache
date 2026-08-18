import { site } from '@/content/site';
import { Clock, MapPin, Wifi } from '@/components/icons';
import { CopyButton } from '@/components/features/CopyButton';
import { cn } from '@/lib/cn';
import styles from './InfoFonda.module.css';

/** docs/07 §6.3 · Server Component. Horarios, dirección y clave del wifi. */
export function InfoFonda() {
  return (
    <div className={styles.wrap}>
      <section aria-labelledby="info-horarios" className={styles.bloque}>
        <h3 className={styles.titulo} id="info-horarios">
          <Clock className={styles.icono} />
          Horarios
        </h3>
        <dl className={styles.horarios}>
          {site.horarios.map((h) => (
            <div key={h.dias} className={styles.fila}>
              <dt className={styles.dias}>{h.dias}</dt>
              <dd className={styles.horas}>{h.horas}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="info-donde" className={styles.bloque}>
        <h3 className={styles.titulo} id="info-donde">
          <MapPin className={styles.icono} />
          Dónde estamos
        </h3>
        <p className={cn(styles.dato, 'selectable')}>{site.contacto.direccion}</p>
        <a href={`tel:${site.contacto.telefono.replace(/\s/g, '')}`} className={styles.enlace}>
          {site.contacto.telefono}
        </a>
      </section>

      <section aria-labelledby="info-wifi" className={styles.bloque}>
        <h3 className={styles.titulo} id="info-wifi">
          <Wifi className={styles.icono} />
          Wifi
        </h3>

        <div className={cn('carved', styles.wifi)}>
          <div className={styles.wifiDatos}>
            <p className={styles.wifiRed}>
              Red: <span className="selectable">{site.wifi.red}</span>
            </p>
            <p className={cn(styles.wifiClave, 'selectable')}>{site.wifi.clave}</p>
          </div>
          <CopyButton valor={site.wifi.clave} descripcion="la clave del wifi" />
        </div>
      </section>
    </div>
  );
}
