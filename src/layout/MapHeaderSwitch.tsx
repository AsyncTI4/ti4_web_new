import type { ReactNode } from "react";
import { Button } from "@/ds";
import { SiteHeader } from "@/layout/SiteHeader";
import hud from "@/shared/ui/hudChrome.module.css";

type MapHeaderSwitchProps = {
  gameId: string;
  buttonLabel: string;
  onButtonClick?: () => void;
  hideOnMobile?: boolean;
  children?: ReactNode;
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
  children,
}: MapHeaderSwitchProps) {
  return (
    <SiteHeader currentMapId={gameId}>
      {children}
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
