import { Button } from "@mantine/core";
import { SiteHeader } from "./SiteHeader";

export type MapHeaderSwitchProps = {
  gameId: string;
  buttonLabel: string;
  onButtonClick?: () => void;
};

/**
 * Renders the shared header used by the legacy and new map views.
 * Shows the current game's id alongside a toggle button to switch UIs.
 */
export function MapHeaderSwitch({
  gameId,
  buttonLabel,
  onButtonClick,
}: MapHeaderSwitchProps) {
  return (
    <SiteHeader currentMapId={gameId}>
      <Button variant="light" size="xs" color="cyan" onClick={onButtonClick}>
        {buttonLabel}
      </Button>
    </SiteHeader>
  );
}
