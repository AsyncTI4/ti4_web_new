import cx from "clsx";
import { useState, type CSSProperties, type ReactNode } from "react";
import { Box, type BoxProps } from "./Box";
import { color, radius, spacing, type SizeKey } from "./styleProps";
import classes from "./ds.module.css";

export type ImageProps = BoxProps & {
  fit?: CSSProperties["objectFit"];
  radius?: SizeKey | number | (string & {});
  width?: number | string;
  height?: number | string;
  fallbackSrc?: string;
};

/** Images are block-level and cover their box unless told otherwise. */
export function Image({ fit = "cover", radius: r, fallbackSrc, src, onError, width, height, className, style, ...props }: ImageProps) {
  const [failed, setFailed] = useState(false);
  return (
    <Box
      component="img"
      {...props}
      src={failed && fallbackSrc ? fallbackSrc : src}
      onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
        if (fallbackSrc) setFailed(true);
        onError?.(e as never);
      }}
      className={cx(classes.image, className)}
      baseStyle={{ objectFit: fit, borderRadius: radius(r), width, height }}
      style={style}
    />
  );
}

export type DividerProps = BoxProps & {
  orientation?: "horizontal" | "vertical";
  size?: SizeKey | number;
  color?: string;
  variant?: "solid" | "dashed" | "dotted";
};

/** A hairline. Uses the 14% step of the ladder unless a colour is given. */
export function Divider({ orientation = "horizontal", size, color: c, variant = "solid", className, style, ...props }: DividerProps) {
  const w = typeof size === "number" ? size : size ? { xs: 1, sm: 1, md: 2, lg: 3, xl: 4 }[size] : 1;
  const line = `${w}px ${variant} ${c ? color(c) : "var(--ds-h14)"}`;
  if (orientation === "vertical") {
    return <Box {...props} className={cx(classes.dividerV, className)} baseStyle={{ borderLeft: line }}
      style={style} />;
  }
  return <Box {...props} className={cx(classes.divider, className)} baseStyle={{ borderTop: line }}
      style={style} />;
}

export type PaperProps = BoxProps & { withBorder?: boolean; shadow?: SizeKey; radius?: SizeKey | number };

/** A raised panel on the ground surface. */
export function Paper({ withBorder, shadow, radius: r = "md", className, style, ...props }: PaperProps) {
  return (
    <Box
      {...props}
      className={cx(classes.paper, withBorder && classes.paperBorder, className)}
      baseStyle={{ borderRadius: radius(r), boxShadow: shadow ? `var(--ds-shadow-${shadow})` : undefined }}
      style={style}
    />
  );
}

function CardRoot({ padding = "md", style, ...props }: PaperProps & { padding?: SizeKey | number }) {
  return <Paper {...props} baseStyle={{ padding: spacing(padding) }}
      style={style} />;
}

function CardSection({ className, ...props }: BoxProps & { withBorder?: boolean; inheritPadding?: boolean }) {
  const { withBorder: _w, inheritPadding: _i, ...rest } = props;
  return <Box {...rest} className={cx(classes.cardSection, className)} />;
}

export const Card = Object.assign(CardRoot, { Section: CardSection });

export type LoaderProps = BoxProps & { size?: SizeKey | number; color?: string; type?: string };

/** A small spinner in the accent colour. */
export function Loader({ size = "md", color: c, type: _t, className, style, ...props }: LoaderProps) {
  const px = typeof size === "number" ? size : { xs: 14, sm: 18, md: 24, lg: 32, xl: 44 }[size];
  return (
    <Box
      component="span"
      role="status"
      aria-label="Loading"
      {...props}
      className={cx(classes.loader, className)}
      baseStyle={{ width: px, height: px, ["--ds-loader-c" as string]: color(c) ?? "var(--ds-accent)" }}
      style={style}
    />
  );
}

export type AlertProps = Omit<BoxProps, "title"> & {
  title?: ReactNode;
  icon?: ReactNode;
  color?: string;
  withCloseButton?: boolean;
  onClose?: () => void;
  radius?: SizeKey | number | (string & {});
};

/** A message that names what happened and what to do. */
export function Alert({ title, icon, color: c = "blue", withCloseButton, onClose, radius: r, className, style, children, ...props }: AlertProps) {
  const hue = color(c.includes(".") ? c : `${c}.6`) ?? c;
  return (
    <Box
      role="alert"
      {...props}
      className={cx(classes.alert, className)}
      baseStyle={{ ["--ds-alert-c" as string]: hue, borderRadius: r !== undefined ? radius(r) : undefined }}
      style={style}
    >
      {icon ? <span className={classes.alertIcon}>{icon}</span> : null}
      <div className={classes.alertBody}>
        {title ? <div className={classes.alertTitle}>{title}</div> : null}
        {children ? <div className={classes.alertMessage}>{children}</div> : null}
      </div>
      {withCloseButton ? (
        <button type="button" className={classes.alertClose} aria-label="Dismiss" onClick={onClose}>
          ×
        </button>
      ) : null}
    </Box>
  );
}
