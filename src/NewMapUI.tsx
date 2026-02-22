import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppShell, Box, Tabs, SimpleGrid } from "@mantine/core";
import { MapHeaderSwitch } from "@/shared/ui/MapHeaderSwitch";
import * as dragscroll from "dragscroll";
import classes from "@/shared/ui/map/MapUI.module.css";
import ScoreBoard from "./domains/player/components/composition/ScoreBoard";
import { UpdateNeededScreen } from "./domains/game-shell/components/chrome/UpdateNeededScreen";
import { SettingsProvider } from "@/app/providers/context/SettingsContext";
import { SettingsModal } from "./domains/settings/components/SettingsModal";
import { KeyboardShortcutsModal } from "./domains/game-shell/components/KeyboardShortcutsModal";
import { GameContextProvider } from "@/app/providers/context/GameContextProvider";
import { useSettingsStore } from "./utils/appStore";
import {
  useGameData as useGameContext,
  useGameDataState,
} from "./hooks/useGameContext";
import PlayerCard from "./domains/player/components/composition/PlayerCard";
import { TabsControls } from "./domains/game-shell/components/main/TabsControls";
import { useTabManagementV2 } from "./hooks/useTabManagementV2";
import GeneralArea from "./domains/game-shell/components/General/GeneralArea";
import { PannableMapView } from "./domains/map/components/MapView/PannableMapView";
import { MapView } from "./domains/map/components/MapView";
import ChangeLogModal from "./domains/changelog/components/ChangeLogModal/ChangeLogModal";
import {
  CHANGELOG_090,
  CURRENT_CHANGELOG_VERSION,
} from "./domains/changelog/components/ChangeLogModal/changelogData";
import { MapViewSelectionModal } from "./domains/game-shell/components/MapViewSelectionModal";
import { type MapViewPreference } from "./utils/mapViewPreference";
import { isMobileDevice } from "./utils/isTouchDevice";
import { NavigationDrawer } from "./domains/game-shell/components/navigation/NavigationDrawer";
import { useDocumentTitle } from "./hooks/useDocumentTitle";
import { PlayerDataErrorAlert } from "@/shared/ui/PlayerDataErrorAlert";
import { filterPlayersWithAssignedFaction } from "@/utils/playerUtils";
import { MAIN_TAB_CONFIGS } from "./domains/game-shell/components/main/mainTabs";
import { TabPanelSection } from "./domains/game-shell/components/main/TabPanelSection";

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

  useDocumentTitle(`${gameId} - Async TI`);

  useEffect(() => {
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
      <MapHeaderSwitch
        gameId={gameId}
        buttonLabel="OLD UI"
        onButtonClick={onShowOldUI}
        appHeaderProps={{
          visibleFrom: "sm",
          groupProps: { className: classes.newHeaderGroup },
        }}
      />

      <AppShell.Main>
        <Box className={classes.mainBackground}>
          {/* Global Tabs */}
          <Tabs
            value={activeTab}
            onChange={(value) => setActiveTab(value || "map")}
            h={{ base: "100vh", sm: "calc(100vh - 68px)" }}
          >
            <Tabs.List className={classes.tabsList}>
              {MAIN_TAB_CONFIGS.map((tab) => {
                if (tab.hideOnMobile && isMobileDevice()) {
                  return null;
                }

                const Icon = tab.Icon;
                return (
                  <Tabs.Tab
                    key={tab.value}
                    value={tab.value}
                    className={classes.tabsTab}
                    leftSection={<Icon size={16} />}
                    {...(tab.visibleFrom ? { visibleFrom: tab.visibleFrom } : {})}
                  >
                    {tab.label}
                  </Tabs.Tab>
                );
              })}
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
            <TabPanelSection value="players" className={classes.playersTabContent}>
              {isError && <PlayerDataErrorAlert gameId={gameId} mb="md" />}

              {data?.playerData && (
                <SimpleGrid cols={{ base: 1, md: 2, xl2: 3 }} spacing="sm">
                  {filterPlayersWithAssignedFaction(data.playerData).map(
                    (player) => (
                      <PlayerCard key={player.color} playerData={player} />
                    ),
                  )}
                </SimpleGrid>
              )}
            </TabPanelSection>

            <TabPanelSection value="objectives" className={classes.playersTabContent}>
              {data && <ScoreBoard />}
            </TabPanelSection>

            <TabPanelSection value="general" className={classes.playersTabContent}>
              {data && <GeneralArea />}
            </TabPanelSection>
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
