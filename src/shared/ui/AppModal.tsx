import { Modal, type ModalProps } from "@/ds";

export function AppModal({
  zIndex = "var(--z-app-modal)",
  centered = true,
  ...props
}: ModalProps) {
  return <Modal centered={centered} zIndex={zIndex} {...props} />;
}
