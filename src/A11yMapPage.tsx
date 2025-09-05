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
import {
  useGameData as useGameContext,
  useGameDataState,
} from "./hooks/useGameContext";
import { useTabManagementV2 } from "./hooks/useTabManagementV2";
import { A11YMapView } from "./components/main/MapView/A11YMapView";

// Magic constant for required version schema
const REQUIRED_VERSION_SCHEMA = 5;

export const MAP_PADDING = 200;

function A11yMapPageContent() {
  const data = useGameContext();
  const gameDataState = useGameDataState();
  const params = useParams<{ mapid: string }>();
  const gameId = params.mapid!;

  const { activeTabs, changeTab, removeTab } = useTabManagementV2();

  const versionSchema = data?.versionSchema;

  useEffect(() => {
    document.title = `${gameId} - Async TI`;
    dragscroll.reset();
  }, [gameId]);

  if (
    data &&
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
    <Box className={classes.mainBackground} h="calc(100vh">
      <A11YMapView gameId={gameId} />
    </Box>
  );
}

export function A11yMapPage() {
  const params = useParams<{ mapid: string }>();
  const gameId = params.mapid!;

  return (
    <SettingsProvider>
      <GameContextProvider gameId={gameId}>
        <div className={`theme-theme-bluetheme`}>
          <A11yMapPageContent />
        </div>
      </GameContextProvider>
    </SettingsProvider>
  );
}

export default A11yMapPage;
