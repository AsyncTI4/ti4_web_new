import { HeaderMenuNew } from "@/components/HeaderMenuNew";
import { useTabManagementV2 } from "@/hooks/useTabManagementV2";

type GamesBarProps = {
  currentMapId?: string;
};

export function GamesBar({ currentMapId }: GamesBarProps) {
  const { activeTabs, changeTab, removeTab } = useTabManagementV2();
  const effectiveMapId = currentMapId || activeTabs[0]?.id || "";

  return (
    <HeaderMenuNew
      mapId={effectiveMapId}
      activeTabs={activeTabs}
      changeTab={changeTab}
      removeTab={removeTab}
    />
  );
}

export default GamesBar;

