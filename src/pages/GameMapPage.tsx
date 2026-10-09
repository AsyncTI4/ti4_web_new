import { useEffect, useState, type ReactNode } from "react";
import { useParams } from "react-router-dom";
import { AppShell, Box, Tabs, SimpleGrid } from "@mantine/core";
import { MapHeaderSwitch } from "@/layout/MapHeaderSwitch";
import classes from "@/shared/ui/map/MapUI.module.css";
import ScoreBoard from "@/domains/objectives/components/ScoreBoard/ScoreBoard";
import { UpdateNeededScreen } from "@/domains/game-shell/components/chrome/UpdateNeededScreen";
import { SettingsModal } from "@/domains/settings/components/SettingsModal";
import { SystemDossierModal } from "@/domains/map/components/SystemDossier/SystemDossierModal";
import { KeyboardShortcutsModal } from "@/domains/game-shell/components/KeyboardShortcutsModal";
import { GameContextProvider } from "@/state/GameContextProvider";
import { useSettingsStore } from "@/state/appStore";
import {
  useGameData as useGameContext,
  useGameDataState,
} from "@/state/useGameContext";
import PlayerCard from "@/domains/player/components/composition/PlayerCard";
import { TabsControls } from "@/domains/game-shell/components/TabsControls";
import { useTabManagement } from "@/domains/tabs/hooks/useTabManagement";
import GeneralArea from "@/domains/game-shell/components/GeneralArea";
import { PannableMapView } from "@/domains/game-shell/components/layouts/PannableMapView";
import { MapView } from "@/domains/game-shell/components/layouts/MapView";
import { MapLoadingState } from "@/domains/map/components/MapLoadingState";
import { MapViewportLoader } from "@/shared/ui/primitives/MapViewportLoader";
import { MapViewSelectionModal } from "@/domains/game-shell/components/MapViewSelectionModal";
import { isMobileDevice } from "@/utils/isTouchDevice";
import { NavigationDrawer } from "@/domains/game-shell/components/navigation/NavigationDrawer";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { usePageThemeClass } from "@/hooks/usePageThemeClass";
import { PlayerDataErrorAlert } from "@/shared/ui/PlayerDataErrorAlert";
import { filterPlayersWithAssignedFaction } from "@/entities/game/playerUtils";
import { MAIN_TAB_CONFIGS } from "@/domains/game-shell/components/mainTabs";
import { TabPanelSection } from "@/domains/game-shell/components/TabPanelSection";
import { APP_HEADER_HEIGHT } from "@/shared/ui/AppHeader";
import { TabActiveContext } from "@/hooks/useIsTabActive";
import { MobileHandSheet } from "@/domains/game-shell/components/SecretHand";
import { useSecretHandAccess } from "@/domains/game-shell/components/SecretHand/useSecretHandAccess";

const REQUIRED_VERSION_SCHEMA = 5;

type ContentProps = {
  pannable: boolean;
  onShowOldUI?: () => void;
};

type TabContentProps = {
  gameId: string;
  ready: boolean;
  isError: boolean;
  children: ReactNode;
};

/**
 * Every tab reads the same web-data document, so they all wait and fail the same
 * way. Without this they rendered an empty panel for both, which is why a slow
 * load and a dead game looked identical.
 */
function TabContent({ gameId, ready, isError, children }: TabContentProps) {
  if (ready) return <>{children}</>;
  if (isError) return <PlayerDataErrorAlert gameId={gameId} />;
  return <MapViewportLoader label="Acquiring game state" />;
}

