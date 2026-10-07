import { HeaderMenu } from "@/domains/tabs/components/HeaderMenu";
import { useTabManagement } from "@/domains/tabs/hooks/useTabManagement";
import { useUser } from "@/api/auth/useUser";
import { DashboardLinks } from "@/layout/DashboardLinks";

type GamesBarProps = {
  currentMapId?: string;
};

export function GamesBar({ currentMapId }: GamesBarProps) {
  const { activeTabs, changeTab, removeTab } = useTabManagement();
  const { user } = useUser();

  return (
    <HeaderMenu
      mapId={currentMapId ?? ""}
      activeTabs={activeTabs}
      changeTab={changeTab}
      removeTab={removeTab}
      actions={user?.authenticated ? <DashboardLinks hideOnMobile={true} /> : undefined}
    />
  );
}
