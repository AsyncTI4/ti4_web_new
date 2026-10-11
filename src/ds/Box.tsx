import {
  createElement,
  type AllHTMLAttributes,
  type CSSProperties,
  type ElementType,
  type ReactNode,
  type Ref,
} from "react";
import cx from "clsx";
import {
  resolveStyleProps,
  splitStyleProps,
  useBreakpoint,
  type StyleProps,
} from "./styleProps";

export type BoxProps = StyleProps &
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Omit<AllHTMLAttributes<any>, "color" | "size" | "wrap" | "width" | "height" | "display" | "cols" | "span" | "label" | "content" | "coords"> & {
    component?: ElementType;
    className?: string;
    style?: CSSProperties;
    children?: ReactNode;
    ref?: Ref<HTMLElement>;
    /** Pass-through for router links and other polymorphic targets. */
    to?: string;
    /** Data attributes by name: `mod={{ active: true }}` → `data-active`. */
    mod?: Record<string, boolean | string | number | undefined | null> | string;
    /** Primitive defaults: lowest priority, below style props and `style`. */
    baseStyle?: CSSProperties;
    [dataAttribute: `data-${string}`]: unknown;
  };

/**
 * The base element. Every primitive renders through this, so style props,
 * className and style merge the same way everywhere.
 */
export function Box({ component = "div", className, style, mod, baseStyle, ...props }: BoxProps) {
  const bp = useBreakpoint();
  const { styleProps, rest } = splitStyleProps(props);
  const resolved = resolveStyleProps(styleProps, bp);
  const dataAttrs: Record<string, string> = {};
  if (typeof mod === "string") dataAttrs[`data-${mod}`] = "true";
  else if (mod) {
    for (const [k, v] of Object.entries(mod)) {
      if (v === undefined || v === null || v === false) continue;
      dataAttrs[`data-${k}`] = v === true ? "true" : String(v);
    }
  }
  return createElement(component, {
    ...rest,
    ...dataAttrs,
    className: cx(resolved.className, className) || undefined,
    style: { ...baseStyle, ...resolved.style, ...style },
  });
}

/** Render helper for primitives: merges a base class and computed style. */
export function renderBox(
  props: BoxProps,
  baseClass: string | undefined,
  baseStyle?: CSSProperties,
  defaultComponent: ElementType = "div",
) {
  const { className, style, component = defaultComponent, ...rest } = props;
  return (
    <Box
      component={component}
      {...rest}
      className={cx(baseClass, className)}
      style={{ ...baseStyle, ...style }}
    />
  );
}
