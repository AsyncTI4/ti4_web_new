import {
  Modal,
  Stack,
  Switch,
  Text,
  Divider,
  SegmentedControl,
} from "@mantine/core";
import { useSettingsStore } from "../../utils/appStore";

type SettingsModalProps = {
  opened: boolean;
  onClose: () => void;
};

export function SettingsModal({ opened, onClose }: SettingsModalProps) {
  const settings = useSettingsStore((state) => state.settings);
  const handlers = useSettingsStore((state) => state.handlers);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Settings"
      size="md"
      centered
      // Hardcoded to match --z-settings-modal; see src/utils/zIndexVariables.css
      zIndex={3500}
    >
      <Stack gap="md">
        <div>
          <Text size="sm" fw={500} mb="xs">
            Map Display
          </Text>
          <Stack gap="sm">
            <Switch
              checked={settings.overlaysEnabled}
              onChange={handlers.toggleOverlays}
              size="sm"
              label="Show Overlays"
              description="Show ownership color overlays on the map"
            />
            <Switch
              checked={settings.showControlTokens}
              onChange={handlers.toggleAlwaysShowControlTokens}
              size="sm"
              label="Always Show Control Tokens"
              description="When off, control tokens are only shown on planets with no units"
            />
            <Switch
              checked={settings.showExhaustedPlanets}
              onChange={handlers.toggleShowExhaustedPlanets}
              size="sm"
              label="Show Planets as Exhausted"
              description="When off, exhausted planets won't be greyed out on the map"
            />
            <Switch
              checked={settings.accessibleColors}
              onChange={handlers.toggleAccessibleColors}
              size="sm"
              label="Accessible Colors"
              description="Use a simplified color palette (blue, green, purple, yellow, red, pink, black, lightgray) in order. Extra players keep their original colors."
            />
          </Stack>
        </div>

        <Divider />

        <div>
          <Text size="sm" fw={500} mb="xs">
            Map View Style
          </Text>
          <Stack gap="xs">
            <SegmentedControl
              value={settings.mapViewPreference || "panels"}
              onChange={(value) =>
                handlers.setMapViewPreference(value as "panels" | "pannable")
              }
              data={[
                { label: "Panels", value: "panels" },
                { label: "Pannable", value: "pannable" },
              ]}
              fullWidth
            />
            <Text size="xs" c="dimmed">
              Panels: Left and right side panel to see content and map at same
              time. Pannable: Full-screen draggable map.
            </Text>
          </Stack>
        </div>

        <Divider />

        <div>
          <Text size="sm" fw={500} mb="xs">
            Interface
          </Text>
          <Stack gap="sm">
            <Switch
              checked={settings.leftPanelCollapsed}
              onChange={handlers.toggleLeftPanelCollapsed}
              size="sm"
              label="Collapse Left Panel"
              description="Hide the objectives and laws panel on the left side of the map"
            />
            <Switch
              checked={settings.rightPanelCollapsed}
              onChange={handlers.toggleRightPanelCollapsed}
              size="sm"
              label="Collapse Right Panel"
              description="Hide the player cards panel on the right side of the map"
            />
          </Stack>
        </div>
      </Stack>
    </Modal>
  );
}
