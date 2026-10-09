import { AppModal } from "@/shared/ui/AppModal";
import { visualViewportModalStyles } from "@/shared/ui/visualViewportModal";
import { useVisualViewport } from "@/hooks/useVisualViewport";
import { SecretHand } from "./SecretHand";
import { usePlayerHand } from "./usePlayerHand";
import classes from "./SecretHand.module.css";

const SHEET_WIDTH = 440;
const SCREEN_GAP = 10;

type Props = {
  gameId: string;
  opened: boolean;
  onClose: () => void;
};

/**
 * The player's hand on a phone, where the floating map toolbar that carries
 * it on desktop is not shown. It rises from the bottom of the visible screen,
 * within thumb reach, and each card opens its text in place.
 */
export function MobileHandSheet({ gameId, opened, onClose }: Props) {
  const viewport = useVisualViewport(opened);
  const { data: handData, isLoading, error } = usePlayerHand(gameId);

  return (
    <AppModal
      opened={opened}
      onClose={onClose}
      title="Your Cards"
      padding={0}
      classNames={{ header: classes.sheetHeader, title: classes.sheetTitle }}
      styles={visualViewportModalStyles(viewport, {
        gap: SCREEN_GAP,
        maxWidth: SHEET_WIDTH,
        align: "flex-end",
      })}
      transitionProps={{ transition: "slide-up", duration: 180 }}
    >
      <SecretHand
        handData={handData}
        isLoading={isLoading}
        error={error}
        inlineDetails
      />
    </AppModal>
  );
}
