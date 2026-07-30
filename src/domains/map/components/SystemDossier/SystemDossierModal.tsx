import { AppModal } from "@/shared/ui/AppModal";
import { useAppStore } from "@/utils/appStore";
import { useGameData } from "@/hooks/useGameContext";
import { isMobileDevice } from "@/utils/isTouchDevice";
import { SystemDossier } from "./SystemDossier";
import styles from "./SystemDossier.module.css";

/**
 * Host for the system dossier. Mounted once above the map views; opens when a
 * hex is clicked and reads everything else
 * from game context. Escape and the backdrop close it, per Mantine defaults.
 */
export function SystemDossierModal() {
  const dossier = useAppStore((state) => state.systemDossier);
  const close = useAppStore((state) => state.closeSystemDossier);
  const gameData = useGameData();

  /* Touch devices never open the dossier; don't even mount its chrome. */
  if (isMobileDevice()) return null;

  const tile = dossier ? gameData?.tiles?.[dossier.position] : undefined;

  return (
    <AppModal
      opened={!!tile}
      onClose={close}
      /* The modal owns the width so its own viewport clamping applies; the
         dossier just fills it. Sizing the dossier off `100vw` instead clipped
         its trailing edge, because the modal's x-offset is not in that sum. */
      size={920}
      padding={0}
      withCloseButton={false}
      classNames={{ body: styles.modalBody, content: styles.modalContent }}
      transitionProps={{ transition: "fade", duration: 160 }}
    >
      {tile && <SystemDossier tile={tile} />}
    </AppModal>
  );
}
