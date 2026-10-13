import { useSyncExternalStore, type CSSProperties } from "react";

/**
 * Style props: a small, typed vocabulary every primitive accepts so layout can
 * be expressed inline without one-off CSS. Every keyword resolves to a design
 * token (`--ds-*`), so a prop like `gap="sm"` or `c="gray.5"` can never drift
 * from the token layer.
 */

export type SizeKey = "xs" | "sm" | "md" | "lg" | "xl";
export type BreakpointKey =
  | "base"
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "xl2"
  | "xl3"
  | "xl4"
  | "xl5"
  | "xl6"
  | "xl7";

export type Responsive<T> = T | Partial<Record<BreakpointKey, T>>;
export type SpacingValue = SizeKey | number | (string & {});

export type StyleProps = {
  m?: Responsive<SpacingValue>;
  mt?: Responsive<SpacingValue>;
  mb?: Responsive<SpacingValue>;
  ml?: Responsive<SpacingValue>;
  mr?: Responsive<SpacingValue>;
  mx?: Responsive<SpacingValue>;
  my?: Responsive<SpacingValue>;
  p?: Responsive<SpacingValue>;
  pt?: Responsive<SpacingValue>;
  pb?: Responsive<SpacingValue>;
  pl?: Responsive<SpacingValue>;
  pr?: Responsive<SpacingValue>;
  px?: Responsive<SpacingValue>;
  py?: Responsive<SpacingValue>;
  w?: Responsive<number | string>;
  h?: Responsive<number | string>;
  miw?: Responsive<number | string>;
  maw?: Responsive<number | string>;
  mih?: Responsive<number | string>;
  mah?: Responsive<number | string>;
  c?: string;
  bg?: string;
  fw?: number | string;
  fz?: SizeKey | number | (string & {});
  ff?: "text" | "monospace" | "heading" | "display" | (string & {});
  fs?: CSSProperties["fontStyle"];
  ta?: CSSProperties["textAlign"];
  tt?: CSSProperties["textTransform"];
  td?: CSSProperties["textDecoration"];
  lh?: SizeKey | number | (string & {});
  lts?: number | string;
  opacity?: number;
  pos?: CSSProperties["position"];
  top?: number | string;
  left?: number | string;
  right?: number | string;
  bottom?: number | string;
  inset?: number | string;
  display?: Responsive<CSSProperties["display"]>;
  flex?: CSSProperties["flex"];
  hiddenFrom?: Exclude<BreakpointKey, "base">;
  visibleFrom?: Exclude<BreakpointKey, "base">;
};

const STYLE_PROP_KEYS: (keyof StyleProps)[] = [
  "m", "mt", "mb", "ml", "mr", "mx", "my",
  "p", "pt", "pb", "pl", "pr", "px", "py",
  "w", "h", "miw", "maw", "mih", "mah",
  "c", "bg", "fw", "fz", "ff", "fs", "ta", "tt", "td", "lh", "lts",
  "opacity", "pos", "top", "left", "right", "bottom", "inset",
  "display", "flex", "hiddenFrom", "visibleFrom",
];

const SIZE_KEYS = new Set(["xs", "sm", "md", "lg", "xl"]);

const BREAKPOINTS: [Exclude<BreakpointKey, "base">, number][] = [
  ["xs", 36], ["sm", 48], ["md", 62], ["lg", 75], ["xl", 88],
  ["xl2", 100], ["xl3", 120], ["xl4", 140], ["xl5", 160], ["xl6", 180], ["xl7", 200],
];

function px(value: number | string) {
  return typeof value === "number" ? `${value}px` : value;
}

/** A spacing keyword or number as a CSS length. */
export function spacing(value: SpacingValue | undefined) {
  if (value === undefined) return undefined;
  if (typeof value === "string" && SIZE_KEYS.has(value)) {
    return `var(--ds-space-${value})`;
  }
  return px(value);
}

/** A font-size keyword or number as a CSS length. */
export function fontSize(value: SizeKey | number | (string & {}) | undefined) {
  if (value === undefined) return undefined;
  if (typeof value === "string" && SIZE_KEYS.has(value)) {
    return `var(--ds-fz-${value})`;
  }
  return px(value);
}

