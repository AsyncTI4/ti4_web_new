import { ScrollArea as BaseScrollArea } from "@base-ui/react/scroll-area";
import cx from "clsx";
import { useEffect, useState, type CSSProperties, type ReactNode, type Ref } from "react";
import { Box, type BoxProps } from "./Box";
import classes from "./ds.module.css";

/* ── Collapse ─────────────────────────────────────────────────────────────
 * Height animates on a grid track (0fr ↔ 1fr), so nothing is measured in JS. */

export type CollapseProps = BoxProps & {
  in: boolean;
  transitionDuration?: number;
  animateOpacity?: boolean;
  keepMounted?: boolean;
};

export function Collapse({ in: opened, transitionDuration, animateOpacity = true, className, style, children, ...props }: CollapseProps) {
  return (
    <Box
      {...props}
      aria-hidden={!opened || undefined}
      data-open={opened || undefined}
      className={cx(classes.collapse, animateOpacity && classes.collapseFade, className)}
      baseStyle={{ ...(transitionDuration !== undefined ? { ["--ds-collapse-dur" as string]: `${transitionDuration}ms` } : null) }}
      style={style}
    >
      <div className={classes.collapseInner} inert={!opened || undefined}>
        {children}
      </div>
    </Box>
  );
}

/* ── ScrollArea ───────────────────────────────────────────────────────── */

export type ScrollAreaProps = BoxProps & {
  type?: "auto" | "always" | "scroll" | "hover" | "never";
  scrollbarSize?: number;
  offsetScrollbars?: boolean;
  viewportRef?: Ref<HTMLDivElement>;
};

export function ScrollArea({ type: _t, scrollbarSize = 6, offsetScrollbars: _o, viewportRef, className, style, children, h, mah, ...props }: ScrollAreaProps) {
  return (
    <BaseScrollArea.Root className={cx(classes.scrollRoot, className)} style={{ height: typeof h === "number" ? h : (h as string | undefined), maxHeight: typeof mah === "number" ? mah : (mah as string | undefined), ...style }}>
      <BaseScrollArea.Viewport ref={viewportRef} className={classes.scrollViewport} render={<Box {...props} />}>
        {children}
      </BaseScrollArea.Viewport>
      <BaseScrollArea.Scrollbar className={classes.scrollbar} style={{ ["--ds-scrollbar" as string]: `${scrollbarSize}px` }}>
        <BaseScrollArea.Thumb className={classes.scrollThumb} />
      </BaseScrollArea.Scrollbar>
    </BaseScrollArea.Root>
  );
}

/* ── Transition ───────────────────────────────────────────────────────────
 * Mount/unmount with a short fade. The render-prop receives inline styles. */

export type TransitionProps = {
  mounted: boolean;
  transition?: string;
  duration?: number;
  exitDuration?: number;
  timingFunction?: string;
  keepMounted?: boolean;
  children: (styles: CSSProperties) => ReactNode;
};

export function Transition({ mounted, duration = 200, exitDuration, timingFunction = "cubic-bezier(0.16, 1, 0.3, 1)", keepMounted, children }: TransitionProps) {
  const [present, setPresent] = useState(mounted);
  const [visible, setVisible] = useState(mounted);
  useEffect(() => {
    if (mounted) {
      setPresent(true);
      const f = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(f);
    }
    setVisible(false);
    const t = window.setTimeout(() => setPresent(false), exitDuration ?? duration);
    return () => window.clearTimeout(t);
  }, [mounted, duration, exitDuration]);
  if (!present && !keepMounted) return null;
  return (
    <>
      {children({
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(4px)",
        transition: `opacity ${duration}ms ${timingFunction}, transform ${duration}ms ${timingFunction}`,
        display: !present && keepMounted ? "none" : undefined,
      })}
    </>
  );
}

/* ── NavLink ──────────────────────────────────────────────────────────── */

export type NavLinkProps = Omit<BoxProps, "label"> & {
  label: ReactNode;
  description?: ReactNode;
  leftSection?: ReactNode;
  rightSection?: ReactNode;
  active?: boolean;
  variant?: string;
};

export function NavLink({ label, description, leftSection, rightSection, active, variant: _v, className, component = "a", ...props }: NavLinkProps) {
  return (
    <Box component={component} {...props} data-active={active || undefined} className={cx(classes.navLink, className)}>
      {leftSection ? <span className={classes.navLinkSection}>{leftSection}</span> : null}
      <span className={classes.navLinkBody}>
        <span className={classes.navLinkLabel}>{label}</span>
        {description ? <span className={classes.navLinkDescription}>{description}</span> : null}
      </span>
      {rightSection ? <span className={classes.navLinkSection}>{rightSection}</span> : null}
    </Box>
  );
}

/* ── AppShell ─────────────────────────────────────────────────────────────
 * Fixed header (and optional footer) with a main region offset beneath. */

type ShellConfig = { height: number | string | Partial<Record<string, number>>; collapsed?: boolean; offset?: boolean };

function headerHeight(cfg?: ShellConfig) {
  if (!cfg) return "0px";
  const h = typeof cfg.height === "object" ? (cfg.height as Record<string, number>).base ?? 60 : cfg.height;
  return typeof h === "number" ? `${h}px` : h;
}

function AppShellRoot({ header, footer, padding: _p, className, style, children, ...props }: BoxProps & { header?: ShellConfig; footer?: ShellConfig; padding?: unknown; navbar?: unknown }) {
  const { navbar: _n, ...rest } = props as BoxProps & { navbar?: unknown };
  return (
    <Box
      {...rest}
      className={cx(classes.shell, className)}
      baseStyle={{
        ["--app-shell-header-height" as string]: header?.collapsed ? "0px" : headerHeight(header),
        ["--app-shell-footer-height" as string]: footer?.collapsed ? "0px" : headerHeight(footer) }}
      style={style}
    >
      {children}
    </Box>
  );
}

function AppShellHeader({ className, ...props }: BoxProps & { withBorder?: boolean; zIndex?: number }) {
  const { withBorder: _w, zIndex, ...rest } = props as BoxProps & { withBorder?: boolean; zIndex?: number };
  return <Box component="header" {...rest} className={cx(classes.shellHeader, className)} style={{ zIndex, ...rest.style }} />;
}

function AppShellMain({ className, ...props }: BoxProps) {
  return <Box component="main" {...props} className={cx(classes.shellMain, className)} />;
}

function AppShellFooter({ className, ...props }: BoxProps & { withBorder?: boolean }) {
  const { withBorder: _w, ...rest } = props as BoxProps & { withBorder?: boolean };
  return <Box component="footer" {...rest} className={cx(classes.shellFooter, className)} />;
}

export const AppShell = Object.assign(AppShellRoot, { Header: AppShellHeader, Main: AppShellMain, Footer: AppShellFooter });

/* ── useMediaQuery ────────────────────────────────────────────────────── */

export function useMediaQuery(query: string, initialValue?: boolean) {
  const [matches, setMatches] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : initialValue ?? false,
  );
  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}
