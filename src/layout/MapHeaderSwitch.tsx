import { Button } from "@mantine/core";
import { SiteHeader } from "@/layout/SiteHeader";
import hud from "@/shared/ui/hudChrome.module.css";

type MapHeaderSwitchProps = {
  gameId: string;
  buttonLabel: string;
  onButtonClick?: () => void;
  hideOnMobile?: boolean;
};

/**
 * Renders the shared header used by the legacy and new map views.
 * Shows the current game's id alongside a toggle button to switch UIs.
 */
export function MapHeaderSwitch({
  gameId,
  buttonLabel,
  onButtonClick,
  hideOnMobile,
}: MapHeaderSwitchProps) {
  return (
    <SiteHeader currentMapId={gameId}>
      <Button
        variant="default"
        size="xs"
        className={hud.hudButton}
        onClick={onButtonClick}
        visibleFrom={hideOnMobile ? "sm" : undefined}
      >
        {buttonLabel}
      </Button>
    </SiteHeader>
  );
}
