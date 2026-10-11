import cx from "clsx";
import type { ReactNode } from "react";
import { Box, type BoxProps } from "./Box";
import { color, radius, type SizeKey } from "./styleProps";
import { Loader } from "./surfaces";
import classes from "./ds.module.css";

type Variant = "default" | "filled" | "light" | "subtle" | "outline" | "transparent" | "white";

export type ButtonProps = BoxProps & {
  variant?: Variant;
  size?: SizeKey | `compact-${SizeKey}`;
  color?: string;
  leftSection?: ReactNode;
  rightSection?: ReactNode;
  fullWidth?: boolean;
  loading?: boolean;
  radius?: SizeKey | number | (string & {});
  justify?: "center" | "space-between" | "flex-start";
};

function hueOf(c?: string) {
  if (!c) return undefined;
  return color(c.includes(".") || c.startsWith("#") || c.startsWith("var") || c.startsWith("rgb") ? c : `${c}.6`);
}

/**
 * A labelled action. `default` is the quiet field button, `filled` is the one
 * primary action on a surface, `light` and `subtle` are secondary.
 */
export function Button({
  variant = "filled",
  size = "sm",
  color: c,
  leftSection,
  rightSection,
  fullWidth,
  loading,
  radius: r,
  justify = "center",
  disabled,
  className,
  style,
  children,
  component = "button",
  ...props
}: ButtonProps) {
  const compact = size.startsWith("compact-");
  const s = size.replace("compact-", "") as SizeKey;
  return (
    <Box
      component={component}
      type={component === "button" ? (props.type ?? "button") : undefined}
      disabled={component === "button" ? disabled || loading : undefined}
      aria-disabled={disabled || loading || undefined}
      data-loading={loading || undefined}
      {...props}
      className={cx(
        classes.button,
        classes[`button_${variant}`],
        classes[`control_${s}`],
        compact && classes.buttonCompact,
        fullWidth && classes.buttonFull,
        className,
      )}
      baseStyle={{
        ["--ds-btn-c" as string]: hueOf(c),
        borderRadius: r !== undefined ? radius(r) : undefined,
        justifyContent: justify }}
      style={style}
    >
      {loading ? <Loader size={12} color="currentColor" /> : leftSection ? <span className={classes.buttonSection}>{leftSection}</span> : null}
      <span className={classes.buttonLabel}>{children}</span>
      {rightSection ? <span className={classes.buttonSection}>{rightSection}</span> : null}
    </Box>
  );
}

export type ActionIconProps = BoxProps & {
  variant?: Variant;
  size?: SizeKey | number | `input-${SizeKey}`;
  color?: string;
  radius?: SizeKey | number | (string & {});
  loading?: boolean;
};

const ICON_SIZE: Record<SizeKey, number> = { xs: 18, sm: 22, md: 28, lg: 34, xl: 44 };

/** A square icon button. Always give it an aria-label. */
export function ActionIcon({ variant = "subtle", size = "md", color: c, radius: r, loading, disabled, className, style, children, component = "button", ...props }: ActionIconProps) {
  const key = typeof size === "string" ? (size.replace("input-", "") as SizeKey) : undefined;
  const px = typeof size === "number" ? size : ICON_SIZE[key ?? "md"];
  return (
    <Box
      component={component}
      type={component === "button" ? "button" : undefined}
      disabled={component === "button" ? disabled : undefined}
      {...props}
      className={cx(classes.actionIcon, classes[`button_${variant}`], className)}
      baseStyle={{
        ["--ds-btn-c" as string]: hueOf(c),
        width: px,
        height: px,
        minWidth: px,
        borderRadius: r !== undefined ? radius(r) : undefined }}
      style={style}
    >
      {loading ? <Loader size={Math.round(px * 0.5)} color="currentColor" /> : children}
    </Box>
  );
}

/** A button with every browser style removed. */
export function UnstyledButton({ className, component = "button", ...props }: BoxProps) {
  return <Box component={component} type={component === "button" ? "button" : undefined} {...props} className={cx(classes.unstyled, className)} />;
}

export function CloseButton({ size = "md", className, ...props }: ActionIconProps & { iconSize?: number }) {
  const { iconSize, ...rest } = props as ActionIconProps & { iconSize?: number };
  return (
    <ActionIcon aria-label="Close" variant="subtle" size={size} {...rest} className={cx(classes.close, className)}>
      <svg viewBox="0 0 16 16" width={iconSize ?? 14} height={iconSize ?? 14} aria-hidden="true">
        <path d="m4 4 8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    </ActionIcon>
  );
}

export function CheckIcon({ size = 12, style, ...props }: { size?: number; style?: React.CSSProperties; className?: string }) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} aria-hidden="true" style={style} {...props}>
      <path d="m3 8.5 3.2 3L13 4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
