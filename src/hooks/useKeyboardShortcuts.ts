import { useEffect } from "react";
import { useGameData } from "@/state/useGameContext";
import type { AreaType } from "@/hooks/useTabsAndTooltips";
import type { Settings } from "@/state/appStore";

export type KeyboardShortcutsProps = {
  toggleOverlays: () => void;
  toggleTechSkipsMode: () => void;
  toggleAttachmentsMode: () => void;
  togglePlanetTypesMode: () => void;
  togglePdsMode: () => void;
  toggleLeftPanelCollapsed: () => void;
  toggleRightPanelCollapsed: () => void;
  isLeftPanelCollapsed: boolean;
  isRightPanelCollapsed: boolean;
  updateSettings: (updates: Partial<Settings>) => void;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  onAreaSelect: (area: AreaType) => void;
  selectedArea: AreaType;
};

function isTypingTarget(target: EventTarget | null) {
  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement ||
    (target instanceof HTMLElement && target.contentEditable === "true")
  );
}

export function useKeyboardShortcuts({
  toggleOverlays,
  toggleTechSkipsMode,
  toggleAttachmentsMode,
  togglePlanetTypesMode,
  togglePdsMode,
  toggleLeftPanelCollapsed,
  toggleRightPanelCollapsed,
  isLeftPanelCollapsed,
  isRightPanelCollapsed,
  updateSettings,
  handleZoomIn,
  handleZoomOut,
  onAreaSelect,
  selectedArea,
}: KeyboardShortcutsProps) {
  const enhancedData = useGameData();
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (isTypingTarget(event.target)) return;
      if (event.ctrlKey || event.metaKey || event.altKey) return;

      const factionIndex = Number(event.key) - 1;
      if (
        Number.isInteger(factionIndex) &&
        factionIndex >= 0 &&
        factionIndex < 8
      ) {
        event.preventDefault();
        selectFactionAt(factionIndex);
        return;
      }

      const action = keyActions[event.key];
      if (!action) return;
      event.preventDefault();
      action();
    }

    function selectFactionAt(index: number) {
      const faction = enhancedData?.playerData?.[index]?.faction;
      if (!faction) return;
      const isFactionSelected =
        selectedArea?.type === "faction" && selectedArea.faction === faction;
      onAreaSelect(
        isFactionSelected
          ? null
          : { type: "faction", faction, coords: { x: 0, y: 0 } },
      );
    }

    /* "h" closes both panels unless both are already closed, in which case it opens both. */
    function toggleBothPanels() {
      const collapse = !(isLeftPanelCollapsed && isRightPanelCollapsed);
      updateSettings({
        leftPanelCollapsed: collapse,
        rightPanelCollapsed: collapse,
      });
    }

    const keyActions: Record<string, () => void> = {
      h: toggleBothPanels,
      l: toggleLeftPanelCollapsed,
      r: toggleRightPanelCollapsed,
      "+": handleZoomIn,
      "=": handleZoomIn,
      "-": handleZoomOut,
      t: toggleTechSkipsMode,
      a: toggleAttachmentsMode,
      y: togglePlanetTypesMode,
      p: togglePdsMode,
      o: toggleOverlays,
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [
    enhancedData?.playerData,
    toggleOverlays,
    toggleTechSkipsMode,
    toggleAttachmentsMode,
    togglePlanetTypesMode,
    togglePdsMode,
    toggleLeftPanelCollapsed,
    toggleRightPanelCollapsed,
    isLeftPanelCollapsed,
    isRightPanelCollapsed,
    updateSettings,
    handleZoomIn,
    handleZoomOut,
    onAreaSelect,
    selectedArea,
  ]);
}
