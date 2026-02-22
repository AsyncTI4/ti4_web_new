import { Modal, type ModalProps } from "@mantine/core";

const DEFAULT_APP_MODAL_Z_INDEX = 3500; // Matches --z-settings-modal in zIndexVariables.css

export type AppModalProps = ModalProps;

export function AppModal({
  zIndex = DEFAULT_APP_MODAL_Z_INDEX,
  centered = true,
  ...props
}: AppModalProps) {
  return <Modal centered={centered} zIndex={zIndex} {...props} />;
}
