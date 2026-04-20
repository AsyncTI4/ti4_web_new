import type { ReactNode } from "react";
import { AppHeader } from "@/shared/ui/AppHeader";
import { GamesBar } from "@/shared/ui/GamesBar";
import mapClasses from "@/shared/ui/map/MapUI.module.css";

type SiteHeaderProps = {
  currentMapId?: string;
  children?: ReactNode;
};

export function SiteHeader({ currentMapId, children }: SiteHeaderProps) {
  return (
    <AppHeader groupProps={{ className: mapClasses.newHeaderGroup }}>
      <GamesBar currentMapId={currentMapId} />
      {children}
    </AppHeader>
  );
}
