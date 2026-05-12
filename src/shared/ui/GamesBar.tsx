import { HeaderMenuNew } from "@/domains/game-shell/components/chrome/HeaderMenuNew";
import { useTabManagementV2 } from "@/hooks/useTabManagementV2";
import { useUser } from "@/hooks/useUser";
import { DashboardLinks } from "@/shared/ui/DashboardLinks";

type GamesBarProps = {
  currentMapId?: string;
};

export function GamesBar({ currentMapId }: GamesBarProps) {
  const { activeTabs, changeTab, removeTab } = useTabManagementV2();
  const { user } = useUser();
  const effectiveMapId = currentMapId ?? "";

  return (
    <HeaderMenuNew
      mapId={effectiveMapId}
      activeTabs={activeTabs}
      changeTab={changeTab}
      removeTab={removeTab}
      actions={user?.authenticated ? <DashboardLinks hideOnMobile={true} /> : undefined}
    />
  );
}

export default GamesBar;
