import React, { useState } from "react";
import { Box, ActionIcon, Text, SegmentedControl } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { FactionTabBar } from "@/domains/game-shell/components/navigation/FactionTabBar";
import { useGameData, useDecalOverrides, useColorOverrides } from "@/hooks/useGameContext";
import { useTabsAndTooltips } from "@/hooks/useTabsAndTooltips";
import { getColorAlias, findColorData } from "@/entities/lookup/colors";
import { DiscordCommands } from "./TryUnitDecalsSidebar/DiscordCommands";
import { DecalGrid } from "./TryUnitDecalsSidebar/DecalGrid";
import { ColorGrid } from "./TryUnitDecalsSidebar/ColorGrid";
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

  const handleDecalClick = (decalId: string) => {
    if (!selectedFaction) return;
    const currentOverride = decalOverrides[selectedFaction];
    const playerDecalId = gameData?.playerData.find(
      (p) => p.faction === selectedFaction
    )?.decalId;

    // Determine what decal is currently active (override takes precedence)
    const activeDecalId = currentOverride !== undefined ? currentOverride : playerDecalId;

    if (activeDecalId === decalId) {
      // If clicking the currently active decal, clear the override (if any)
      if (currentOverride !== undefined) {
        setDecalOverride(selectedFaction, null);
      }
      // If there's no override and it matches the player's original, do nothing
    } else {
      // Set the new override
      setDecalOverride(selectedFaction, decalId);
    }
  };

  const handleColorClick = (colorAlias: string) => {
    if (!selectedFaction) return;
    const currentOverride = colorOverrides[selectedFaction];
    const factionColorMap = gameData?.factionColorMap;
    const playerColor = factionColorMap?.[selectedFaction]?.color;
    const playerColorAlias = playerColor ? getColorAlias(playerColor) : null;

    // Determine what color is currently active (override takes precedence)
    const activeColorAlias = currentOverride !== undefined ? currentOverride : playerColorAlias;

    if (activeColorAlias === colorAlias) {
      // If clicking the currently active color, clear the override (if any)
      if (currentOverride !== undefined) {
        setColorOverride(selectedFaction, null);
      }
      // If there's no override and it matches the player's original, do nothing
    } else {
      // Set the new override
      setColorOverride(selectedFaction, colorAlias);
    }
  };

  // Get current active decal and color for the selected faction
  const getActiveDecal = () => {
    if (!selectedFaction) return null;
    const overrideDecalId = decalOverrides[selectedFaction];
    const playerDecalId = gameData?.playerData.find(
      (p) => p.faction === selectedFaction
    )?.decalId;
    return overrideDecalId !== undefined ? overrideDecalId : playerDecalId || null;
  };

  const getActiveColor = () => {
    if (!selectedFaction) return null;
    const overrideColorAlias = colorOverrides[selectedFaction];
    const factionColorMap = gameData?.factionColorMap;
    const playerColor = factionColorMap?.[selectedFaction]?.color;
    const playerColorAlias = playerColor ? getColorAlias(playerColor) : null;
    return overrideColorAlias !== undefined ? overrideColorAlias : playerColorAlias;
  };

  const activeDecalId = getActiveDecal();
  const activeColorAlias = getActiveColor();
  const colorData = activeColorAlias ? findColorData(activeColorAlias) : null;
  const colorName = colorData?.name || colorData?.displayName || null;

  const selectedPlayer = gameData?.playerData.find(
    (p) => p.faction === selectedFaction
  );
  const playerDecalId = selectedPlayer?.decalId;
  const factionColorMap = gameData?.factionColorMap;
  const playerColor = selectedFaction
    ? factionColorMap?.[selectedFaction]?.color
    : undefined;
  const playerColorAlias = playerColor ? getColorAlias(playerColor) : null;

  return (
    <Box
      className={`${classes.sidebar} ${opened ? classes.opened : classes.closed}`}
    >
      <Box
        display="flex"
        style={{ alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--mantine-color-dark-4)" }}
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
        <Box style={{ borderBottom: "1px solid var(--mantine-color-dark-4)" }}>
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

      <Box py="sm" px="md" style={{ borderBottom: "1px solid var(--mantine-color-dark-4)" }}>
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
              selectedFaction={selectedFaction}
              decalOverrides={decalOverrides}
              playerDecalId={playerDecalId}
              onDecalClick={handleDecalClick}
            />
          ) : (
            <ColorGrid
              selectedFaction={selectedFaction}
              colorOverrides={colorOverrides}
              playerColorAlias={playerColorAlias}
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
              Select a faction to preview {mode === "decals" ? "decals" : "colors"}
            </Text>
          </Box>
        )}
      </Box>
    </Box>
  );
}

