import { Modal, type ModalProps } from "@mantine/core";

export function AppModal({
  zIndex = "var(--z-app-modal)",
  centered = true,
  ...props
}: ModalProps) {
  return <Modal centered={centered} zIndex={zIndex} {...props} />;
}
