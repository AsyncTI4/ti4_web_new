import classes from "./StoresGauge.module.css";

type Props = {
  iconSrc: string;
  /** RGB triplet token keying the icon's seat. */
  accentRgb: string;
  value: number;
  /** Shown as a dimmed ceiling when the store has a cap. */
  capacity?: number;
  /** Read out by assistive tech and on hover; the gauge carries no visible label. */
  label: string;
};

const accentVar = (accentRgb: string) =>
  ({ "--gauge-accent": accentRgb }) as unknown as React.CSSProperties;

/** One seated readout of a stored resource. */
export function StoresGauge({
  iconSrc,
  accentRgb,
  value,
  capacity,
  label,
}: Props) {
  return (
    <div
      className={classes.gauge}
      style={accentVar(accentRgb)}
      title={label}
      aria-label={label}
    >
      <span className={classes.gutter}>
        <img src={iconSrc} alt="" className={classes.icon} loading="lazy" />
      </span>
      <span className={classes.readout}>
        <span className={classes.value} data-empty={value === 0}>
          {value}
        </span>
        {capacity !== undefined && (
          <span className={classes.capacity}>/{capacity}</span>
        )}
      </span>
    </div>
  );
}
