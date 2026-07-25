import { Box, type BoxProps } from "@mantine/core";
import cx from "clsx";
import type { ReactNode } from "react";
import classes from "./Module.module.css";

type Chamfer = "bottomRight" | "topRight" | "none";
type Density = "default" | "compact" | "flush";

type Props = Omit<BoxProps, "children" | "style"> & {
  style?: React.CSSProperties;
  /** Section name, seated into the module's top rail rather than floating above it. */
  label?: ReactNode;
  /** Secondary value shown at the rail's trailing edge (counts, totals, ratios). */
  meta?: ReactNode;
  /** Which corner is cut. Echoes the map's hex plates and the strategy card notch. */
  chamfer?: Chamfer;
  /** Signal or player color the frame and rail key to, as an RGB triplet. */
  accentRgb?: string;
  /** Reticle brackets on the leading edge. Reserve for the card's primary modules. */
  brackets?: boolean;
  /** Graduation marks on the rail. On by default when the module has a rail. */
  ticks?: boolean;
  density?: Density;
  small?: boolean;
  /** Stretch to the row height and let the body absorb the slack. */
  fill?: boolean;
  /**
   * Set for plates that float over arbitrary content (the map) rather than a
   * card ground. Cuts the corner with clip-path instead of painting it, since
   * there is no single ground colour to paint in.
   */
  overContent?: boolean;
  children: ReactNode;
};

const accentVars = (rgb: string) =>
  ({ "--accent-rgb": rgb }) as unknown as React.CSSProperties;

const BODY_CLASS: Record<Density, string | undefined> = {
  default: undefined,
  compact: classes.bodyCompact,
  flush: classes.bodyFlush,
};

/**
 * A milled plate with a cut corner and a recessed label rail.
 *
 * Modules are the player area's unit of organization: they replace floating
 * section labels with a rail the label is seated in, so every group reads as a
 * deliberate compartment rather than content resting on a flat background.
 */
export function Module({
  label,
  meta,
  chamfer = "bottomRight",
  accentRgb,
  brackets = false,
  ticks = true,
  density = "default",
  small = false,
  fill = false,
  overContent = false,
  className,
  style,
  children,
  ...boxProps
}: Props) {
  const hasRail = label !== undefined || meta !== undefined;

  return (
    <Box
      {...boxProps}
      className={cx(
        classes.module,
        chamfer === "topRight" && classes.chamferTopRight,
        chamfer === "none" && classes.chamferNone,
        small && classes.sm,
        fill && classes.fill,
        overContent && classes.clipNotch,
        accentRgb && classes.accented,
        className
      )}
      style={accentRgb ? { ...style, ...accentVars(accentRgb) } : style}
    >
      <div className={classes.inner}>
        {hasRail && (
          <div className={classes.rail}>
            {label !== undefined && (
              <span className={classes.railLabel}>{label}</span>
            )}
            {meta !== undefined && <span className={classes.railMeta}>{meta}</span>}
            {ticks && <span className={classes.railTicks} aria-hidden="true" />}
          </div>
        )}
        {brackets && (
          <>
            <span
              className={cx(classes.bracket, classes.bracketTopLeft)}
              aria-hidden="true"
            />
            <span
              className={cx(classes.bracket, classes.bracketBottomLeft)}
              aria-hidden="true"
            />
          </>
        )}
        <div className={cx(classes.body, BODY_CLASS[density])}>{children}</div>
      </div>
    </Box>
  );
}
