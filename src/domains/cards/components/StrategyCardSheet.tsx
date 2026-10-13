import type { ComponentProps } from "react";
import { AppModal } from "@/shared/ui/AppModal";
import { visualViewportModalStyles } from "@/shared/ui/visualViewportModal";
import { useVisualViewport } from "@/hooks/useVisualViewport";
import { StrategyCardDetailsCard } from "./StrategyCardDetailsCard";

/** The details card's width wherever the screen has room for it. */
const DETAILS_WIDTH = 320;
const SCREEN_GAP = 10;

type Props = {
  initiative: number;
  color?: ComponentProps<typeof StrategyCardDetailsCard>["color"];
  opened: boolean;
  onClose: () => void;
};

/**
 * A strategy card's text on a phone. A popover is placed against the layout
 * viewport, so on a pinched board it lands off screen and scales with the
 * pinch; this sheet is centred on what is actually on screen instead.
 */
export function StrategyCardSheet({
  initiative,
  color,
  opened,
  onClose,
}: Props) {
  const viewport = useVisualViewport(opened);

  return (
    <AppModal
      opened={opened}
      onClose={onClose}
      padding={0}
      withCloseButton={false}
      styles={visualViewportModalStyles(viewport, {
        gap: SCREEN_GAP,
        maxWidth: DETAILS_WIDTH,
      })}
      transitionProps={{ transition: "fade", duration: 160 }}
    >
      <StrategyCardDetailsCard initiative={initiative} color={color} fluid />
    </AppModal>
  );
}