/** A radius keyword or number as a CSS length. */
export function radius(value: SizeKey | number | (string & {}) | undefined) {
  if (value === undefined) return undefined;
  if (typeof value === "string" && SIZE_KEYS.has(value)) {
    return `var(--ds-radius-${value})`;
  }
  return px(value);
}

function lineHeight(value: SizeKey | number | (string & {}) | undefined) {
  if (value === undefined) return undefined;
  if (typeof value === "string" && SIZE_KEYS.has(value)) {
    return `var(--ds-lh-${value})`;
  }
  return value;
}

const HUES = new Set([
  "gray", "dark", "blue", "red", "green", "yellow", "orange", "teal",
  "cyan", "violet", "grape", "pink", "indigo",
]);

/**
 * A colour keyword as a CSS colour. Accepts `hue.shade` ("gray.5"), a bare hue
 * (its shade 6), "white", "black", "dimmed", "bright", or any raw CSS colour.
 */
export function color(value: string | undefined) {
  if (!value) return undefined;
  if (value === "dimmed") return "var(--ds-ink-lo)";
  if (value === "bright") return "var(--ds-ink-hi)";
  if (value === "white") return "var(--ds-white)";
  if (value === "black") return "var(--ds-black)";
  const [name, shade] = value.split(".");
  // "purple" is the app's word for the law/agenda hue; it is violet.
  const hue = name === "purple" ? "violet" : name;
  if (!HUES.has(hue)) return value;
  return `var(--ds-${hue}-${shade ?? "6"})`;
}

function fontFamily(value: string | undefined) {
  if (!value) return undefined;
  if (value === "monospace") return "var(--ds-font-data)";
  if (value === "heading" || value === "display") return "var(--ds-font-display)";
  if (value === "text") return "var(--ds-font-text)";
  return value;
}

/* ── Breakpoint store: one set of media listeners shared by every primitive ── */

let currentBp: BreakpointKey = "base";
const listeners = new Set<() => void>();

function readBreakpoint(): BreakpointKey {
  if (typeof window === "undefined") return "base";
  const em = window.innerWidth / 16;
  let bp: BreakpointKey = "base";
  for (const [key, min] of BREAKPOINTS) if (em >= min) bp = key;
  return bp;
}

