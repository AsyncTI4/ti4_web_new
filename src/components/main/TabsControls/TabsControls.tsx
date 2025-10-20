import { Box, Button, Group, ActionIcon } from "@mantine/core";
import {
  IconRuler2,
  IconKeyboard,
  IconSettings,
  IconHash,
  IconMenu2,
} from "@tabler/icons-react";
import { useGameData } from "@/hooks/useGameContext";
import { SettingsStore, useSettingsStore } from "@/utils/appStore";
import { cdnImage } from "@/data/cdnImage";
import { isMobileDevice } from "@/utils/isTouchDevice";
import classes from "./TabsControls.module.css";

type TabsControlsProps = {
  onMenuClick?: () => void;
};

type ControlButtonsProps = {
  settings: SettingsStore["settings"];
  handlers: SettingsStore["handlers"];
  game: ReturnType<typeof useGameData>;
  showDistanceButton?: boolean;
};

function ControlButtons({
  settings,
  handlers,
  game,
  showDistanceButton = true,
}: ControlButtonsProps) {
  return (
    <>
      <Button
        variant="light"
        size="sm"
        color={settings.planetTypesMode ? "cyan" : "gray"}
        style={{ height: "36px", minWidth: "36px" }}
        px={8}
        onClick={handlers.togglePlanetTypesMode}
      >
        <img
          src={cdnImage("/planet_cards/pc_attribute_combo_CHI.webp")}
          alt="Planet Types"
          height={16}
        />
      </Button>

      <Button
        variant={settings.techSkipsMode ? "filled" : "light"}
        size="sm"
        color={settings.techSkipsMode ? "cyan" : "gray"}
        h={36}
        px={8}
        onClick={handlers.toggleTechSkipsMode}
      >
        <img src="/green.png" alt="Tech Skips" height={16} />
        <img
          src="/yellow.png"
          alt="Tech Skips"
          height={16}
          style={{ marginLeft: "-4px" }}
        />
        <img
          src="/red.png"
          alt="Tech Skips"
          height={16}
          style={{ marginLeft: "-4px" }}
        />
        <img
          src="/blue.png"
          alt="Tech Skips"
          height={16}
          style={{
            marginLeft: "-4px",
          }}
        />
      </Button>

      {showDistanceButton && (
        <Button
          variant={settings.distanceMode ? "filled" : "light"}
          size="sm"
          color={settings.distanceMode ? "orange" : "gray"}
          px={8}
          onClick={handlers.toggleDistanceMode}
        >
          <IconRuler2 size={16} />
        </Button>
      )}

      {game?.tilesWithPds && game.tilesWithPds.size > 0 && (
        <Button
          variant={settings.showPDSLayer ? "filled" : "light"}
          size="sm"
          color={settings.showPDSLayer ? "blue" : "gray"}
          px={8}
          onClick={handlers.togglePdsMode}
        >
          <img src={cdnImage("/units/gry_pd.webp")} alt="PDS" height={22} />
        </Button>
      )}

      {showDistanceButton && (
        <Button
          variant={settings.planetTypesMode ? "filled" : "light"}
          size="sm"
          color="gray"
          style={{ height: "36px", minWidth: "36px" }}
          px={8}
          onClick={() => handlers.setSettingsModalOpened(true)}
        >
          <IconSettings size={16} />
        </Button>
      )}

      {showDistanceButton && (
        <Button
          variant="light"
          size="sm"
          color="gray"
          h={36}
          w={36}
          px={8}
          onClick={() => handlers.setKeyboardShortcutsModalOpened(true)}
        >
          <IconKeyboard size={16} />
        </Button>
      )}

      <Button
        variant={settings.overlaysEnabled ? "filled" : "light"}
        size="sm"
        color={settings.overlaysEnabled ? "blue" : "gray"}
        px={8}
        onClick={handlers.toggleOverlays}
      >
        <svg
          width="16"
          height="18"
          viewBox="0 0 16 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 2L12 2L15 9L12 16L4 16L1 9L4 2Z"
            fill="#3b82f6"
            stroke="#3b82f6"
            strokeWidth="1.5"
            strokeLinejoin="miter"
          />
        </svg>
      </Button>
    </>
  );
}

type DiscordLinksProps = {
  game: ReturnType<typeof useGameData>;
};

function DiscordLinks({ game }: DiscordLinksProps) {
  return (
    <>
      {game?.actionsJumpLink && (
        <Button
          component="a"
          href={game.actionsJumpLink}
          target="_blank"
          rel="noopener noreferrer"
          size="compact-xs"
          leftSection={<IconHash size={14} />}
          px={6}
          className={classes.discordButton}
        >
          actions
        </Button>
      )}
      {game?.tableTalkJumpLink && (
        <Button
          component="a"
          href={game.tableTalkJumpLink}
          target="_blank"
          rel="noopener noreferrer"
          size="compact-xs"
          leftSection={<IconHash size={14} />}
          px={6}
          className={classes.discordButton}
        >
          table-talk
        </Button>
      )}
    </>
  );
}

