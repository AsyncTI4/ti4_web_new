import { Box, Button, Group, ActionIcon, UnstyledButton } from "@mantine/core";
import cx from "clsx";
import type { ReactNode } from "react";
import {
  IconKeyboard,
  IconSettings,
  IconHash,
  IconMenu2,
  IconSticker,
  IconLinkPlus,
} from "@tabler/icons-react";
import { useGameData } from "@/state/useGameContext";
import { useSettingsStore } from "@/state/appStore";
import { cdnImage } from "@/entities/data/cdnImage";
import { isMobileDevice } from "@/utils/isTouchDevice";
import { ThemeSwatches } from "./ThemeSwatches";
import classes from "./TabsControls.module.css";

type ToolAccent = "cyan" | "blue";

const TECH_SKIP_ICONS = ["/green.png", "/yellow.png", "/red.png", "/blue.png"];

const ACCENT_CLASS: Record<ToolAccent, string> = {
  cyan: classes.accentCyan,
  blue: classes.accentBlue,
};

/** One bay in the map-tool rack. Engaged state reads as lit, not filled. */
function ToolButton({
  active = false,
  accent = "cyan",
  label,
  onClick,
  children,
}: {
  active?: boolean;
  accent?: ToolAccent;
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <UnstyledButton
      className={cx(
        classes.toolButton,
        ACCENT_CLASS[accent],
        active && classes.toolButtonActive,
      )}
      onClick={onClick}
      aria-pressed={active}
      aria-label={label}
      title={label}
    >
      {children}
    </UnstyledButton>
  );
}

function SettingsButton() {
  const handlers = useSettingsStore((state) => state.handlers);
  return (
    <Button
      variant="light"
      size="sm"
      color="gray"
      className={classes.settingsButton}
      style={{ height: "36px", minWidth: "36px" }}
      px={8}
      onClick={() => handlers.setSettingsModalOpened(true)}
    >
      <IconSettings size={16} />
    </Button>
  );
}

function ControlButtons({
  showKeyboardButton = true,
  onTryDecalsClick,
}: {
  showKeyboardButton?: boolean;
  onTryDecalsClick?: () => void;
}) {
  const game = useGameData();
  const settings = useSettingsStore((state) => state.settings);
  const handlers = useSettingsStore((state) => state.handlers);
  const showPds = !!game?.tilesWithPds?.size;

  return (
    <Box className={classes.toolRack}>
      <ToolButton
        active={settings.planetTypesMode}
        label="Planet types"
        onClick={handlers.togglePlanetTypesMode}
      >
        <img
          src={cdnImage("/planet_cards/pc_attribute_combo_CHI.webp")}
          alt=""
          height={16}
          className={classes.toolIcon}
        />
      </ToolButton>

      <ToolButton
        active={settings.techSkipsMode}
        label="Tech skips"
        onClick={handlers.toggleTechSkipsMode}
      >
        {TECH_SKIP_ICONS.map((src, index) => (
          <img
            key={src}
            src={src}
            alt=""
            height={16}
            className={classes.toolIcon}
            style={index > 0 ? { marginLeft: -4 } : undefined}
          />
        ))}
      </ToolButton>

      <ToolButton
        active={settings.attachmentsMode}
        label="Attachments"
        onClick={handlers.toggleAttachmentsMode}
      >
        <IconLinkPlus size={16} />
      </ToolButton>

      {showPds && (
        <ToolButton
          active={settings.showPDSLayer}
          accent="blue"
          label="PDS coverage"
          onClick={handlers.togglePdsMode}
        >
          <img
            src={cdnImage("/units/gry_pd.webp")}
            alt=""
            height={20}
            className={classes.toolIcon}
          />
        </ToolButton>
      )}

      {showKeyboardButton && (
        <ToolButton
          label="Keyboard shortcuts"
          onClick={() => handlers.setKeyboardShortcutsModalOpened(true)}
        >
          <IconKeyboard size={16} />
        </ToolButton>
      )}

      <ToolButton
        active={settings.overlaysEnabled}
        accent="blue"
        label="Control overlays"
        onClick={handlers.toggleOverlays}
      >
        <svg
          width="16"
          height="18"
          viewBox="0 0 16 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M4 2L12 2L15 9L12 16L4 16L1 9L4 2Z"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="miter"
          />
        </svg>
      </ToolButton>

      {onTryDecalsClick && (
        <ToolButton label="Try unit decals" onClick={onTryDecalsClick}>
          <IconSticker size={16} />
        </ToolButton>
      )}
    </Box>
  );
}

function DiscordLinks() {
  const game = useGameData();
  const links = [
    { href: game?.actionsJumpLink, label: "actions" },
    { href: game?.tableTalkJumpLink, label: "table-talk" },
  ];

  return links.map(({ href, label }) =>
    href ? (
      <Button
        key={label}
        component="a"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        size="compact-xs"
        leftSection={<IconHash size={14} />}
        px={6}
        className={classes.discordButton}
      >
        {label}
      </Button>
    ) : null,
  );
}

function DesktopTabsControls({
  onTryDecalsClick,
}: {
  onTryDecalsClick?: () => void;
}) {
  return (
    <>
      <Group gap={4} pl={8} pb={4}>
        <ControlButtons onTryDecalsClick={onTryDecalsClick} />
        <SettingsButton />
      </Group>

      <div style={{ flex: 1 }} />

      <Group gap={4} mr={12}>
        <DiscordLinks />
      </Group>

      {!isMobileDevice() && <ThemeSwatches />}
    </>
  );
}

function MobileTabsControls({
  onMenuClick,
  onTryDecalsClick,
}: {
  onMenuClick: () => void;
  onTryDecalsClick?: () => void;
}) {
  return (
    <>
      <Group gap={4} px={8} pb={4} style={{ width: "100%" }}>
        <ControlButtons
          showKeyboardButton={false}
          onTryDecalsClick={onTryDecalsClick}
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
      <Group gap={4} px={8} pb={4} style={{ width: "100%" }}>
        <DiscordLinks />
      </Group>
    </>
  );
}

export function TabsControls({
  onMenuClick,
  onTryDecalsClick,
}: {
  onMenuClick?: () => void;
  onTryDecalsClick?: () => void;
}) {
  return (
    <>
      <Box visibleFrom="sm" style={{ display: "contents" }}>
        <DesktopTabsControls onTryDecalsClick={onTryDecalsClick} />
      </Box>
      {onMenuClick && (
        <Box hiddenFrom="sm" style={{ display: "contents" }}>
          <MobileTabsControls
            onMenuClick={onMenuClick}
            onTryDecalsClick={onTryDecalsClick}
          />
        </Box>
      )}
    </>
  );
}
