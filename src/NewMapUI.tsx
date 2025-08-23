import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box } from "@mantine/core";
// @ts-ignore
import "./components/ScrollMap.css";
// @ts-ignore
import * as dragscroll from "dragscroll";
import classes from "./components/MapUI.module.css";
import { UpdateNeededScreen } from "./components/UpdateNeededScreen";
import { SettingsProvider } from "./context/SettingsContext";
import { GameContextProvider } from "./context/GameContextProvider";
import { useSettingsStore } from "./utils/appStore";
import {
  useGameData as useGameContext,
  useGameDataState,
} from "./hooks/useGameContext";
import { MapView } from "./components/main/MapView";
import { useTabManagementV2 } from "./hooks/useTabManagementV2";

// Magic constant for required version schema
const REQUIRED_VERSION_SCHEMA = 5;

export const MAP_PADDING = 200;

function NewMapUIContent() {
  const enhancedData = useGameContext();
  const gameDataState = useGameDataState();
  const params = useParams<{ mapid: string }>();
  const gameId = params.mapid!;

  const { activeTabs, changeTab, removeTab } = useTabManagementV2();

  const versionSchema = enhancedData?.versionSchema;

  useEffect(() => {
    document.title = `${gameId} - Async TI`;
    dragscroll.reset();
  }, [gameId]);

  if (
    enhancedData &&
    !gameDataState?.isLoading &&
    (!versionSchema || versionSchema < REQUIRED_VERSION_SCHEMA)
  ) {
    return (
      <UpdateNeededScreen
        gameId={gameId}
        activeTabs={activeTabs.map((tab) => tab.id)}
        changeTab={changeTab}
        removeTab={removeTab}
      />
    );
  }

  return (
    <Box className={classes.mainBackground}>
      <MapView gameId={gameId} />
    </Box>
  );
}

export function NewMapUI() {
  const params = useParams<{ mapid: string }>();
  const gameId = params.mapid!;
  const themeName = useSettingsStore((state) => state.settings.themeName);

  // Ensure portals (rendered under document.body) receive the theme variables
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
    ];
    const body = document.body;
    themeClasses.forEach((cls) => body.classList.remove(cls));
    body.classList.add(`theme-${themeName}`);
    return () => {
      themeClasses.forEach((cls) => body.classList.remove(cls));
    };
  }, [themeName]);
  return (
    <SettingsProvider>
      <GameContextProvider gameId={gameId}>
        <div className={`theme-${themeName}`}>
          <NewMapUIContent />
        </div>
      </GameContextProvider>
    </SettingsProvider>
  );
}

export default NewMapUI;
