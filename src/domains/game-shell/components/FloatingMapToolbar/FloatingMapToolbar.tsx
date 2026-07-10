import { type ReactNode, useEffect, useId, useState } from "react";
import {
  ActionIcon,
  Box,
  CloseButton,
  Group,
  Switch,
  Text,
  Tooltip,
  Transition,
} from "@mantine/core";
import { IconCards, IconHistory } from "@tabler/icons-react";
import { GameEventPanel } from "@/domains/game-shell/components/GameEventPanel";
import { useSettingsStore } from "@/utils/appStore";
import classes from "./FloatingMapToolbar.module.css";

type FloatingPanel = "events" | "cards";

type Props = {
  rightOffset: string;
  isDragging?: boolean;
  cardsPanel?: ReactNode;
};

const panels: Record<FloatingPanel, { title: string; label: string }> = {
  events: { title: "Event Log", label: "Events" },
  cards: { title: "Your Cards", label: "Cards" },
};

const panelTopByType: Record<FloatingPanel, string> = {
  events: "163px",
  cards: "215px",
};

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

  const togglePanel = (panel: FloatingPanel) => {
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
