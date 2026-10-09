import type { ModalProps } from "@mantine/core";
import type { VisualViewportRect } from "@/hooks/useVisualViewport";

type Options = {
  /** Gap between the modal and the edge of the screen. */
  gap: number;
  /** Widest the modal grows where the screen has room for it. */
  maxWidth: number;
  /** Where the modal sits vertically: centred, or rising from the bottom. */
  align?: "center" | "flex-end";
};

/**
 * Mantine Modal styles for a phone: a card pinned to exactly what is on
 * screen. Players pinch into the board, and a modal sized to the layout
 * viewport would then open several screens wide. The modal's frame is pinned
 * to the visual viewport and laid out at the unzoomed screen size, then scaled
 * back by the pinch factor, so the card reads the same at any zoom. It is only
 * as tall as its content; anything longer scrolls inside it.
 */
export function visualViewportModalStyles(
  viewport: VisualViewportRect,
  { gap, maxWidth, align = "center" }: Options,
): ModalProps["styles"] {
  return {
    inner: {
      left: viewport.left,
      top: viewport.top,
      right: "auto",
      bottom: "auto",
      width: viewport.width * viewport.scale,
      height: viewport.height * viewport.scale,
      maxHeight: "none",
      padding: gap,
      alignItems: align,
      transform: `scale(${1 / viewport.scale})`,
      transformOrigin: "top left",
    },
    content: {
      flex: "none",
      width: "100%",
      maxWidth,
      maxHeight: "100%",
    },
    body: { overflowX: "hidden" },
  };
}
