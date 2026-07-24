import { useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import * as dragscroll from "dragscroll";
import { GameContextProvider } from "@/app/providers/context/GameContextProvider";
import { MapView } from "@/domains/map/components/MapView";
import { useSettingsStore } from "@/utils/appStore";
import "./EmbeddedMapPage.css";

export default function EmbeddedMapPage() {
  const params = useParams<{ mapid: string }>();
  const gameId = params.mapid ?? "";
  const [searchParams] = useSearchParams();
  const embeddedSidebar =
    searchParams.get("sidebar") === "none" ? "none" : "right";
  const themeName = useSettingsStore((state) => state.settings.themeName);
  const updateSettings = useSettingsStore((state) => state.updateSettings);

  useEffect(() => {
    dragscroll.reset();
  }, [gameId]);

  useEffect(() => {
    updateSettings({ leftPanelCollapsed: true, rightPanelCollapsed: false });
  }, [updateSettings]);

  useEffect(() => {
    const themeClasses = [
      "theme-bluetheme",
      "theme-midnightbluetheme",
      "theme-midnighttheme",
      "theme-midnightgraytheme",
      "theme-midnightredtheme",
      "theme-sunsettheme",
      "theme-magmatheme",
      "theme-vaporwavetheme",
      "theme-midnightviolettheme",
      "theme-midnightgreentheme",
      "theme-slatetheme",
      "theme-mobile",
    ];
    const body = document.body;
    themeClasses.forEach((cls) => body.classList.remove(cls));
    body.classList.add(`theme-${themeName}`);
    return () => {
      themeClasses.forEach((cls) => body.classList.remove(cls));
    };
  }, [themeName]);

  if (!gameId) {
    return null;
  }

  return (
    <div className={`embeddedGamePage theme-${themeName}`}>
      <GameContextProvider gameId={gameId}>
        <MapView gameId={gameId} embedded embeddedSidebar={embeddedSidebar} />
      </GameContextProvider>
    </div>
  );
}
