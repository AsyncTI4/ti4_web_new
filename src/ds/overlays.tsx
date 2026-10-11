import { Dialog } from "@base-ui/react/dialog";
import { Popover as BasePopover } from "@base-ui/react/popover";
import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";
import cx from "clsx";
import {
  cloneElement,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useRef,
  useState,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";
import { CloseButton } from "./buttons";
import { radius, spacing, type SizeKey } from "./styleProps";
import classes from "./ds.module.css";

/* ── Portal root ──────────────────────────────────────────────────────────
 * Every floating surface portals into one node, so closed overlays never
 * leave a trail of empty divs on <body>. */

let portalRoot: HTMLElement | null = null;
export function getPortalRoot() {
  if (typeof document === "undefined") return null;
  if (!portalRoot) {
    portalRoot = document.getElementById("ds-portal-root");
    if (!portalRoot) {
      portalRoot = document.createElement("div");
      portalRoot.id = "ds-portal-root";
      document.body.appendChild(portalRoot);
    }
  }
  return portalRoot;
}

/* ── Position mapping ──────────────────────────────────────────────────── */

export type FloatingPosition =
  | "top" | "bottom" | "left" | "right"
  | "top-start" | "top-end" | "bottom-start" | "bottom-end"
  | "left-start" | "left-end" | "right-start" | "right-end";

function toSideAlign(position: FloatingPosition) {
  const [side, align] = position.split("-") as ["top" | "bottom" | "left" | "right", "start" | "end" | undefined];
  return { side, align: align ?? ("center" as const) };
}

function mergeRefs<T>(...refs: (Ref<T> | undefined)[]) {
  return (value: T | null) => {
    for (const ref of refs) {
      if (typeof ref === "function") ref(value);
      else if (ref && typeof ref === "object") (ref as { current: T | null }).current = value;
    }
  };
}

type Slot = "root" | "inner" | "overlay" | "content" | "header" | "title" | "body" | "close";
type SlotClassNames = Partial<Record<Slot, string>>;
type SlotStyles = Partial<Record<Slot, CSSProperties>>;

const MODAL_SIZE: Record<SizeKey, number> = { xs: 320, sm: 380, md: 440, lg: 620, xl: 780 };

export type ModalProps = {
  opened: boolean;
  onClose: () => void;
  title?: ReactNode;
  children?: ReactNode;
  size?: SizeKey | number | (string & {});
  centered?: boolean;
  padding?: SizeKey | number;
  radius?: SizeKey | number | (string & {});
  withCloseButton?: boolean;
  closeOnClickOutside?: boolean;
  closeOnEscape?: boolean;
  fullScreen?: boolean;
  zIndex?: number | string;
  yOffset?: number | string;
  classNames?: SlotClassNames;
  styles?: SlotStyles;
  className?: string;
  keepMounted?: boolean;
  /** Accepted for API parity; motion comes from the token layer. */
  transitionProps?: unknown;
  overlayProps?: unknown;
  lockScroll?: boolean;
  trapFocus?: boolean;
  returnFocus?: boolean;
  hiddenFrom?: string;
  /** Decision row (cancel / confirm). Rendered only when there is a decision to make. */
  footer?: ReactNode;
};

/**
 * A centred dialog. Header (title + close) and body; the frame, backdrop and
 * motion are the system's, so every modal in the app reads as one family.
 */
export function Modal({
  opened,
  onClose,
  title,
  children,
  size = "md",
  centered = true,
  padding = "md",
  radius: r,
  withCloseButton = true,
  closeOnClickOutside = true,
  closeOnEscape = true,
  fullScreen,
  zIndex = "var(--z-app-modal, 3000)",
  yOffset = "5dvh",
  classNames = {},
  styles = {},
  className,
  keepMounted,
  hiddenFrom,
  footer,
}: ModalProps) {
  const popupRef = useRef<HTMLDivElement>(null);
  const width = fullScreen ? "100%" : typeof size === "number" ? size : MODAL_SIZE[size as SizeKey] ?? size;
  return (
    <Dialog.Root
      open={opened}
      onOpenChange={(open, details) => {
        if (open) return;
        if (details.reason === "outside-press" && !closeOnClickOutside) return;
        if (details.reason === "escape-key" && !closeOnEscape) return;
        onClose();
      }}
    >
      <Dialog.Portal container={getPortalRoot()} keepMounted={keepMounted}>
        <Dialog.Backdrop
          className={cx(classes.backdrop, classNames.overlay, hiddenFrom && `ds-hidden-from-${hiddenFrom}`)}
          style={{ zIndex, ...styles.overlay }}
        />
        <div
          className={cx(classes.modalInner, centered && classes.modalCentered, fullScreen && classes.modalFull, classNames.inner, hiddenFrom && `ds-hidden-from-${hiddenFrom}`)}
          style={{ zIndex, paddingTop: centered || fullScreen ? undefined : yOffset, ...styles.inner }}
        >
          <Dialog.Popup
            ref={popupRef}
            initialFocus={popupRef}
            className={cx(classes.modal, classNames.content, className)}
            style={{ width, borderRadius: r !== undefined ? radius(r) : undefined, ...styles.content }}
          >
            {title !== undefined || withCloseButton ? (
              <div className={cx(classes.modalHeader, classNames.header)} style={{ padding: `var(--ds-space-sm) ${spacing(padding)}`, ...styles.header }}>
                {title !== undefined ? (
                  <Dialog.Title render={<div />} className={cx(classes.modalTitle, classNames.title)} style={styles.title}>
                    {title}
                  </Dialog.Title>
                ) : (
                  <span />
                )}
                {withCloseButton ? (
                  <Dialog.Close render={<CloseButton className={classNames.close} style={styles.close} />} />
                ) : null}
              </div>
            ) : null}
            <div className={cx(classes.modalBody, classNames.body)} style={{ padding: spacing(padding), ...styles.body }}>
              {children}
            </div>
            {footer ? (
              <div className={classes.modalFooter} style={{ padding: `var(--ds-space-sm) ${spacing(padding)}` }}>
                {footer}
              </div>
            ) : null}
          </Dialog.Popup>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export type DrawerProps = Omit<ModalProps, "centered" | "fullScreen" | "yOffset"> & {
  position?: "left" | "right" | "top" | "bottom";
};

const DRAWER_SIZE: Record<SizeKey, number> = { xs: 320, sm: 380, md: 440, lg: 620, xl: 780 };

/** A panel that slides in from an edge. */
export function Drawer({
  opened,
  onClose,
  title,
  children,
  position = "left",
  size = "md",
  padding = "md",
  withCloseButton = true,
  closeOnClickOutside = true,
  closeOnEscape = true,
  zIndex = "var(--z-app-modal, 3000)",
  classNames = {},
  styles = {},
  className,
  keepMounted,
  hiddenFrom,
}: DrawerProps) {
  const extent = typeof size === "number" ? size : DRAWER_SIZE[size as SizeKey] ?? size;
  const horizontal = position === "left" || position === "right";
  return (
    <Dialog.Root
      open={opened}
      onOpenChange={(open, details) => {
        if (open) return;
        if (details.reason === "outside-press" && !closeOnClickOutside) return;
        if (details.reason === "escape-key" && !closeOnEscape) return;
        onClose();
      }}
    >
      <Dialog.Portal container={getPortalRoot()} keepMounted={keepMounted}>
        <Dialog.Backdrop className={cx(classes.backdrop, classNames.overlay, hiddenFrom && `ds-hidden-from-${hiddenFrom}`)} style={{ zIndex, ...styles.overlay }} />
        <Dialog.Popup
          className={cx(classes.drawer, classes[`drawer_${position}`], classNames.content, className, hiddenFrom && `ds-hidden-from-${hiddenFrom}`)}
          style={{ zIndex, [horizontal ? "width" : "height"]: extent, ...styles.content }}
        >
          {title !== undefined || withCloseButton ? (
            <div className={cx(classes.modalHeader, classNames.header)} style={{ padding: `var(--ds-space-sm) ${spacing(padding)}`, ...styles.header }}>
              {title !== undefined ? <Dialog.Title render={<div />} className={cx(classes.modalTitle, classNames.title)} style={styles.title}>{title}</Dialog.Title> : <span />}
              {withCloseButton ? <Dialog.Close render={<CloseButton className={classNames.close} />} /> : null}
            </div>
          ) : null}
          <div className={cx(classes.drawerBody, classNames.body)} style={{ padding: spacing(padding), ...styles.body }}>
            {children}
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/* ── Popover ──────────────────────────────────────────────────────────────
 * Controlled by `opened`. The target is any element; it is used as the
 * positioning anchor, so the caller keeps its own click handling. */

type PopoverCtx = { anchor: HTMLElement | null; setAnchor: (el: HTMLElement | null) => void };
const PopoverContext = createContext<PopoverCtx | null>(null);

export type PopoverProps = {
  opened: boolean;
  onChange?: (opened: boolean) => void;
  onClose?: () => void;
  position?: FloatingPosition;
  offset?: number;
  withArrow?: boolean;
  width?: number | (string & {}) | "target";
  shadow?: SizeKey;
  zIndex?: number | string;
  closeOnClickOutside?: boolean;
  closeOnEscape?: boolean;
  withinPortal?: boolean;
  children: ReactNode;
  /** Accepted for API parity. */
  transitionProps?: unknown;
  styles?: unknown;
  trapFocus?: boolean;
  returnFocus?: boolean;
  keepMounted?: boolean;
  middlewares?: unknown;
  radius?: SizeKey | number | (string & {});
  arrowSize?: number;
};

type PopoverOwnProps = Omit<PopoverProps, "children">;
const PopoverOptions = createContext<PopoverOwnProps | null>(null);

function PopoverRoot({ children, ...options }: PopoverProps) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const { opened, onChange, onClose, closeOnClickOutside = true, closeOnEscape = true } = options;
  return (
    <PopoverContext value={{ anchor, setAnchor }}>
      <PopoverOptions value={options}>
        <BasePopover.Root
          open={opened}
          onOpenChange={(open, details) => {
            if (open) return;
            if (details.reason === "outside-press") {
              if (!closeOnClickOutside) return;
              const target = details.event?.target as Node | null;
              if (target && anchor?.contains(target)) return;
            }
            if (details.reason === "escape-key" && !closeOnEscape) return;
            onChange?.(false);
            onClose?.();
          }}
        >
          {children}
        </BasePopover.Root>
      </PopoverOptions>
    </PopoverContext>
  );
}

function PopoverTarget({ children }: { children: ReactNode; refProp?: string }) {
  const ctx = useContext(PopoverContext);
  if (!ctx || !isValidElement(children)) return <>{children}</>;
  const child = children as ReactElement<{ ref?: Ref<HTMLElement> }>;
  return cloneElement(child, { ref: mergeRefs(child.props.ref, ctx.setAnchor) });
}

export type PopoverDropdownProps = {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  p?: SizeKey | number;
  /** Render with no frame; the content brings its own surface. */
  unstyled?: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  onMouseDown?: React.MouseEventHandler<HTMLDivElement>;
};

function PopoverDropdown({ children, className, style, p, unstyled, ...props }: PopoverDropdownProps) {
  const ctx = useContext(PopoverContext);
  const options = useContext(PopoverOptions) ?? ({ opened: false } as PopoverOwnProps);
  const { position = "bottom", offset = 8, withArrow, width, shadow = "md", zIndex = "var(--z-smooth-popover, 4000)", radius: r } = options;
  const { side, align } = toSideAlign(position);
  const targetWidth = width === "target" ? ctx?.anchor?.offsetWidth : width;
  return (
    <BasePopover.Portal container={getPortalRoot()}>
      <BasePopover.Positioner anchor={ctx?.anchor} side={side} align={align} sideOffset={offset} collisionPadding={8} style={{ zIndex }}>
        <BasePopover.Popup
          {...props}
          initialFocus={false}
          className={cx(unstyled ? classes.popoverBare : classes.popover, className)}
          style={{
            width: targetWidth,
            padding: p !== undefined ? spacing(p) : undefined,
            boxShadow: unstyled ? undefined : `var(--ds-shadow-${shadow})`,
            borderRadius: r !== undefined ? radius(r) : undefined,
            ...style,
          }}
        >
          {withArrow && !unstyled ? <BasePopover.Arrow className={classes.popoverArrow} /> : null}
          {children}
        </BasePopover.Popup>
      </BasePopover.Positioner>
    </BasePopover.Portal>
  );
}

export const Popover = Object.assign(PopoverRoot, { Target: PopoverTarget, Dropdown: PopoverDropdown });

/* ── Tooltip ──────────────────────────────────────────────────────────── */

export type TooltipProps = {
  label: ReactNode;
  children: ReactNode;
  position?: FloatingPosition;
  offset?: number;
  openDelay?: number;
  closeDelay?: number;
  disabled?: boolean;
  withArrow?: boolean;
  multiline?: boolean;
  w?: number | string;
  maw?: number | string;
  zIndex?: number | string;
  className?: string;
  /** Accepted for API parity. */
  events?: unknown;
  withinPortal?: boolean;
  opened?: boolean;
  color?: string;
  transitionProps?: unknown;
};

/** A short hover/focus label. The trigger is the child element. */
export function Tooltip({
  label,
  children,
  position = "top",
  offset = 6,
  openDelay = 300,
  closeDelay = 0,
  disabled,
  withArrow,
  multiline,
  w,
  maw,
  zIndex = "var(--z-tooltip, 4500)",
  className,
  opened,
}: TooltipProps) {
  const { side, align } = toSideAlign(position);
  if (disabled || label === null || label === undefined || label === "") return <>{children}</>;
  const trigger = isValidElement(children) ? (children as ReactElement) : <span>{children}</span>;
  return (
    <BaseTooltip.Root open={opened}>
      <BaseTooltip.Trigger render={trigger} delay={openDelay} closeDelay={closeDelay} />
      <BaseTooltip.Portal container={getPortalRoot()}>
        <BaseTooltip.Positioner side={side} align={align} sideOffset={offset} collisionPadding={8} style={{ zIndex }}>
          <BaseTooltip.Popup className={cx(classes.tooltip, multiline && classes.tooltipMulti, "overlay-tooltip", className)} style={{ width: w, maxWidth: maw }}>
            {withArrow ? <BaseTooltip.Arrow className={classes.popoverArrow} /> : null}
            {label}
          </BaseTooltip.Popup>
        </BaseTooltip.Positioner>
      </BaseTooltip.Portal>
    </BaseTooltip.Root>
  );
}

/** Stable callback helper for disclosure state. */
export function useDisclosure(initial = false) {
  const [opened, setOpened] = useState(initial);
  const open = useCallback(() => setOpened(true), []);
  const close = useCallback(() => setOpened(false), []);
  const toggle = useCallback(() => setOpened((o) => !o), []);
  return [opened, { open, close, toggle, set: setOpened }] as const;
}
