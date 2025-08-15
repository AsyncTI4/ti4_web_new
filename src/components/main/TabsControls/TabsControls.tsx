import { Box, Button, Switch } from "@mantine/core";
import {
  IconFlask,
  IconRuler2,
  IconKeyboard,
  IconSettings,
  IconEye,
} from "@tabler/icons-react";
import { useGameData } from "@/hooks/useGameContext";
import { useSettingsStore } from "@/utils/appStore";

export function TabsControls() {
  const game = useGameData();
  const settings = useSettingsStore((state) => state.settings);
  const handlers = useSettingsStore((state) => state.handlers);

  return (
    <>
      <Button
        variant={settings.techSkipsMode ? "filled" : "subtle"}
        size="sm"
        color={settings.techSkipsMode ? "cyan" : "gray"}
        style={{ height: "36px", minWidth: "36px" }}
        px={8}
        onClick={handlers.toggleTechSkipsMode}
      >
        <IconFlask size={16} />
      </Button>
      <Button
        variant={settings.distanceMode ? "filled" : "subtle"}
        size="sm"
        color={settings.distanceMode ? "orange" : "gray"}
        style={{ height: "36px", minWidth: "36px" }}
        px={8}
        onClick={handlers.toggleDistanceMode}
      >
        <IconRuler2 size={16} />
      </Button>
      {game?.tilesWithPds && game.tilesWithPds.size > 0 && (
        <Button
          variant={settings.showPDSLayer ? "filled" : "subtle"}
          size="sm"
          color={settings.showPDSLayer ? "blue" : "gray"}
          style={{ height: "36px", minWidth: "36px" }}
          px={8}
          onClick={handlers.togglePdsMode}
        >
          PDS
        </Button>
      )}
      <Button
        variant="subtle"
        size="sm"
        color="gray"
        style={{ height: "36px", minWidth: "36px" }}
        px={8}
        onClick={() => handlers.setKeyboardShortcutsModalOpened(true)}
      >
        <IconKeyboard size={16} />
      </Button>
      <Box
        style={{
          borderLeft: "1px solid var(--mantine-color-dark-4)",
          height: "24px",
          marginLeft: "12px",
          marginRight: "12px",
        }}
      />
      <Switch
        checked={settings.overlaysEnabled}
        onChange={handlers.toggleOverlays}
        size="sm"
        thumbIcon={
          settings.overlaysEnabled ? (
            <IconEye size={12} />
          ) : (
            <IconEye size={12} style={{ opacity: 0.5 }} />
          )
        }
        label="Overlays"
        labelPosition="right"
      />
      <Box
        style={{
          borderLeft: "1px solid var(--mantine-color-dark-4)",
          height: "24px",
          marginLeft: "12px",
          marginRight: "12px",
        }}
      />
      <Button
        variant="light"
        size="sm"
        color="gray"
        style={{ height: "36px", minWidth: "36px" }}
        px={8}
        onClick={() => handlers.setSettingsModalOpened(true)}
      >
        <IconSettings size={16} />
      </Button>
    </>
  );
}
