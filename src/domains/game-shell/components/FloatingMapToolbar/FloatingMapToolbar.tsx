import { useEffect, useId, useState } from "react";
import { useParams } from "react-router-dom";
import {
  ActionIcon,
  Box,
  CloseButton,
  Group,
  Text,
  Tooltip,
  Transition,
} from "@mantine/core";
import { IconAdjustments, IconHourglassHigh } from "@tabler/icons-react";
import { GameStatePanel } from "@/domains/game-shell/components/GameStatePanel";
import { useGameState } from "@/hooks/useGameState";
import classes from "./FloatingMapToolbar.module.css";

type FloatingPanel = "gameState" | "tools";

type Props = {
  rightOffset: string;
  isDragging?: boolean;
};

const panels: Record<FloatingPanel, { title: string; label: string }> = {
  gameState: { title: "Game State", label: "Game state" },
  tools: { title: "Tools", label: "Tools" },
};

function PanelContent({ panel }: { panel: FloatingPanel }) {
  const params = useParams<{ mapid: string }>();
  const gameId = params.mapid ?? "";
  const { data: gameState } = useGameState(gameId);

  if (panel === "gameState") {
    if (!gameState?.phase || gameState.phase === "unknown") {
      return (
        <Text size="sm" c="dimmed">
          No live game state available for this game.
        </Text>
      );
    }

    return <GameStatePanel />;
  }

  return (
    <Text size="sm" c="dimmed">
      Coming soon
    </Text>
  );
}

export function FloatingMapToolbar({ rightOffset, isDragging = false }: Props) {
  const [openPanel, setOpenPanel] = useState<FloatingPanel | null>(null);
  const [renderedPanel, setRenderedPanel] = useState<FloatingPanel>("gameState");
  const panelId = useId();

  const togglePanel = (panel: FloatingPanel) => {
    setRenderedPanel(panel);
    setOpenPanel((current) => (current === panel ? null : panel));
  };

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

  return (
    <>
      <Box
        className={`${classes.toolbar} ${transitionClassName ?? ""}`}
        style={{ right: rightOffset }}
      >
        <Tooltip label={panels.gameState.label} position="left" withArrow>
          <ActionIcon
            aria-label={panels.gameState.label}
            aria-controls={panelId}
            aria-expanded={openPanel === "gameState"}
            radius="xl"
            variant="subtle"
            className={`${classes.button} ${
              openPanel === "gameState" ? classes.buttonActive : ""
            }`}
            onClick={() => togglePanel("gameState")}
          >
            <IconHourglassHigh size={22} stroke={1.8} />
          </ActionIcon>
        </Tooltip>

        <Tooltip label={panels.tools.label} position="left" withArrow>
          <ActionIcon
            aria-label={panels.tools.label}
            aria-controls={panelId}
            aria-expanded={openPanel === "tools"}
            radius="xl"
            variant="subtle"
            className={`${classes.button} ${
              openPanel === "tools" ? classes.buttonActive : ""
            }`}
            onClick={() => togglePanel("tools")}
          >
            <IconAdjustments size={22} stroke={1.8} />
          </ActionIcon>
        </Tooltip>
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
              right: `calc(${rightOffset} + 52px)`,
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
              <CloseButton
                aria-label="Close panel"
                size="sm"
                c="gray.4"
                onClick={() => setOpenPanel(null)}
              />
            </Group>

            <Box className={classes.panelBody}>
              <PanelContent panel={renderedPanel} />
            </Box>
          </Box>
        )}
      </Transition>
    </>
  );
}
