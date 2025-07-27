import { useEffect } from "react";

interface KeyboardShortcutsProps {
  playerData: any[];
  toggleOverlays: () => void;
  toggleTechSkipsMode: () => void;
  toggleDistanceMode: () => void;
  togglePdsMode: () => void;
  toggleLeftPanelCollapsed: () => void;
  toggleRightPanelCollapsed: () => void;
  isLeftPanelCollapsed: boolean;
  isRightPanelCollapsed: boolean;
  updateSettings: (updates: any) => void;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  onAreaSelect: (area: any) => void;
  selectedArea: any;
}

export function useKeyboardShortcuts({
  playerData,
  toggleOverlays,
  toggleTechSkipsMode,
  toggleDistanceMode,
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
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      // Don't trigger shortcuts if user is typing in an input/textarea
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement ||
        (event.target as HTMLElement)?.contentEditable === "true"
      ) {
        return;
      }

      // Don't trigger if any modifier keys are pressed (except Shift for uppercase)
      if (event.ctrlKey || event.metaKey || event.altKey) {
        return;
      }

      switch (event.key) {
        case "h":
          event.preventDefault();
          // Smart toggle: if both panels are open, close both; if both closed, open both; if mixed, force both closed
          const bothOpen = !isLeftPanelCollapsed && !isRightPanelCollapsed;
          const bothClosed = isLeftPanelCollapsed && isRightPanelCollapsed;

          if (bothOpen) {
            // Both are open, close both
            updateSettings({
              isLeftPanelCollapsed: true,
              isRightPanelCollapsed: true,
            });
          } else if (bothClosed) {
            // Both are closed, open both
            updateSettings({
              isLeftPanelCollapsed: false,
              isRightPanelCollapsed: false,
            });
          } else {
            // Mixed state, force both closed
            updateSettings({
              isLeftPanelCollapsed: true,
              isRightPanelCollapsed: true,
            });
          }
          break;

        case "l":
          event.preventDefault();
          toggleLeftPanelCollapsed();
          break;

        case "r":
          event.preventDefault();
          toggleRightPanelCollapsed();
          break;

        case "+":
        case "=": // Also handle = key since + requires shift
          event.preventDefault();
          handleZoomIn();
          break;

        case "-":
          event.preventDefault();
          handleZoomOut();
          break;

        case "u":
          event.preventDefault();
          toggleDistanceMode();
          break;

        case "t":
          event.preventDefault();
          toggleTechSkipsMode();
          break;

        case "p":
          event.preventDefault();
          togglePdsMode();
          break;

        case "o":
          event.preventDefault();
          toggleOverlays();
          break;

        case "T":
          event.preventDefault();
          // Toggle tech tab
          const isTechSelected = selectedArea?.type === "tech";
          onAreaSelect(isTechSelected ? null : { type: "tech" });
          break;

        case "H":
          event.preventDefault();
          // Toggle hand/components tab
          const isHandSelected = selectedArea?.type === "components";
          onAreaSelect(isHandSelected ? null : { type: "components" });
          break;

        case "S":
          event.preventDefault();
          // Toggle strength tab
          const isStrengthSelected = selectedArea?.type === "strength";
          onAreaSelect(isStrengthSelected ? null : { type: "strength" });
          break;

        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
          event.preventDefault();
          const factionIndex = parseInt(event.key) - 1;
          if (playerData && factionIndex < playerData.length) {
            const faction = playerData[factionIndex].faction;
            const isFactionSelected =
              selectedArea?.type === "faction" &&
              selectedArea.faction === faction;
            onAreaSelect(
              isFactionSelected
                ? null
                : {
                    type: "faction",
                    faction,
                    coords: { x: 0, y: 0 },
                  }
            );
          }
          break;

        default:
          break;
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [
    playerData,
    toggleOverlays,
    toggleTechSkipsMode,
    toggleDistanceMode,
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