if (typeof window !== "undefined") {
  currentBp = readBreakpoint();
  window.addEventListener("resize", () => {
    const next = readBreakpoint();
    if (next === currentBp) return;
    currentBp = next;
    listeners.forEach((l) => l());
  });
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useBreakpoint() {
  return useSyncExternalStore(subscribe, () => currentBp, () => "base" as BreakpointKey);
}

const ORDER: BreakpointKey[] = ["base", ...BREAKPOINTS.map(([k]) => k)];

function isResponsive<T>(value: Responsive<T>): value is Partial<Record<BreakpointKey, T>> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Resolve a responsive value for the given breakpoint (mobile first). */
export function pick<T>(value: Responsive<T> | undefined, bp: BreakpointKey): T | undefined {
  if (value === undefined || !isResponsive(value)) return value;
  const upto = ORDER.indexOf(bp);
  let out: T | undefined;
  for (let i = 0; i <= upto; i++) {
    const v = value[ORDER[i]];
    if (v !== undefined) out = v;
  }
  return out;
}

export function hasResponsive(props: object) {
  return Object.values(props).some((v) => isResponsive(v as Responsive<unknown>) && v !== null && !(v instanceof Array) && Object.keys(v as object).some((k) => ORDER.includes(k as BreakpointKey)));
}

/** Split style props out of a props object. */
export function splitStyleProps<P extends StyleProps>(props: P) {
  const style: StyleProps = {};
  const rest: Record<string, unknown> = {};
  for (const key in props) {
    if ((STYLE_PROP_KEYS as string[]).includes(key)) {
      (style as Record<string, unknown>)[key] = props[key];
    } else {
      rest[key] = props[key];
    }
  }
  return { styleProps: style, rest: rest as Omit<P, keyof StyleProps> };
}

/** Convert style props into an inline style and visibility class names. */
export function resolveStyleProps(sp: StyleProps, bp: BreakpointKey) {
  const s: CSSProperties = {};
  const r = <T,>(v: Responsive<T> | undefined) => pick(v, bp);

  const m = spacing(r(sp.m));
  if (m !== undefined) s.margin = m;
  const mx = spacing(r(sp.mx));
  if (mx !== undefined) { s.marginLeft = mx; s.marginRight = mx; }
  const my = spacing(r(sp.my));
  if (my !== undefined) { s.marginTop = my; s.marginBottom = my; }
  const mt = spacing(r(sp.mt)); if (mt !== undefined) s.marginTop = mt;
  const mb = spacing(r(sp.mb)); if (mb !== undefined) s.marginBottom = mb;
  const ml = spacing(r(sp.ml)); if (ml !== undefined) s.marginLeft = ml;
  const mr = spacing(r(sp.mr)); if (mr !== undefined) s.marginRight = mr;

  const p = spacing(r(sp.p));
  if (p !== undefined) s.padding = p;
  const px_ = spacing(r(sp.px));
  if (px_ !== undefined) { s.paddingLeft = px_; s.paddingRight = px_; }
  const py = spacing(r(sp.py));
  if (py !== undefined) { s.paddingTop = py; s.paddingBottom = py; }
  const pt = spacing(r(sp.pt)); if (pt !== undefined) s.paddingTop = pt;
  const pb = spacing(r(sp.pb)); if (pb !== undefined) s.paddingBottom = pb;
  const pl = spacing(r(sp.pl)); if (pl !== undefined) s.paddingLeft = pl;
  const pr = spacing(r(sp.pr)); if (pr !== undefined) s.paddingRight = pr;

  const w = r(sp.w); if (w !== undefined) s.width = px(w);
  const h = r(sp.h); if (h !== undefined) s.height = px(h);
  const miw = r(sp.miw); if (miw !== undefined) s.minWidth = px(miw);
  const maw = r(sp.maw); if (maw !== undefined) s.maxWidth = px(maw);
  const mih = r(sp.mih); if (mih !== undefined) s.minHeight = px(mih);
  const mah = r(sp.mah); if (mah !== undefined) s.maxHeight = px(mah);

  if (sp.c) s.color = color(sp.c);
  if (sp.bg) s.background = color(sp.bg);
  if (sp.fw !== undefined) s.fontWeight = sp.fw as CSSProperties["fontWeight"];
  if (sp.fz !== undefined) s.fontSize = fontSize(sp.fz);
  if (sp.ff) s.fontFamily = fontFamily(sp.ff);
  if (sp.fs) s.fontStyle = sp.fs;
  if (sp.ta) s.textAlign = sp.ta;
  if (sp.tt) s.textTransform = sp.tt;
  if (sp.td) s.textDecoration = sp.td;
  if (sp.lh !== undefined) s.lineHeight = lineHeight(sp.lh);
  if (sp.lts !== undefined) s.letterSpacing = px(sp.lts);
  if (sp.opacity !== undefined) s.opacity = sp.opacity;
  if (sp.pos) s.position = sp.pos;
  if (sp.top !== undefined) s.top = px(sp.top);
  if (sp.left !== undefined) s.left = px(sp.left);
  if (sp.right !== undefined) s.right = px(sp.right);
  if (sp.bottom !== undefined) s.bottom = px(sp.bottom);
  if (sp.inset !== undefined) s.inset = px(sp.inset);
  const display = r(sp.display); if (display !== undefined) s.display = display;
  if (sp.flex !== undefined) s.flex = sp.flex;

  const classes: string[] = [];
  if (sp.hiddenFrom) classes.push(`ds-hidden-from-${sp.hiddenFrom}`);
  if (sp.visibleFrom) classes.push(`ds-visible-from-${sp.visibleFrom}`);
  return { style: s, className: classes.join(" ") };
}
