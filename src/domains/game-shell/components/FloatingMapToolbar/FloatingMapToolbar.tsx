import { useEffect, useId, useState, type ReactNode } from "react";
import { CloseButton, Switch, Transition } from "@/ds";
import { IconHistory } from "@tabler/icons-react";
import cx from "clsx";
import { GameEventPanel } from "@/domains/game-shell/components/GameEventPanel";
import { useUnreadEventCount } from "@/domains/game-shell/components/GameEventPanel/sinceLastTurn";
import { SecretHand } from "@/domains/game-shell/components/SecretHand";
import { usePlayerHand } from "@/domains/game-shell/components/SecretHand/usePlayerHand";
import { useSecretHandAccess } from "@/domains/game-shell/components/SecretHand/useSecretHandAccess";
import { useSettingsStore } from "@/state/appStore";
import { cdnImage } from "@/entities/data/cdnImage";
import type { PlayerHandData } from "@/shared/types/playerHand";
import classes from "./FloatingMapToolbar.module.css";

type FloatingPanel = "events" | "cards";

type Props = {
  gameId: string;
  rightOffset: string;
  /** Fixed top of the control float. Defaults to just under the tab strip. */
  topOffset?: number;
  isDragging?: boolean;
  /**
   * Renders the map controls float with the events button seated at its end,
   * so zoom and the log share one float. Without it the events button floats
   * on its own.
   */
  renderControls?: (eventsButton: ReactNode) => ReactNode;
};

const CONTROLS_HEIGHT = 36;
const PANEL_GAP = 8;

function EventsButton({
  gameId,
  open,
  panelId,
  onClick,
}: {
  gameId: string;
  open: boolean;
  panelId: string;
  onClick: () => void;
}) {
  const unread = useUnreadEventCount(gameId);
  const label = unread > 0 ? `Events, ${unread} new` : "Events";
  return (
    <button
      type="button"
      className={cx(classes.eventsButton, open && classes.eventsButtonOpen)}
      aria-label={label}
      title={label}
      aria-controls={panelId}
      aria-expanded={open}
      onClick={onClick}
    >
      <IconHistory size={15} />
      {unread > 0 && (
        <span className={classes.badge}>{unread > 99 ? "99+" : unread}</span>
      )}
    </button>
  );
}

const FAN_BACKS = [
  "/cardback/cardback_action.png",
  cdnImage("/player_area/cardback_secret.jpg"),
  cdnImage("/player_area/pa_cardbacks_pn.png"),
];

function handSummary(hand: PlayerHandData | undefined): string {
  if (!hand) return "Your hand";
  const parts = [
    `${hand.actionCards.length} actions`,
    `${hand.secretObjectives.length} secrets`,
    `${hand.promissoryNotes.length} notes`,
  ];
  return parts.join(" · ");
}

/** The hand's entry point: a small fan of real card backs and the counts. */
function HandButton({
  hand,
  open,
  panelId,
  onClick,
  style,
}: {
  hand: PlayerHandData | undefined;
  open: boolean;
  panelId: string;
  onClick: () => void;
  style: React.CSSProperties;
}) {
  return (
    <button
      type="button"
      className={cx(classes.hand, open && classes.handOpen)}
      style={style}
      aria-label="Your cards"
      aria-controls={panelId}
      aria-expanded={open}
      onClick={onClick}
    >
      <span className={classes.fan} aria-hidden="true">
        {FAN_BACKS.map((src, index) => (
          <i
            key={src}
            style={{ backgroundImage: `url("${src}")` }}
            data-i={index}
          />
        ))}
      </span>
      <span className={classes.handText}>
        <b>Your cards</b>
        <small>{handSummary(hand)}</small>
      </span>
    </button>
  );
}

