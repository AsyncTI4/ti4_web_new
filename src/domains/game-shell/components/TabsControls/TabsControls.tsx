import { ActionIcon, Box, Button, Group, Tooltip } from "@/ds";
import type { ReactNode } from "react";
import {
  IconCards,
  IconHash,
  IconHistory,
  IconKeyboard,
  IconLinkPlus,
  IconMenu2,
  IconSettings,
  IconSticker,
} from "@tabler/icons-react";
import { useGameData } from "@/state/useGameContext";
import { useSettingsStore } from "@/state/appStore";
import { cdnImage } from "@/entities/data/cdnImage";
import { TECH_COLOR_IMAGES } from "@/entities/data/uiImages";
import { isMobileDevice } from "@/utils/isTouchDevice";
import { ThemeSwatches } from "./ThemeSwatches";
import { BoardSearch } from "@/domains/search/BoardSearch";
import classes from "./TabsControls.module.css";

const LENS_ICON_SIZE = 16;

const TECH_SKIP_ICONS = [
  TECH_COLOR_IMAGES.green,
  TECH_COLOR_IMAGES.yellow,
  TECH_COLOR_IMAGES.red,
  TECH_COLOR_IMAGES.blue,
];

function LensTip({ label, shortcut }: { label: string; shortcut?: string }) {
  return (
    <span className={classes.tip}>
      {label}
      {shortcut && <kbd className={classes.kbd}>{shortcut}</kbd>}
    </span>
  );
}

/**
 * One button in the map toolbar. A lens (has `active`) is a raised key with
 * an accent bar while engaged; the tooltip names it and its key.
 */
function Lens({
  active,
  label,
  shortcut,
  onClick,
  children,
}: {
  active?: boolean;
  label: string;
  shortcut?: string;
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
        className={classes.lens}
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
  onCardsClick,
  onEventsClick,
  onTryDecalsClick,
}: {
  showKeyboardButton?: boolean;
  showSettingsButton?: boolean;
  /** Event log and hand on the non-map desktop tabs, where the floating map
      toolbar that carries them is not shown. */
  onCardsClick?: () => void;
  onEventsClick?: () => void;
  onTryDecalsClick?: () => void;
}) {
  const game = useGameData();
  const settings = useSettingsStore((state) => state.settings);
  const handlers = useSettingsStore((state) => state.handlers);
  const showPds = !!game?.tilesWithPds?.size;

  return (
    <Box className={classes.toolbar}>
      <Box className={classes.lenses} role="toolbar" aria-label="Map lenses">
        <Lens
          active={settings.planetTypesMode}
          label="Planet traits"
          shortcut="Y"
          onClick={handlers.togglePlanetTypesMode}
        >
          <img
            src={cdnImage("/planet_cards/pc_attribute_combo_CHI.webp")}
            alt=""
            height={16}
            className={classes.lensArt}
          />
        </Lens>
        <Lens
          active={settings.techSkipsMode}
          label="Tech skips"
          shortcut="T"
          onClick={handlers.toggleTechSkipsMode}
        >
          <span className={classes.lensSkips}>
            {TECH_SKIP_ICONS.map((src) => (
              <img
                key={src}
                src={src}
                alt=""
                height={16}
                className={classes.lensArt}
              />
            ))}
          </span>
        </Lens>
        <Lens
          active={settings.attachmentsMode}
          label="Attachments"
          shortcut="A"
          onClick={handlers.toggleAttachmentsMode}
        >
          <IconLinkPlus size={LENS_ICON_SIZE} />
        </Lens>
        {showPds && (
          <Lens
            active={settings.showPDSLayer}
            label="PDS coverage"
            shortcut="P"
            onClick={handlers.togglePdsMode}
          >
            <img
              src={cdnImage("/units/gry_pd.webp")}
              alt=""
              height={20}
              className={classes.lensArt}
            />
          </Lens>
        )}
        <Lens
          active={settings.overlaysEnabled}
          label="Control overlays"
          shortcut="O"
          onClick={handlers.toggleOverlays}
        >
          <svg
            width="13"
            height="15"
            viewBox="0 0 16 18"
            fill="none"
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
        </Lens>
      </Box>
      <Box className={classes.utilities} role="toolbar" aria-label="Map tools">
        {onEventsClick && (
          <Lens label="Event log" onClick={onEventsClick}>
            <IconHistory size={LENS_ICON_SIZE} />
          </Lens>
        )}
        {onCardsClick && (
          <Lens label="Your cards" onClick={onCardsClick}>
            <IconCards size={LENS_ICON_SIZE} />
          </Lens>
        )}
        {onTryDecalsClick && (
          <Lens label="Try unit decals" onClick={onTryDecalsClick}>
            <IconSticker size={LENS_ICON_SIZE} />
          </Lens>
        )}
        {showKeyboardButton && (
          <Lens
            label="Keyboard shortcuts"
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
  showSearch,
  onCardsClick,
  onEventsClick,
  onTryDecalsClick,
}: {
  showSearch: boolean;
  onCardsClick?: () => void;
  onEventsClick?: () => void;
  onTryDecalsClick?: () => void;
}) {
  return (
    <>
      <LensToolbar
        onCardsClick={onCardsClick}
        onEventsClick={onEventsClick}
        onTryDecalsClick={onTryDecalsClick}
      />
      {showSearch && <BoardSearch />}
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
  showSearch = true,
  onMenuClick,
  onCardsClick,
  onEventsClick,
  onDesktopCardsClick,
  onDesktopEventsClick,
  onTryDecalsClick,
}: {
  /** Off on the tabs that are plain HTML, where unmounting the board search
      also hands Ctrl+F back to the browser's find. */
  showSearch?: boolean;
  onMenuClick?: () => void;
  /** Shows the hand button in the phone controls when given. */
  onCardsClick?: () => void;
  /** Shows the event log button in the phone controls when given. */
  onEventsClick?: () => void;
  /** Shows the hand button in the desktop rail when given. */
  onDesktopCardsClick?: () => void;
  /** Shows the event log button in the desktop rail when given. */
  onDesktopEventsClick?: () => void;
  onTryDecalsClick?: () => void;
}) {
  return (
    <>
      <Box visibleFrom="sm" style={{ display: "contents" }}>
        <DesktopTabsControls
          showSearch={showSearch}
          onCardsClick={onDesktopCardsClick}
          onEventsClick={onDesktopEventsClick}
          onTryDecalsClick={onTryDecalsClick}
        />
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
