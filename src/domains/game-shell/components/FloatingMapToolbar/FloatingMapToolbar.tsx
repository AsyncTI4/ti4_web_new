import { type ReactNode, useEffect, useId, useState } from "react";
import {
  ActionIcon,
  Box,
  Button,
  CloseButton,
  Group,
  Switch,
  Text,
  Tooltip,
  Transition,
} from "@mantine/core";
import { IconCards, IconEyeOff, IconHistory } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { GameEventPanel } from "@/domains/game-shell/components/GameEventPanel";
import { useSettingsStore } from "@/utils/appStore";
import { useGameData } from "@/hooks/useGameContext";
import { useFowViewStore } from "@/utils/fowViewStore";
import { CircularFactionIcon } from "@/shared/ui/CircularFactionIcon/CircularFactionIcon";
import type { PlayerDataResponse } from "@/entities/data/types";
import classes from "./FloatingMapToolbar.module.css";

type FloatingPanel = "events" | "cards" | "fow";

type Props = {
  rightOffset: string;
  isDragging?: boolean;
  cardsPanel?: ReactNode;
};

const panels: Record<FloatingPanel, { title: string; label: string }> = {
  events: { title: "Event Log", label: "Events" },
  cards: { title: "Your Cards", label: "Cards" },
  fow: { title: "Show Game As", label: "Fog of War" },
};

const panelTopByType: Record<FloatingPanel, string> = {
  events: "163px",
  cards: "215px",
  fow: "267px",
};

function FowViewPanel() {
  const gameData = useGameData();
  const queryClient = useQueryClient();
  const viewAsPlayerId = useFowViewStore((state) => state.viewAsPlayerId);
  const setViewAsPlayer = useFowViewStore((state) => state.setViewAsPlayer);
  // The GM's full (unfiltered) view is cached separately per viewAsPlayerId (see usePlayerData's
  // query key). Read it directly so the picker always lists every player, even while previewing
  // someone else's fogged view (whose own playerData only contains players *they* can identify).
  const fullViewData = gameData?.gameName
    ? queryClient.getQueryData<PlayerDataResponse>([
        "playerData",
        gameData.gameName,
        null,
      ])
    : undefined;
  const players = fullViewData?.playerData ?? gameData?.playerData ?? [];

  return (
    <Group gap={6} wrap="wrap">
      <Button
        size="xs"
        variant={viewAsPlayerId === null ? "filled" : "default"}
        onClick={() => setViewAsPlayer(null)}
      >
        Full (GM)
      </Button>
      {players.map((player) => (
        <Button
          key={player.discordId}
          size="xs"
          variant={viewAsPlayerId === player.discordId ? "filled" : "default"}
          onClick={() => setViewAsPlayer(player.discordId)}
          leftSection={
            <CircularFactionIcon
              faction={player.faction}
              size={16}
              factionImageOverride={player.factionImage}
              factionImageTypeOverride={player.factionImageType}
            />
          }
        >
          {player.userName || player.faction}
        </Button>
      ))}
    </Group>
  );
}