function PanelHeader({
  title,
  children,
  onClose,
}: {
  title: string;
  children?: ReactNode;
  onClose: () => void;
}) {
  return (
    <div className={classes.panelHeader}>
      <h4 className={classes.panelTitle}>{title}</h4>
      <div className={classes.panelHeaderEnd}>
        {children}
        <CloseButton
          aria-label="Close panel"
          size="sm"
          className={classes.close}
          onClick={onClose}
        />
      </div>
    </div>
  );
}

export function FloatingMapToolbar({
  gameId,
  rightOffset,
  topOffset,
  isDragging = false,
  renderControls,
}: Props) {
  const [openPanel, setOpenPanel] = useState<FloatingPanel | null>(null);
  const { canViewSecretHand } = useSecretHandAccess();
  const { data: handData, isLoading, error } = usePlayerHand(gameId);
  const animateEventPreviews = useSettingsStore(
    (state) => state.settings.animateEventPreviews,
  );
  const updateSettings = useSettingsStore((state) => state.updateSettings);
  const panelId = useId();

  const togglePanel = (panel: FloatingPanel) => {
    setOpenPanel((current) => (current === panel ? null : panel));
  };

  useEffect(() => {
    if (!openPanel) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenPanel(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openPanel]);

  useEffect(() => {
    if (canViewSecretHand) return;
    setOpenPanel((current) => (current === "cards" ? null : current));
  }, [canViewSecretHand]);

  const noTransition = isDragging ? classes.noTransition : undefined;
  const controlsTop =
    topOffset !== undefined
      ? `${topOffset}px`
      : "calc(var(--map-viewport-top) + 12px)";
  const eventsTop = `calc(${controlsTop} + ${CONTROLS_HEIGHT + PANEL_GAP}px)`;
  const renderedPanel = openPanel ?? "events";

  const eventsButton = (
    <EventsButton
      gameId={gameId}
      open={openPanel === "events"}
      panelId={panelId}
      onClick={() => togglePanel("events")}
    />
  );

  return (
    <>
      <div
        className={cx(classes.controls, noTransition)}
        style={{ right: rightOffset, top: controlsTop }}
      >
        {renderControls ? (
          renderControls(eventsButton)
        ) : (
          <div className={classes.float}>{eventsButton}</div>
        )}
      </div>

      {canViewSecretHand && (
        <HandButton
          hand={handData}
          open={openPanel === "cards"}
          panelId={panelId}
          onClick={() => togglePanel("cards")}
          style={{ right: rightOffset }}
        />
      )}

      <Transition
        mounted={openPanel !== null}
        transition={renderedPanel === "cards" ? "slide-up" : "slide-left"}
        duration={180}
        timingFunction="ease-out"
      >
        {(transitionStyles) => (
          <div
            id={panelId}
            className={cx(
              classes.panel,
              renderedPanel === "cards"
                ? classes.handPanel
                : classes.eventsPanel,
              noTransition,
            )}
            style={{
              ...transitionStyles,
              right: rightOffset,
              ...(renderedPanel === "events"
                ? {
                    top: eventsTop,
                    maxHeight: `calc(100vh - ${eventsTop} - 16px)`,
                  }
                : {}),
            }}
          >
            {renderedPanel === "cards" ? (
              <>
                <PanelHeader
                  title="Your cards"
                  onClose={() => setOpenPanel(null)}
                />
                <SecretHand
                  handData={handData}
                  isLoading={isLoading}
                  error={error}
                />
              </>
            ) : (
              <>
                <PanelHeader title="Events" onClose={() => setOpenPanel(null)}>
                  <Switch
                    size="xs"
                    label="Animated"
                    checked={animateEventPreviews}
                    onChange={(event) =>
                      updateSettings({
                        animateEventPreviews: event.currentTarget.checked,
                      })
                    }
                    classNames={{ label: classes.switchLabel }}
                  />
                </PanelHeader>
                <div className={classes.panelBody}>
                  <GameEventPanel animated={animateEventPreviews} />
                </div>
              </>
            )}
          </div>
        )}
      </Transition>
    </>
  );
}
