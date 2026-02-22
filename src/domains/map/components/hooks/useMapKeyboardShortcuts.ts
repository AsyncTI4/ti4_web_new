import { useKeyboardShortcuts, type KeyboardShortcutsProps } from "@/hooks/useKeyboardShortcuts";
import type { SettingsStore } from "@/utils/appStore";

// Centralizes the shared keyboard shortcut wiring used by both map layouts.
type ShortcutHandlers = Pick<
  SettingsStore["handlers"],
  | "toggleOverlays"
  | "toggleTechSkipsMode"
  | "togglePlanetTypesMode"
  | "toggleDistanceMode"
  | "togglePdsMode"
  | "toggleLeftPanelCollapsed"
  | "toggleRightPanelCollapsed"
  | "updateSettings"
>;

type ShortcutSettings = Pick<
  SettingsStore["settings"],
  "leftPanelCollapsed" | "rightPanelCollapsed"
>;

type UseMapKeyboardShortcutsParams = {
  handlers: ShortcutHandlers;
  settings: ShortcutSettings;
  handleZoomIn: KeyboardShortcutsProps["handleZoomIn"];
  handleZoomOut: KeyboardShortcutsProps["handleZoomOut"];
  handleAreaSelect: KeyboardShortcutsProps["onAreaSelect"];
  selectedArea: KeyboardShortcutsProps["selectedArea"];
};

export function useMapKeyboardShortcuts({
  handlers,
  settings,
  handleZoomIn,
  handleZoomOut,
  handleAreaSelect,
  selectedArea,
}: UseMapKeyboardShortcutsParams) {
  useKeyboardShortcuts({
    toggleOverlays: handlers.toggleOverlays,
    toggleTechSkipsMode: handlers.toggleTechSkipsMode,
    togglePlanetTypesMode: handlers.togglePlanetTypesMode,
    toggleDistanceMode: handlers.toggleDistanceMode,
    togglePdsMode: handlers.togglePdsMode,
    toggleLeftPanelCollapsed: handlers.toggleLeftPanelCollapsed,
    toggleRightPanelCollapsed: handlers.toggleRightPanelCollapsed,
    isLeftPanelCollapsed: settings.leftPanelCollapsed,
    isRightPanelCollapsed: settings.rightPanelCollapsed,
    updateSettings: handlers.updateSettings,
    handleZoomIn,
    handleZoomOut,
    onAreaSelect: handleAreaSelect,
    selectedArea,
  });
}
