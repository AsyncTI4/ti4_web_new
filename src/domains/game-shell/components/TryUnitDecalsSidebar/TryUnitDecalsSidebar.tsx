import { useState } from "react";
import { Box, ActionIcon, Text, SegmentedControl } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { FactionTabBar } from "@/domains/game-shell/components/navigation/FactionTabBar";
import { useGameData, useDecalOverrides, useColorOverrides } from "@/state/useGameContext";
import { useTabsAndTooltips } from "@/hooks/useTabsAndTooltips";
import { getColorAlias, findColorData } from "@/entities/lookup/colors";
import { DiscordCommands } from "./parts/DiscordCommands";
import { DecalGrid } from "./parts/DecalGrid";
import { ColorGrid } from "./parts/ColorGrid";
import classes from "./TryUnitDecalsSidebar.module.css";

type Props = {
  opened: boolean;
  onClose: () => void;
};

export function TryUnitDecalsSidebar({ opened, onClose }: Props) {
  const gameData = useGameData();
  const { decalOverrides, setDecalOverride } = useDecalOverrides();
  const { colorOverrides, setColorOverride } = useColorOverrides();
  const {
    selectedArea,
    activeArea,
    handleAreaSelect,
    handleAreaMouseEnter,
    handleAreaMouseLeave,
  } = useTabsAndTooltips();

  const [mode, setMode] = useState<"decals" | "colors">("decals");

  const playerData = gameData?.playerData ?? [];
  const selectedFaction =
    selectedArea?.type === "faction" ? selectedArea.faction : null;

  const selectedPlayer = playerData.find((p) => p.faction === selectedFaction);
  const playerColor = selectedFaction
    ? gameData?.factionColorMap?.[selectedFaction]?.color
    : undefined;
  const decalOverride = selectedFaction
    ? decalOverrides[selectedFaction]
    : undefined;
  const colorOverride = selectedFaction
    ? colorOverrides[selectedFaction]
    : undefined;

  const activeDecalId = decalOverride ?? selectedPlayer?.decalId ?? null;
  const activeColorAlias =
    colorOverride ?? (playerColor ? getColorAlias(playerColor) : null);
  const colorData = activeColorAlias ? findColorData(activeColorAlias) : null;
  const colorName = colorData?.name || colorData?.displayName || null;

  /** Clicking the active choice clears the override; anything else overrides. */
  const handleDecalClick = (decalId: string) => {
    if (!selectedFaction) return;
    if (activeDecalId !== decalId) {
      setDecalOverride(selectedFaction, decalId);
      return;
    }
    if (decalOverride !== undefined) setDecalOverride(selectedFaction, null);
  };

  const handleColorClick = (colorAlias: string) => {
    if (!selectedFaction) return;
    if (activeColorAlias !== colorAlias) {
      setColorOverride(selectedFaction, colorAlias);
      return;
    }
    if (colorOverride !== undefined) setColorOverride(selectedFaction, null);
  };

  return (
    <Box
      className={`${classes.sidebar} ${opened ? classes.opened : ""}`}
    >
      <Box
        display="flex"
        className={classes.section}
        style={{ alignItems: "center", justifyContent: "space-between" }}
        p="md"
      >
        <Text size="lg" fw={600} c="gray.0">
          Try Unit Decals & Colors
        </Text>
        <ActionIcon variant="subtle" size="lg" onClick={onClose} c="gray.4">
          <IconX size={20} />
        </ActionIcon>
      </Box>

      {playerData.length > 0 && (
        <Box className={classes.section}>
          <FactionTabBar
            playerData={playerData}
            selectedArea={selectedArea}
            activeArea={activeArea}
            onAreaSelect={handleAreaSelect}
            onAreaMouseEnter={handleAreaMouseEnter}
            onAreaMouseLeave={handleAreaMouseLeave}
          />
        </Box>
      )}

      {selectedFaction && (
        <DiscordCommands colorName={colorName} decalId={activeDecalId} />
      )}

      <Box py="sm" px="md" className={classes.section}>
        <SegmentedControl
          value={mode}
          onChange={(value) => setMode(value as "decals" | "colors")}
          data={[
            { label: "Decals", value: "decals" },
            { label: "Colors", value: "colors" },
          ]}
          fullWidth
        />
      </Box>

      <Box style={{ flex: 1, overflowY: "auto" }} p="md">
        {selectedFaction ? (
          mode === "decals" ? (
            <DecalGrid
              activeDecalId={activeDecalId}
              onDecalClick={handleDecalClick}
            />
          ) : (
            <ColorGrid
              activeColorAlias={activeColorAlias}
              onColorClick={handleColorClick}
            />
          )
        ) : (
          <Box
            display="flex"
            style={{ alignItems: "center", justifyContent: "center" }}
            h={200}
          >
            <Text c="dimmed">
              Select a faction to preview {mode}
            </Text>
          </Box>
        )}
      </Box>
    </Box>
  );
}

