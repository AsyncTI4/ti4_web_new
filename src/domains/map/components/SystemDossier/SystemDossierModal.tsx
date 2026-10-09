import type { ModalProps } from "@mantine/core";
import { AppModal } from "@/shared/ui/AppModal";
import { useAppStore } from "@/state/appStore";
import { useGameData } from "@/state/useGameContext";
import {
  useVisualViewport,
  type VisualViewportRect,
} from "@/hooks/useVisualViewport";
import { isMobileDevice } from "@/utils/isTouchDevice";
import { SystemDossier } from "./SystemDossier";
import styles from "./SystemDossier.module.css";

/** The dossier's width wherever the screen has room for it. */
const DOSSIER_WIDTH = 920;

/** Gap between the phone dossier and the edge of the screen. */
const MOBILE_SCREEN_GAP = 10;

/**
 * On a phone the dossier is a card centred over exactly what is on screen.
 * Players pinch into the board before tapping a system, and a modal sized to
 * the layout viewport would then open several screens wide. The modal's frame
 * is pinned to the visual viewport and laid out at the unzoomed screen size,
 * then scaled back by the pinch factor, so the card reads the same at any
 * zoom. It is only as tall as its content, and no wider than on desktop; a
 * long system scrolls inside it.
 */
function mobileModalStyles(viewport: VisualViewportRect): ModalProps["styles"] {
  return {
    inner: {
      left: viewport.left,
      top: viewport.top,
      right: "auto",
      bottom: "auto",
      width: viewport.width * viewport.scale,
      height: viewport.height * viewport.scale,
      maxHeight: "none",
      padding: MOBILE_SCREEN_GAP,
      alignItems: "center",
      transform: `scale(${1 / viewport.scale})`,
      transformOrigin: "top left",
    },
    content: {
      flex: "none",
      width: "100%",
      maxWidth: DOSSIER_WIDTH,
      maxHeight: "100%",
    },
    body: { overflowX: "hidden" },
  };
}

/**
 * Host for the system dossier. Mounted once above the map views; opens when a
 * hex is clicked or tapped and reads everything else from game context.
 * Escape and the backdrop close it, per Mantine defaults; a phone has no
 * Escape and little backdrop to hit, so there it also gets a close button.
 */
export function SystemDossierModal() {
  const dossier = useAppStore((state) => state.systemDossier);
  const close = useAppStore((state) => state.closeSystemDossier);
  const gameData = useGameData();
  const isMobile = isMobileDevice();

  const tile = dossier ? gameData?.tiles?.[dossier.position] : undefined;
  const viewport = useVisualViewport(isMobile && !!tile);

  return (
    <AppModal
      opened={!!tile}
      onClose={close}
      /* The modal owns the width so its own viewport clamping applies; the
         dossier just fills it. Sizing the dossier off `100vw` instead clipped
         its trailing edge, because the modal's x-offset is not in that sum. */
      size={DOSSIER_WIDTH}
      padding={0}
      withCloseButton={false}
      classNames={{ body: styles.modalBody, content: styles.modalContent }}
      styles={isMobile ? mobileModalStyles(viewport) : undefined}
      transitionProps={{ transition: "fade", duration: 160 }}
    >
      {tile && (
        <SystemDossier
          tile={tile}
          onClose={isMobile ? close : undefined}
          unitSheetWidth={
            isMobile
              ? viewport.width * viewport.scale - MOBILE_SCREEN_GAP * 2
              : undefined
          }
        />
      )}
    </AppModal>
  );
}
