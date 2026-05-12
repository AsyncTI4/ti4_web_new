import { Button } from "@mantine/core";
import { SiteHeader } from "./SiteHeader";

export type MapHeaderSwitchProps = {
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
      <Button variant="light" size="xs" color="cyan" onClick={onButtonClick} visibleFrom={hideOnMobile ? "sm" : undefined}>
        {buttonLabel}
      </Button>
    </SiteHeader>
  );
}