function DesktopTabsControls({
  settings,
  handlers,
  game,
  setThemeName,
}: {
  settings: SettingsStore["settings"];
  handlers: SettingsStore["handlers"];
  game: ReturnType<typeof useGameData>;
  setThemeName: SettingsStore["handlers"]["setThemeName"];
}) {
  return (
    <>
      <Group gap={4} pl={8} pb={4}>
        <ControlButtons settings={settings} handlers={handlers} game={game} />
      </Group>

      <div style={{ flex: 1 }} />

      <Group gap={4} mr={12}>
        <DiscordLinks game={game} />
      </Group>

      {!isMobileDevice() && (
        <Box
          style={{ display: "flex", gap: 10, marginLeft: 10, marginRight: 30 }}
        >
          {[
            {
              name: "midnightbluetheme" as const,
              gradient:
                "linear-gradient(135deg, rgba(8,14,33,1) 0%, rgba(20,29,45,1) 100%)",
              highlight: "rgba(59,130,246,1)",
            },
            {
              name: "midnightredtheme" as const,
              gradient:
                "linear-gradient(135deg, rgba(18,8,12,1) 0%, rgba(45,14,20,1) 100%)",
              highlight: "rgba(220,38,38,1)",
            },
            {
              name: "midnightviolettheme" as const,
              gradient:
                "linear-gradient(135deg, rgba(14,10,26,1) 0%, rgba(34,16,46,1) 100%)",
              highlight: "rgba(168,85,247,1)",
            },
            {
              name: "midnightgreentheme" as const,
              gradient:
                "linear-gradient(135deg, rgba(8,20,14,1) 0%, rgba(12,38,26,1) 100%)",
              highlight: "rgba(16,185,129,1)",
            },
            {
              name: "midnightgraytheme" as const,
              gradient:
                "linear-gradient(135deg, rgba(8,8,8,1) 0%, rgba(24,24,24,1) 100%)",
              highlight: "rgba(200,200,200,1)",
            },
            {
              name: "vaporwavetheme" as const,
              gradient:
                "linear-gradient(135deg, rgba(255,0,170,1) 0%, rgba(0,240,255,1) 100%)",
              highlight: "rgba(255,0,170,1)",
            },
          ].map((t) => (
            <button
              key={t.name}
              onClick={() => setThemeName(t.name)}
              aria-label={`Switch to ${t.name}`}
              style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                border: `2px solid ${t.highlight}`,
                background: t.gradient,
                cursor: "pointer",
                outline:
                  settings.themeName === t.name
                    ? `2px solid ${t.highlight}`
                    : "none",
              }}
            />
          ))}
        </Box>
      )}
    </>
  );
}

function MobileTabsControls({
  settings,
  handlers,
  game,
  onMenuClick,
}: {
  settings: SettingsStore["settings"];
  handlers: SettingsStore["handlers"];
  game: ReturnType<typeof useGameData>;
  onMenuClick: () => void;
}) {
  return (
    <>
      {/* Row 1: Control buttons + hamburger */}
      <Group gap={4} px={8} pb={4} style={{ width: "100%" }}>
        <ControlButtons
          settings={settings}
          handlers={handlers}
          game={game}
          showDistanceButton={false}
        />
        <div style={{ flex: 1 }} />
        <ActionIcon
          size="lg"
          variant="filled"
          color="blue"
          onClick={onMenuClick}
          style={{ marginLeft: 4 }}
        >
          <IconMenu2 size={20} />
        </ActionIcon>
      </Group>
      {/* Row 2: Discord links */}
      <Group gap={4} px={8} pb={4} style={{ width: "100%" }}>
        <DiscordLinks game={game} />
      </Group>
    </>
  );
}

export function TabsControls({ onMenuClick }: TabsControlsProps) {
  const game = useGameData();
  const settings = useSettingsStore((state) => state.settings);
  const handlers = useSettingsStore((state) => state.handlers);
  const setThemeName = useSettingsStore((state) => state.handlers.setThemeName);

  return (
    <>
      <Box visibleFrom="sm" style={{ display: "contents" }}>
        <DesktopTabsControls
          settings={settings}
          handlers={handlers}
          game={game}
          setThemeName={setThemeName}
        />
      </Box>
      {onMenuClick && (
        <Box hiddenFrom="sm" style={{ display: "contents" }}>
          <MobileTabsControls
            settings={settings}
            handlers={handlers}
            game={game}
            onMenuClick={onMenuClick}
          />
        </Box>
      )}
    </>
  );
}
