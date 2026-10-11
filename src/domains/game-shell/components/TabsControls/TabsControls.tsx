import { ActionIcon, Box, Button, Group, Tooltip } from "@/ds";
import cx from "clsx";
import type { ReactNode } from "react";
import {
  IconBrush,
  IconCards,
  IconFlag,
  IconHash,
  IconHistory,
  IconKeyboard,
  IconMenu2,
  IconPaperclip,
  IconPlayerSkipForward,
  IconSettings,
  IconTarget,
  IconWorld,
} from "@tabler/icons-react";
import { useGameData } from "@/state/useGameContext";
import { useSettingsStore } from "@/state/appStore";
import { isMobileDevice } from "@/utils/isTouchDevice";
import { ThemeSwatches } from "./ThemeSwatches";
import classes from "./TabsControls.module.css";

const LENS_ICON_SIZE = 15;

function LensTip({ label, shortcut }: { label: string; shortcut?: string }) {
  return (
    <span className={classes.tip}>
      {label}
      {shortcut && <kbd className={classes.kbd}>{shortcut}</kbd>}
    </span>
  );
}

/**
 * One lens in the segmented map toolbar. An engaged lens is a raised segment
 * with a blue foot; the tooltip names it and its key.
 */
function Lens({
  active,
  label,
  shortcut,
  separated = false,
  onClick,
  children,
}: {
  active?: boolean;
  label: string;
  shortcut?: string;
  separated?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <Tooltip
      label={<LensTip label={label} shortcut={shortcut} />}
      position="bottom"
      openDelay={250}
    >
      <button
        type="button"
        className={cx(classes.lens, separated && classes.lensSeparated)}
        onClick={onClick}
        aria-pressed={active === undefined ? undefined : active}
        aria-label={label}
      >
        {children}
      </button>
    </Tooltip>
  );
}

function LensToolbar({
  showKeyboardButton = true,
  showSettingsButton = true,
  onTryDecalsClick,
}: {
  showKeyboardButton?: boolean;
  showSettingsButton?: boolean;
  onTryDecalsClick?: () => void;
}) {
  const game = useGameData();
  const settings = useSettingsStore((state) => state.settings);
  const handlers = useSettingsStore((state) => state.handlers);
  const showPds = !!game?.tilesWithPds?.size;

  return (
    <Box className={classes.lenses} role="toolbar" aria-label="Map lenses">
      <Lens
        active={settings.planetTypesMode}
        label="Planet traits"
        shortcut="Y"
        onClick={handlers.togglePlanetTypesMode}
      >
        <IconWorld size={LENS_ICON_SIZE} />
      </Lens>
      <Lens
        active={settings.techSkipsMode}
        label="Tech skips"
        shortcut="T"
        onClick={handlers.toggleTechSkipsMode}
      >
        <IconPlayerSkipForward size={LENS_ICON_SIZE} />
      </Lens>
      <Lens
        active={settings.attachmentsMode}
        label="Attachments"
        shortcut="A"
        onClick={handlers.toggleAttachmentsMode}
      >
        <IconPaperclip size={LENS_ICON_SIZE} />
      </Lens>
      {showPds && (
        <Lens
          active={settings.showPDSLayer}
          label="PDS coverage"
          shortcut="P"
          onClick={handlers.togglePdsMode}
        >
          <IconTarget size={LENS_ICON_SIZE} />
        </Lens>
      )}
      <Lens
        active={settings.overlaysEnabled}
        label="Control overlays"
        shortcut="O"
        onClick={handlers.toggleOverlays}
      >
        <IconFlag size={LENS_ICON_SIZE} />
      </Lens>
      {onTryDecalsClick && (
        <Lens label="Try unit decals" separated onClick={onTryDecalsClick}>
          <IconBrush size={LENS_ICON_SIZE} />
        </Lens>
      )}
      {showKeyboardButton && (
        <Lens
          label="Keyboard shortcuts"
          separated={!onTryDecalsClick}
          onClick={() => handlers.setKeyboardShortcutsModalOpened(true)}
        >
          <IconKeyboard size={LENS_ICON_SIZE} />
        </Lens>
      )}
      {showSettingsButton && (
        <Lens
          label="Settings"
          onClick={() => handlers.setSettingsModalOpened(true)}
        >
          <IconSettings size={LENS_ICON_SIZE} />
        </Lens>
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
        leftSection={<IconHash size={13} />}
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
      <LensToolbar onTryDecalsClick={onTryDecalsClick} />
      <div className={classes.spacer} />
      <Group gap={4} mr={14} wrap="nowrap" className={classes.links}>
        <DiscordLinks />
      </Group>
      {!isMobileDevice() && <ThemeSwatches />}
    </>
  );
}

function MobileTabsControls({
  onMenuClick,
  onCardsClick,
  onEventsClick,
  onTryDecalsClick,
}: {
  onMenuClick: () => void;
  onCardsClick?: () => void;
  onEventsClick?: () => void;
  onTryDecalsClick?: () => void;
}) {
  return (
    <>
      <Group
        gap={4}
        pl={0}
        pr={8}
        pb={4}
        wrap="nowrap"
        style={{ width: "100%" }}
      >
        <Box className={classes.mobileRackScroll}>
          <LensToolbar
            showKeyboardButton={false}
            showSettingsButton={false}
            onTryDecalsClick={onTryDecalsClick}
          />
        </Box>
        <div className={classes.spacer} />
        {onEventsClick && (
          <ActionIcon
            size="lg"
            variant="default"
            aria-label="Event log"
            onClick={onEventsClick}
          >
            <IconHistory size={20} />
          </ActionIcon>
        )}
        {onCardsClick && (
          <ActionIcon
            size="lg"
            variant="default"
            aria-label="Your cards"
            onClick={onCardsClick}
          >
            <IconCards size={20} />
          </ActionIcon>
        )}
        <ActionIcon
          size="lg"
          variant="filled"
          color="blue"
          aria-label="Menu"
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
  onCardsClick,
  onEventsClick,
  onTryDecalsClick,
}: {
  onMenuClick?: () => void;
  /** Shows the hand button in the phone controls when given. */
  onCardsClick?: () => void;
  /** Shows the event log button in the phone controls when given. */
  onEventsClick?: () => void;
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
            onCardsClick={onCardsClick}
            onEventsClick={onEventsClick}
            onTryDecalsClick={onTryDecalsClick}
          />
        </Box>
      )}
    </>
  );
}
