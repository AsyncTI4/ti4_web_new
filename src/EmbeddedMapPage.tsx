import { useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { GameContextProvider } from "@/app/providers/context/GameContextProvider";
import { MapView } from "@/domains/map/components/MapView";
import { useSettingsStore } from "@/utils/appStore";
import { usePageThemeClass } from "@/hooks/usePageThemeClass";
import "./EmbeddedMapPage.css";

export default function EmbeddedMapPage() {
  const params = useParams<{ mapid: string }>();
  const gameId = params.mapid ?? "";
  const [searchParams] = useSearchParams();
  const embeddedSidebar =
    searchParams.get("sidebar") === "none" ? "none" : "right";
  const themeClassName = usePageThemeClass();
  const updateSettings = useSettingsStore((state) => state.updateSettings);

  useEffect(() => {
    updateSettings({ leftPanelCollapsed: true, rightPanelCollapsed: false });
  }, [updateSettings]);

  if (!gameId) {
    return null;
  }

  return (
    <div className={`embeddedGamePage ${themeClassName}`}>
      <GameContextProvider gameId={gameId}>
        <MapView gameId={gameId} embedded embeddedSidebar={embeddedSidebar} />
      </GameContextProvider>
    </div>
  );
}
