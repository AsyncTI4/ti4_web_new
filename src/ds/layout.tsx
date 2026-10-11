import { Children, type CSSProperties, type ReactNode } from "react";
import cx from "clsx";
import { Box, type BoxProps } from "./Box";
import { pick, spacing, useBreakpoint, type Responsive, type SpacingValue } from "./styleProps";
import classes from "./ds.module.css";

type Align = CSSProperties["alignItems"];
type Justify = CSSProperties["justifyContent"];

export type GroupProps = BoxProps & {
  gap?: Responsive<SpacingValue>;
  align?: Align;
  justify?: Justify;
  wrap?: CSSProperties["flexWrap"];
  grow?: boolean;
  /** Kept for API parity; children never overflow the row. */
  preventGrowOverflow?: boolean;
};

/** A horizontal row. Centres on the cross axis and wraps by default. */
export function Group({
  gap = "md",
  align = "center",
  justify = "flex-start",
  wrap = "wrap",
  grow,
  preventGrowOverflow: _p,
  className,
  style,
  ...props
}: GroupProps) {
  const bp = useBreakpoint();
  return (
    <Box
      {...props}
      className={cx(classes.group, grow && classes.groupGrow, className)}
      baseStyle={{
        ["--ds-gap" as string]: spacing(pick(gap, bp)),
        ["--ds-align" as string]: align,
        ["--ds-justify" as string]: justify,
        ["--ds-wrap" as string]: wrap }}
      style={style}
    />
  );
}

export type StackProps = BoxProps & {
  gap?: Responsive<SpacingValue>;
  align?: Align;
  justify?: Justify;
};

/** A vertical column. Stretches children by default. */
export function Stack({ gap = "md", align = "stretch", justify = "flex-start", className, style, ...props }: StackProps) {
  const bp = useBreakpoint();
  return (
    <Box
      {...props}
      className={cx(classes.stack, className)}
      baseStyle={{ ["--ds-gap" as string]: spacing(pick(gap, bp)), ["--ds-align" as string]: align, ["--ds-justify" as string]: justify }}
      style={style}
    />
  );
}

export type FlexProps = BoxProps & {
  gap?: Responsive<SpacingValue>;
  rowGap?: Responsive<SpacingValue>;
  columnGap?: Responsive<SpacingValue>;
  align?: Responsive<Align>;
  justify?: Responsive<Justify>;
  wrap?: Responsive<CSSProperties["flexWrap"]>;
  direction?: Responsive<CSSProperties["flexDirection"]>;
};

export function Flex({ gap, rowGap, columnGap, align, justify, wrap, direction, style, ...props }: FlexProps) {
  const bp = useBreakpoint();
  return (
    <Box
      {...props}
      baseStyle={{
        display: "flex",
        gap: spacing(pick(gap, bp)),
        rowGap: spacing(pick(rowGap, bp)),
        columnGap: spacing(pick(columnGap, bp)),
        alignItems: pick(align, bp),
        justifyContent: pick(justify, bp),
        flexWrap: pick(wrap, bp),
        flexDirection: pick(direction, bp) }}
      style={style}
    />
  );
}

export function Center({ inline, style, ...props }: BoxProps & { inline?: boolean }) {
  return (
    <Box
      {...props}
      baseStyle={{ display: inline ? "inline-flex" : "flex", alignItems: "center", justifyContent: "center" }}
      style={style}
    />
  );
}

export type SimpleGridProps = BoxProps & {
  cols?: Responsive<number>;
  spacing?: Responsive<SpacingValue>;
  verticalSpacing?: Responsive<SpacingValue>;
};

export function SimpleGrid({ cols = 1, spacing: sp = "md", verticalSpacing, style, ...props }: SimpleGridProps) {
  const bp = useBreakpoint();
  const n = pick(cols, bp) ?? 1;
  const col = spacing(pick(sp, bp));
  const row = spacing(pick(verticalSpacing ?? sp, bp));
  return (
    <Box
      {...props}
      baseStyle={{
        display: "grid",
        gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))`,
        columnGap: col,
        rowGap: row }}
      style={style}
    />
  );
}

type GridProps = BoxProps & { gutter?: Responsive<SpacingValue>; columns?: number; align?: Align; justify?: Justify };
type GridColProps = BoxProps & { span?: Responsive<number | "auto" | "content">; offset?: Responsive<number> };

function GridRoot({ gutter = "md", columns = 12, align, justify, style, ...props }: GridProps) {
  const bp = useBreakpoint();
  return (
    <Box
      {...props}
      baseStyle={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gap: spacing(pick(gutter, bp)),
        alignItems: align,
        justifyContent: justify }}
      style={style}
    />
  );
}

function GridCol({ span = 12, offset, style, ...props }: GridColProps) {
  const bp = useBreakpoint();
  const s = pick(span, bp);
  const o = pick(offset, bp);
  const gridColumn = typeof s === "number" ? `${o ? o + 1 : "auto"} / span ${s}` : "auto";
  return <Box {...props} baseStyle={{ gridColumn, minWidth: 0 }}
      style={style} />;
}

export const Grid = Object.assign(GridRoot, { Col: GridCol });

const CONTAINER = { xs: 540, sm: 720, md: 960, lg: 1140, xl: 1320 } as const;

export function Container({
  size = "md",
  fluid,
  style,
  ...props
}: BoxProps & { size?: keyof typeof CONTAINER | number; fluid?: boolean }) {
  const max = fluid ? "100%" : typeof size === "number" ? size : CONTAINER[size];
  return (
    <Box
      {...props}
      baseStyle={{ maxWidth: max, marginLeft: "auto", marginRight: "auto", paddingLeft: "var(--ds-space-md)", paddingRight: "var(--ds-space-md)" }}
      style={style}
    />
  );
}

/** Space between siblings without a wrapper element. */
export function Space({ h, w }: { h?: SpacingValue; w?: SpacingValue }) {
  return <div style={{ height: spacing(h), width: spacing(w), flex: "none" }} />;
}

export function countChildren(children: ReactNode) {
  return Children.count(children);
}