function GameMapContent({ pannable, onShowOldUI }: ContentProps) {
  const data = useGameContext();
  const gameDataState = useGameDataState();
  const isError = !!gameDataState?.isError;
  const params = useParams<{ mapid: string }>();
  const gameId = params.mapid!;

  const { activeTabs, changeTab, removeTab } = useTabManagement();
  const settings = useSettingsStore((state) => state.settings);
  const handlers = useSettingsStore((state) => state.handlers);
  const versionSchema = data?.versionSchema;
  const hasChannelLinks = !!(data?.actionsJumpLink || data?.tableTalkJumpLink);

  const [drawerOpened, setDrawerOpened] = useState(false);
  /* Desktop reaches the hand through the floating map toolbar, which phones
     do not show, so there it gets its own entry points and sheet. */
  const { canViewSecretHand } = useSecretHandAccess();
  const mobileHand = isMobileDevice() && canViewSecretHand;
  const [handOpened, setHandOpened] = useState(false);
  const openHand = mobileHand ? () => setHandOpened(true) : undefined;
  const [activeTab, setActiveTab] = useState("map");
  // Tabs mount on first visit and then stay mounted (hidden), so switching back
  // to the map doesn't rebuild ~10k components every time.
  const [visitedTabs, setVisitedTabs] = useState(() => new Set(["map"]));

  const changeActiveTab = (value: string) => {
    setActiveTab(value);
    setVisitedTabs((prev) =>
      prev.has(value) ? prev : new Set(prev).add(value),
    );
  };

  const activePlayerName = data?.playerData?.find((p) => p.active)?.userName;
  useDocumentTitle(
    activePlayerName
      ? `⏳ ${activePlayerName} · ${gameId} - Async TI`
      : `${gameId} - Async TI`,
  );

  if (
    data &&
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
    <AppShell header={{ height: APP_HEADER_HEIGHT }}>
      <MapHeaderSwitch
        gameId={gameId}
        buttonLabel="OLD UI"
        onButtonClick={onShowOldUI}
        hideOnMobile
      />

      <AppShell.Main>
        <Box
          className={classes.mainBackground}
          mod={{ "channel-links": hasChannelLinks }}
        >
          <Tabs
            value={activeTab}
            onChange={(value) => changeActiveTab(value || "map")}
            h={{ base: "100vh", sm: "calc(100vh - var(--app-header-height))" }}
            keepMounted
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
                    visibleFrom={tab.visibleFrom}
                  >
                    {tab.label}
                  </Tabs.Tab>
                );
              })}
              <TabsControls
                onMenuClick={() => setDrawerOpened(true)}
                onCardsClick={openHand}
                onTryDecalsClick={() =>
                  window.dispatchEvent(new CustomEvent("toggleTryDecals"))
                }
              />
            </Tabs.List>

            {/* Map Tab
                The board, both HUD decks and the floating controls only mount
                over real data — chrome calibrated to nothing is the artifact
                this replaces. */}
            <Tabs.Panel value="map" h="calc(100% - var(--map-tabs-height))">
              <TabActiveContext value={activeTab === "map"}>
                {!data ? (
                  <MapLoadingState gameId={gameId} />
                ) : pannable ? (
                  <PannableMapView gameId={gameId} />
                ) : (
                  <MapView gameId={gameId} />
                )}
              </TabActiveContext>
            </Tabs.Panel>

            <TabPanelSection
              value="players"
              className={classes.playersTabContent}
              visited={visitedTabs.has("players")}
            >
              <TabContent
                gameId={gameId}
                ready={!!data?.playerData}
                isError={isError}
              >
                <SimpleGrid cols={{ base: 1, md: 2, xl2: 3 }} spacing="sm">
                  {filterPlayersWithAssignedFaction(data?.playerData ?? []).map(
                    (player) => (
                      <PlayerCard key={player.color} playerData={player} />
                    ),
                  )}
                </SimpleGrid>
              </TabContent>
            </TabPanelSection>

            <TabPanelSection
              value="objectives"
              className={classes.playersTabContent}
              visited={visitedTabs.has("objectives")}
            >
              <TabContent gameId={gameId} ready={!!data} isError={isError}>
                <ScoreBoard />
              </TabContent>
            </TabPanelSection>

            <TabPanelSection
              value="general"
              className={classes.playersTabContent}
              visited={visitedTabs.has("general")}
            >
              <TabContent gameId={gameId} ready={!!data} isError={isError}>
                <GeneralArea />
              </TabContent>
            </TabPanelSection>
          </Tabs>
        </Box>
      </AppShell.Main>

      <SettingsModal
        opened={settings.settingsModalOpened}
        onClose={() => handlers.setSettingsModalOpened(false)}
      />

      <SystemDossierModal />

      <KeyboardShortcutsModal
        opened={settings.keyboardShortcutsModalOpened}
        onClose={() => handlers.setKeyboardShortcutsModalOpened(false)}
      />

      <NavigationDrawer
        opened={drawerOpened}
        onClose={() => setDrawerOpened(false)}
        activeTab={activeTab}
        onTabChange={changeActiveTab}
        gameId={gameId}
        activeTabs={activeTabs}
        onGameChange={changeTab}
        onRemoveTab={removeTab}
        onShowOldUI={onShowOldUI}
        onCardsClick={openHand}
      />

      {mobileHand && (
        <MobileHandSheet
          gameId={gameId}
          opened={handOpened}
          onClose={() => setHandOpened(false)}
        />
      )}
    </AppShell>
  );
}

type Props = {
  onShowOldUI?: () => void;
};

function GameMapPage({ onShowOldUI }: Props) {
  const params = useParams<{ mapid: string }>();
  const gameId = params.mapid!;
  const themeClassName = usePageThemeClass({ mobile: isMobileDevice() });
  const mapViewPreference = useSettingsStore(
    (state) => state.settings.mapViewPreference,
  );
  const handlers = useSettingsStore((state) => state.handlers);

  const [showSelectionModal, setShowSelectionModal] = useState(false);

  useEffect(() => {
    if (isMobileDevice()) {
      setShowSelectionModal(false);
      return;
    }
    if (!mapViewPreference) {
      setShowSelectionModal(true);
    }
  }, [mapViewPreference]);

  const effectivePannable = isMobileDevice() || mapViewPreference !== "panels";

  return (
    <>
      <GameContextProvider gameId={gameId}>
        <div className={themeClassName}>
          <GameMapContent
            pannable={effectivePannable}
            onShowOldUI={onShowOldUI}
          />
        </div>
      </GameContextProvider>
      {!isMobileDevice() && (
        <MapViewSelectionModal
          opened={showSelectionModal}
          onClose={() => setShowSelectionModal(false)}
          onSelect={handlers.setMapViewPreference}
        />
      )}
    </>
  );
}

export default GameMapPage;
