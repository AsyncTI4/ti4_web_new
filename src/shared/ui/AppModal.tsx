import { Modal, type ModalProps } from "@/ds";
import cx from "clsx";

/**
 * The app's modal frame: the ds Modal with the shared header from
 * overlays.css. The header keeps its own padding whatever the body uses, so a
 * modal can lay out a full-bleed body and a decision footer with padding={0}.
 */
export function AppModal({
  zIndex = "var(--z-app-modal)",
  centered = true,
  classNames = {},
  styles = {},
  ...props
}: ModalProps) {
  return (
    <Modal
      centered={centered}
      zIndex={zIndex}
      classNames={{ ...classNames, header: cx("overlay-modal-header", classNames.header) }}
      styles={{ ...styles, header: { padding: "14px 16px 12px", ...styles.header } }}
      {...props}
    />
  );
}
