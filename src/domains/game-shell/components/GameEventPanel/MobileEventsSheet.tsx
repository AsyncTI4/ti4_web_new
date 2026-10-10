import { AppModal } from "@/shared/ui/AppModal";
import { visualViewportModalStyles } from "@/shared/ui/visualViewportModal";
import { useVisualViewport } from "@/hooks/useVisualViewport";
import { GameEventPanel } from "./GameEventPanel";
import classes from "./MobileEventsSheet.module.css";

const SHEET_WIDTH = 440;
const SCREEN_GAP = 10;

type Props = {
  opened: boolean;
  onClose: () => void;
};

/**
 * The event log on a phone, where the floating map toolbar that carries it on
 * desktop is not shown. It rises from the bottom of the visible screen, within
 * thumb reach, like the hand sheet.
 */
export function MobileEventsSheet({ opened, onClose }: Props) {
  const viewport = useVisualViewport(opened);

  return (
    <AppModal
      opened={opened}
      onClose={onClose}
      title="Event Log"
      padding={0}
      classNames={{ header: classes.sheetHeader, title: classes.sheetTitle }}
      styles={visualViewportModalStyles(viewport, {
        gap: SCREEN_GAP,
        maxWidth: SHEET_WIDTH,
        align: "flex-end",
      })}
      transitionProps={{ transition: "slide-up", duration: 180 }}
    >
      {opened && (
        <div className={classes.sheetBody}>
          <GameEventPanel animated={false} />
        </div>
      )}
    </AppModal>
  );
}
