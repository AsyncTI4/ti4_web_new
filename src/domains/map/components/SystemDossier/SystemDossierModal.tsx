import { AppModal } from "@/shared/ui/AppModal";
import { useAppStore } from "@/state/appStore";
import { useGameData } from "@/state/useGameContext";
import { visualViewportModalStyles } from "@/shared/ui/visualViewportModal";
import { useVisualViewport } from "@/hooks/useVisualViewport";
import { isMobileDevice } from "@/utils/isTouchDevice";
import { SystemDossier } from "./SystemDossier";
import styles from "./SystemDossier.module.css";

/** The dossier's width wherever the screen has room for it. */
const DOSSIER_WIDTH = 920;

/** Gap between the phone dossier and the edge of the screen. */
const MOBILE_SCREEN_GAP = 10;

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
      styles={
        isMobile
          ? visualViewportModalStyles(viewport, {
              gap: MOBILE_SCREEN_GAP,
              maxWidth: DOSSIER_WIDTH,
            })
          : undefined
      }
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
