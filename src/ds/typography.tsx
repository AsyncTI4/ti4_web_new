import cx from "clsx";
import type { CSSProperties, ReactNode } from "react";
import { Box, type BoxProps } from "./Box";
import { fontSize, type SizeKey } from "./styleProps";
import classes from "./ds.module.css";

export type TextProps = BoxProps & {
  size?: SizeKey | number | (string & {});
  /** Render a <span> instead of a <p>. */
  span?: boolean;
  /** Inherit font size, weight and family from the parent. */
  inherit?: boolean;
  truncate?: boolean | "end" | "start";
  lineClamp?: number;
  inline?: boolean;
  /** Accepted for API parity; gradient text is not part of this system. */
  variant?: string;
  gradient?: unknown;
};

const LH: Record<string, string> = {
  xs: "var(--ds-lh-xs)", sm: "var(--ds-lh-sm)", md: "var(--ds-lh-md)", lg: "var(--ds-lh-lg)", xl: "var(--ds-lh-xl)",
};

/** Running text and inline labels. Defaults to the body ladder's md step. */
export function Text({
  size,
  span,
  inherit,
  truncate,
  lineClamp,
  inline,
  variant: _v,
  gradient: _g,
  component,
  className,
  style,
  ...props
}: TextProps) {
  const s: Record<string, unknown> = {};
  if (!inherit) {
    const key = size ?? "md";
    s["--ds-text-fz"] = fontSize(key);
    if (typeof key === "string" && LH[key]) s["--ds-text-lh"] = LH[key];
  }
  if (inline) s.lineHeight = 1;
  if (lineClamp) {
    s.display = "-webkit-box";
    s.WebkitLineClamp = lineClamp;
    s.WebkitBoxOrient = "vertical";
    s.overflow = "hidden";
  }
  return (
    <Box
      component={component ?? (span ? "span" : "p")}
      {...props}
      className={cx(classes.text, inherit && classes.textInherit, truncate && classes.truncate, className)}
      baseStyle={{ ...(s as CSSProperties) }}
      style={style}
    />
  );
}

export type TitleProps = BoxProps & { order?: 1 | 2 | 3 | 4 | 5 | 6; size?: SizeKey | number | (string & {}) | `h${1 | 2 | 3 | 4 | 5 | 6}` };

/** Headings in the display face. */
export function Title({ order = 1, size, className, style, ...props }: TitleProps) {
  const fs =
    typeof size === "string" && /^h[1-6]$/.test(size)
      ? `var(--ds-${size})`
      : size !== undefined
        ? fontSize(size as SizeKey)
        : `var(--ds-h${order})`;
  return (
    <Box
      component={`h${order}`}
      {...props}
      className={cx(classes.title, className)}
      baseStyle={{ ["--ds-title-fz" as string]: fs }}
      style={style}
    />
  );
}

export function Code({ block, className, ...props }: BoxProps & { block?: boolean }) {
  return <Box component={block ? "pre" : "code"} {...props} className={cx(classes.code, block && classes.codeBlock, className)} />;
}

export function Anchor({ className, size, underline: _u, ...props }: BoxProps & { size?: SizeKey | number; underline?: string }) {
  return (
    <Box
      component="a"
      {...props}
      className={cx(classes.anchor, className)}
      style={{ fontSize: size !== undefined ? fontSize(size) : undefined, ...props.style }}
    />
  );
}

function ListRoot({ type = "unordered", spacing: sp, size, className, children, center: _c, icon: _i, ...props }: BoxProps & { type?: "ordered" | "unordered"; spacing?: SizeKey | number; size?: SizeKey; icon?: ReactNode; center?: boolean }) {
  return (
    <Box
      component={type === "ordered" ? "ol" : "ul"}
      {...props}
      className={cx(classes.list, className)}
      style={{ fontSize: size ? fontSize(size) : undefined, rowGap: sp !== undefined ? (typeof sp === "number" ? sp : `var(--ds-space-${sp})`) : undefined, ...props.style }}
    >
      {children}
    </Box>
  );
}

function ListItem({ icon, children, ...props }: BoxProps & { icon?: ReactNode }) {
  return (
    <Box component="li" {...props}>
      {icon ? <span className={classes.listIcon}>{icon}</span> : null}
      {children}
    </Box>
  );
}

export const List = Object.assign(ListRoot, { Item: ListItem });
