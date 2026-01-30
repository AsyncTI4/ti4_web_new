import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
import { GamesBar } from "./components/shared/GamesBar";
import "./components/ScrollMap.css";
// @ts-ignore
import * as dragscroll from "dragscroll";
import classes from "./components/MapUI.module.css";
import ScoreBoard from "./components/ScoreBoard";
import { UpdateNeededScreen } from "./components/UpdateNeededScreen";
import { SettingsProvider } from "./context/SettingsContext";
import { SettingsModal } from "./components/SettingsModal";
import { KeyboardShortcutsModal } from "./components/KeyboardShortcutsModal";
import { GameContextProvider } from "./context/GameContextProvider";
import { useSettingsStore } from "./utils/appStore";
import {
  useGameData as useGameContext,
  useGameDataState,
} from "./hooks/useGameContext";
import PlayerCard from "./components/PlayerCard";
import { TabsControls } from "./components/main/TabsControls";
import { useTabManagementV2 } from "./hooks/useTabManagementV2";
import GeneralArea from "./components/General/GeneralArea";
import { PannableMapView } from "./components/main/MapView/PannableMapView";
import { MapView } from "./components/main/MapView";
import ChangeLogModal from "./components/ChangeLogModal/ChangeLogModal";
import {
  CHANGELOG_090,
  CURRENT_CHANGELOG_VERSION,
} from "./components/ChangeLogModal/changelogData";
import { MapViewSelectionModal } from "./components/MapViewSelectionModal";
import { type MapViewPreference } from "./utils/mapViewPreference";
import { isMobileDevice } from "./utils/isTouchDevice";
import { NavigationDrawer } from "./components/NavigationDrawer";

// Magic constant for required version schema
const REQUIRED_VERSION_SCHEMA = 5;

function NewMapUIContent({ pannable, onShowOldUI }: Props) {
  const data = useGameContext();
  const gameDataState = useGameDataState();
  const isError = gameDataState?.isError || false;
  const params = useParams<{ mapid: string }>();
  const gameId = params.mapid!;

  const { activeTabs, changeTab, removeTab } = useTabManagementV2();
  const settings = useSettingsStore((state) => state.settings);
  const handlers = useSettingsStore((state) => state.handlers);
  const versionSchema = data?.versionSchema;

  const [drawerOpened, setDrawerOpened] = useState(false);
  const [activeTab, setActiveTab] = useState("map");

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
    <AppShell header={{ height: { base: 0, sm: 60 } }}>
      <AppShell.Header visibleFrom="sm">
        <Group
          align="center"
          h="100%"
          px="sm"
          gap="sm"
          className={classes.newHeaderGroup}
        >
          <Logo />
          <div className="logo-divider" />
          <GamesBar currentMapId={gameId} />

          <Button
            variant="light"
            size="xs"
            color="cyan"
            onClick={() => {
              onShowOldUI?.();
            }}
          >
            OLD UI
          </Button>
        </Group>
      </AppShell.Header>

      <AppShell.Main>
        <Box className={classes.mainBackground}>
          {/* Global Tabs */}
          <Tabs
            value={activeTab}
            onChange={(value) => setActiveTab(value || "map")}
            h={{ base: "100vh", sm: "calc(100vh - 68px)" }}
          >
            <Tabs.List className={classes.tabsList}>
              <Tabs.Tab
                value="map"
                className={classes.tabsTab}
                leftSection={<IconMap2 size={16} />}
                visibleFrom="sm"
              >
                Map
              </Tabs.Tab>
              {!isMobileDevice() && (
                <Tabs.Tab
                  value="objectives"
                  className={classes.tabsTab}
                  leftSection={<IconTarget size={16} />}
                >
                  Objectives
                </Tabs.Tab>
              )}
              <Tabs.Tab
                value="general"
                className={classes.tabsTab}
                leftSection={<IconTarget size={16} />}
                visibleFrom="sm"
              >
                General
              </Tabs.Tab>
              <Tabs.Tab
                value="players"
                className={classes.tabsTab}
                leftSection={<IconUsers size={16} />}
                visibleFrom="sm"
              >
                Player
              </Tabs.Tab>
              <TabsControls
                onMenuClick={() => setDrawerOpened(true)}
                onTryDecalsClick={() => {
                  // This will be handled by MapView/PannableMapView
                  // We'll use a custom event to toggle the sidebar
                  window.dispatchEvent(new CustomEvent("toggleTryDecals"));
                }}
              />
            </Tabs.List>

            {/* Map Tab */}
            <Tabs.Panel value="map" h="calc(100% - 40px)">
              {pannable ? (
                <PannableMapView gameId={gameId} />
              ) : (
                <MapView gameId={gameId} />
              )}
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

                {data?.playerData && (
                  <SimpleGrid cols={{ base: 1, md: 2, xl2: 3 }} spacing="sm">
                    {data.playerData
                      .filter((player) => player.faction !== "null")
                      .map((player) => (
                        <PlayerCard key={player.color} playerData={player} />
                      ))}
                  </SimpleGrid>
                )}
              </Box>
            </Tabs.Panel>

            <Tabs.Panel value="objectives" h="calc(100% - 60px)">
              <Box className={classes.playersTabContent}>
                {data && <ScoreBoard />}
              </Box>
            </Tabs.Panel>

            <Tabs.Panel value="general" h="calc(100% - 60px)">
              <Box className={classes.playersTabContent}>
                {data && <GeneralArea />}
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

      {/* Navigation Drawer for base breakpoint */}
      <NavigationDrawer
        opened={drawerOpened}
        onClose={() => setDrawerOpened(false)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        gameId={gameId}
        activeTabs={activeTabs}
        onGameChange={changeTab}
        onRemoveTab={removeTab}
        onShowOldUI={onShowOldUI}
      />
    </AppShell>
  );
}

