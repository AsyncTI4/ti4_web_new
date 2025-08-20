import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  AppShell,
  Box,
  Tabs,
  Button,
  Group,
  Alert,
  SimpleGrid,
} from "@mantine/core";
import {
  IconMap2,
  IconTarget,
  IconUsers,
  IconAlertCircle,
} from "@tabler/icons-react";
// @ts-ignore
import Logo from "./components/Logo";
// @ts-ignore
import { DiscordLogin } from "./components/DiscordLogin";
import { HeaderMenuNew } from "./components/HeaderMenuNew";
import "./components/ScrollMap.css";
// @ts-ignore
import * as dragscroll from "dragscroll";
import classes from "./components/MapUI.module.css";

import ScoreBoard from "./components/ScoreBoard";
import { UpdateNeededScreen } from "./components/UpdateNeededScreen";
import { SettingsProvider } from "./context/SettingsContext";
import { SettingsModal } from "./components/SettingsModal";
import { KeyboardShortcutsModal } from "./components/KeyboardShortcutsModal";
import { useTabManagementNewUI } from "./hooks/useTabManagementNewUI";
import { GameContextProvider } from "./context/GameContextProvider";
import { useSettingsStore } from "./utils/appStore";

import {
  useGameData as useGameContext,
  useGameDataState,
} from "./hooks/useGameContext";
import PlayerCard2Mid from "./components/PlayerCard2Mid";
import { MapView } from "./components/main/MapView";
import { TabsControls } from "./components/main/TabsControls";
import GeneralArea from "./components/General/GeneralArea";

// Magic constant for required version schema
const REQUIRED_VERSION_SCHEMA = 5;

export const MAP_PADDING = 200;

function NewMapUIContent() {
  const enhancedData = useGameContext();
  const gameDataState = useGameDataState();
  const params = useParams<{ mapid: string }>();
  const gameId = params.mapid!;

  const { activeTabs, changeTab, removeTab } = useTabManagementNewUI();

  const settings = useSettingsStore((state) => state.settings);
  const handlers = useSettingsStore((state) => state.handlers);

  const isError = gameDataState?.isError || false;
  const versionSchema = enhancedData?.versionSchema;

  useEffect(() => {
    document.title = `${gameId} - Async TI`;
    dragscroll.reset();
  }, [gameId]);

  const navigate = useNavigate();

  if (
    enhancedData &&
    !gameDataState?.isLoading &&
    (!versionSchema || versionSchema < REQUIRED_VERSION_SCHEMA)
  ) {
    return (
      <UpdateNeededScreen
        gameId={gameId}
        activeTabs={activeTabs}
        changeTab={changeTab}
        removeTab={removeTab}
      />
    );
  }

  return (
    <AppShell header={{ height: 60 }}>
      <AppShell.Header>
        <Group
          align="center"
          h="100%"
          px="sm"
          gap="sm"
          className={classes.newHeaderGroup}
        >
          <Logo />
          <div className="logo-divider" />
          <HeaderMenuNew
            mapId={gameId}
            activeTabs={activeTabs}
            changeTab={changeTab}
            removeTab={removeTab} // eslint-disable-line @typescript-eslint/no-unused-vars
          />

          <Button
            variant="light"
            size="xs"
            color="cyan"
            onClick={() => {
              localStorage.setItem("showOldUI", "true");
              navigate(`/game/${gameId}`);
            }}
          >
            GO TO OLD UI
          </Button>
        </Group>
      </AppShell.Header>

      <AppShell.Main>
        <Box className={classes.mainBackground}>
          {/* Global Tabs */}
          <Tabs defaultValue="map" h="calc(100vh - 68px)">
            <Tabs.List className={classes.tabsList}>
              <Tabs.Tab
                value="map"
                className={classes.tabsTab}
                leftSection={<IconMap2 size={16} />}
              >
                Map
              </Tabs.Tab>
              <Tabs.Tab
                value="objectives"
                className={classes.tabsTab}
                leftSection={<IconTarget size={16} />}
              >
                Objectives
              </Tabs.Tab>
              <Tabs.Tab
                value="general"
                className={classes.tabsTab}
                leftSection={<IconTarget size={16} />}
              >
                General Area
              </Tabs.Tab>
              <Tabs.Tab
                value="players"
                className={classes.tabsTab}
                leftSection={<IconUsers size={16} />}
              >
                Player Areas
              </Tabs.Tab>
              <TabsControls />
            </Tabs.List>

            {/* Map Tab */}
            <Tabs.Panel value="map" h="calc(100% - 37px)">
              <MapView gameId={gameId} />
            </Tabs.Panel>

            {/* Player Areas Tab */}
            <Tabs.Panel value="players" h="calc(100% - 60px)">
              <Box className={classes.playersTabContent}>
                {isError && (
                  <Alert
                    variant="light"
                    color="red"
                    title="Error loading player data"
                    icon={<IconAlertCircle />}
                    mb="md"
                  >
                    Could not load player data for game {gameId}. Please try
                    again later.
                  </Alert>
                )}

                {enhancedData?.playerData && (
                  <SimpleGrid cols={{ base: 1, md: 3, xl2:3 }} spacing="sm">
                    {enhancedData.playerData.map((player) => (
                      <PlayerCard2Mid key={player.color} playerData={player} />
                    ))}
                  </SimpleGrid>
                )}
              </Box>
            </Tabs.Panel>

            <Tabs.Panel value="objectives" h="calc(100% - 60px)">
              <Box className={classes.playersTabContent}>
                {enhancedData && <ScoreBoard />}
              </Box>
            </Tabs.Panel>

            <Tabs.Panel value="general" h="calc(100% - 60px)">
              <Box className={classes.playersTabContent}>
                {enhancedData && <GeneralArea />}
              </Box>
            </Tabs.Panel>
          </Tabs>
        </Box>
      </AppShell.Main>

      <SettingsModal
        opened={settings.settingsModalOpened}
        onClose={() => handlers.setSettingsModalOpened(false)}
      />

      <KeyboardShortcutsModal
        opened={settings.keyboardShortcutsModalOpened}
        onClose={() => handlers.setKeyboardShortcutsModalOpened(false)}
      />
    </AppShell>
  );
}

export function NewMapUI() {
  const params = useParams<{ mapid: string }>();
  const gameId = params.mapid!;
  return (
    <SettingsProvider>
      <GameContextProvider gameId={gameId}>
        <NewMapUIContent />
      </GameContextProvider>
    </SettingsProvider>
  );
}

export default NewMapUI;
