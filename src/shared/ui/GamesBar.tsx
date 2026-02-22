import { HeaderMenuNew } from "@/domains/game-shell/components/chrome/HeaderMenuNew";
import { useTabManagementV2 } from "@/hooks/useTabManagementV2";
import { useUser } from "@/hooks/useUser";
import { DashboardLink } from "@/shared/ui/DashboardLink";

type GamesBarProps = {
  currentMapId?: string;
};

export function GamesBar({ currentMapId }: GamesBarProps) {
  const { activeTabs, changeTab, removeTab } = useTabManagementV2();
  const { user } = useUser();
  const effectiveMapId = currentMapId || activeTabs[0]?.id || "";

  return (
    <HeaderMenuNew
      mapId={effectiveMapId}
      activeTabs={activeTabs}
      changeTab={changeTab}
      removeTab={removeTab}
      actions={user?.authenticated ? <DashboardLink /> : undefined}
    />
  );
}

export default GamesBar;
