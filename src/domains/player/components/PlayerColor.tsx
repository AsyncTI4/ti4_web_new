import { lighten } from "@mantine/core";
import cx from "clsx";
import {
  findColorData,
  getColorValues,
  getPrimaryColorCSS,
} from "@/entities/lookup/colors";
import styles from "./PlayerColor.module.css";

type PlayerColorProps = {
  color: string;
  size?: "xs" | "sm";
};

/* Split player colors (e.g. vapourwave) render as a hard diagonal */
function getSwatchBackground(color: string) {
  const primary = getPrimaryColorCSS(color);
  const colorData = findColorData(color);
  const secondaryValues = getColorValues(
    colorData?.secondaryColorRef,
    colorData?.secondaryColor,
  );

  if (!secondaryValues) return primary;

  const { red, green, blue } = secondaryValues;
  return `linear-gradient(135deg, ${primary} 0 50%, rgb(${red}, ${green}, ${blue}) 50% 100%)`;
}

/* Standalone pip for contexts that pair the swatch with their own text */
export function PlayerColorSwatch({ color }: { color: string }) {
  return (
    <span
      className={styles.root}
      title={color}
      style={
        {
          "--player-swatch-bg": getSwatchBackground(color),
        } as React.CSSProperties
      }
    >
      <span className={styles.swatch} />
    </span>
  );
}

export function PlayerColor({ color, size = "sm" }: PlayerColorProps) {
  const swatchBackground = getSwatchBackground(color);
  const labelColor = lighten(getPrimaryColorCSS(color), 0.45);

  return (
    <span
      className={cx(styles.root, size === "sm" && styles.sm)}
      title={color}
      style={{ "--player-swatch-bg": swatchBackground } as React.CSSProperties}
    >
      <span className={styles.swatch} />
      <span className={styles.label} style={{ color: labelColor }}>
        {color}
      </span>
    </span>
  );
}