export function FloatingMapToolbar({
  rightOffset,
  isDragging = false,
  cardsPanel,
}: Props) {
  const [openPanel, setOpenPanel] = useState<FloatingPanel | null>(null);
  const animateEventPreviews = useSettingsStore(
    (state) => state.settings.animateEventPreviews,
  );
  const updateSettings = useSettingsStore((state) => state.updateSettings);
  const panelId = useId();
  const gameData = useGameData();
  const viewAsPlayerId = useFowViewStore((state) => state.viewAsPlayerId);
  const setViewAsPlayer = useFowViewStore((state) => state.setViewAsPlayer);
  const showFowButton = Boolean(gameData?.isFowMode && gameData?.viewerIsGm);

  const togglePanel = (panel: FloatingPanel) => {
    setOpenPanel((current) => (current === panel ? null : panel));
  };

  // The FoW GM-preview panel/selection is per-game - close it and drop any stale "view as"
  // choice when switching games, rather than carrying it (invisibly, for non-FoW games) into
  // wherever the player navigates next.
  useEffect(() => {
    setOpenPanel(null);
    setViewAsPlayer(null);
  }, [gameData?.gameName, setViewAsPlayer]);

  useEffect(() => {
    if (!openPanel) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenPanel(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openPanel]);

  const transitionClassName = isDragging ? classes.noTransition : undefined;
  const renderedPanel = openPanel ?? "events";

  return (
    <>
      <Box
        className={`${classes.toolbar} ${transitionClassName ?? ""}`}
        style={{ right: rightOffset }}
      >
        <Tooltip label={panels.events.label} position="left" withArrow>
          <ActionIcon
            aria-label={panels.events.label}
            aria-controls={panelId}
            aria-expanded={openPanel === "events"}
            radius="xl"
            variant="subtle"
            className={`${classes.button} ${openPanel === "events" ? classes.buttonActive : ""}`}
            onClick={() => togglePanel("events")}
          >
            <IconHistory size={22} stroke={1.8} />
          </ActionIcon>
        </Tooltip>

        {cardsPanel && (
          <Tooltip label={panels.cards.label} position="left" withArrow>
            <ActionIcon
              aria-label={panels.cards.label}
              aria-controls={panelId}
              aria-expanded={openPanel === "cards"}
              radius="xl"
              variant="subtle"
              className={`${classes.button} ${openPanel === "cards" ? classes.buttonActive : ""}`}
              onClick={() => togglePanel("cards")}
            >
              <IconCards size={22} stroke={1.8} />
            </ActionIcon>
          </Tooltip>
        )}

        {showFowButton && (
          <Tooltip label={panels.fow.label} position="left" withArrow>
            <ActionIcon
              aria-label={panels.fow.label}
              aria-controls={panelId}
              aria-expanded={openPanel === "fow"}
              radius="xl"
              variant="subtle"
              className={`${classes.button} ${openPanel === "fow" || viewAsPlayerId !== null ? classes.buttonActive : ""}`}
              onClick={() => togglePanel("fow")}
            >
              <IconEyeOff size={22} stroke={1.8} />
            </ActionIcon>
          </Tooltip>
        )}
      </Box>

      <Transition
        mounted={openPanel !== null}
        transition="slide-left"
        duration={200}
        timingFunction="ease-out"
      >
        {(transitionStyles) => (
          <Box
            id={panelId}
            className={`${classes.panel} ${transitionClassName ?? ""}`}
            style={{
              ...transitionStyles,
              top: panelTopByType[renderedPanel],
              right: `calc(${rightOffset} + 52px)`,
              maxHeight: `calc(100vh - ${panelTopByType[renderedPanel]} - 16px)`,
            }}
          >
            <Group
              justify="space-between"
              align="center"
              wrap="nowrap"
              className={classes.panelHeader}
            >
              <Text size="sm" fw={700} c="gray.1">
                {panels[renderedPanel].title}
              </Text>
              <Group gap={8} wrap="nowrap">
                {renderedPanel === "events" && (
                  <Switch
                    size="xs"
                    label="Animated"
                    checked={animateEventPreviews}
                    onChange={(event) =>
                      updateSettings({
                        animateEventPreviews: event.currentTarget.checked,
                      })
                    }
                    className={classes.animatedSwitch}
                  />
                )}
                <CloseButton
                  aria-label="Close panel"
                  size="sm"
                  c="gray.4"
                  onClick={() => setOpenPanel(null)}
                />
              </Group>
            </Group>

            <Box className={classes.panelBody}>
              {renderedPanel === "cards" ? (
                cardsPanel
              ) : renderedPanel === "fow" ? (
                <FowViewPanel />
              ) : (
                <GameEventPanel animated={animateEventPreviews} />
              )}
            </Box>
          </Box>
        )}
      </Transition>
    </>
  );
}