type Props = {
  pannable?: boolean;
  onShowOldUI?: () => void;
};

export function NewMapUI({ pannable, onShowOldUI }: Props) {
  const params = useParams<{ mapid: string }>();
  const gameId = params.mapid!;
  const themeName = useSettingsStore((state) => state.settings.themeName);
  const mapViewPreference = useSettingsStore(
    (state) => state.settings.mapViewPreference
  );
  const handlers = useSettingsStore((state) => state.handlers);

  const [showSelectionModal, setShowSelectionModal] = useState(false);

  useEffect(() => {
    if (isMobileDevice()) {
      setShowSelectionModal(false);
      return;
    }
    if (!pannable && !mapViewPreference) {
      setShowSelectionModal(true);
    }
  }, [pannable, mapViewPreference]);

  const handleMapViewSelect = (preference: MapViewPreference) => {
    handlers.setMapViewPreference(preference);
  };

  const effectivePannable = isMobileDevice()
    ? true
    : pannable || mapViewPreference === "pannable" || false;

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
    const selectedClass = isMobileDevice()
      ? "theme-mobile"
      : `theme-${themeName}`;
    body.classList.add(selectedClass);
    return () => {
      themeClasses.forEach((cls) => body.classList.remove(cls));
    };
  }, [themeName]);

  return (
    <SettingsProvider>
      <GameContextProvider gameId={gameId}>
        <div
          className={isMobileDevice() ? "theme-mobile" : `theme-${themeName}`}
        >
          <NewMapUIContent
            pannable={effectivePannable}
            onShowOldUI={onShowOldUI}
          />
        </div>
      </GameContextProvider>
      {!isMobileDevice() && (
        <ChangeLogModal
          version={CURRENT_CHANGELOG_VERSION}
          changelog={CHANGELOG_090}
        />
      )}
      {!isMobileDevice() && (
        <MapViewSelectionModal
          opened={showSelectionModal}
          onClose={() => setShowSelectionModal(false)}
          onSelect={handleMapViewSelect}
        />
      )}
    </SettingsProvider>
  );
}

export default NewMapUI;
