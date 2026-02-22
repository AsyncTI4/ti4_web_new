import { Button } from "@mantine/core";
import { GamesBar } from "./GamesBar";
import { AppHeader, type AppHeaderProps } from "./AppHeader";

export type MapHeaderSwitchProps = {
  gameId: string;
  buttonLabel: string;
  onButtonClick?: () => void;
  appHeaderProps?: AppHeaderProps;
};

/**
 * Renders the shared header used by the legacy and new map views.
 * Shows the current game's id alongside a toggle button to switch UIs.
 */
export function MapHeaderSwitch({
  gameId,
  buttonLabel,
  onButtonClick,
  appHeaderProps,
}: MapHeaderSwitchProps) {
  return (
    <AppHeader {...appHeaderProps}>
      <GamesBar currentMapId={gameId} />
      <Button variant="light" size="xs" color="cyan" onClick={onButtonClick}>
        {buttonLabel}
      </Button>
    </AppHeader>
  );
}
