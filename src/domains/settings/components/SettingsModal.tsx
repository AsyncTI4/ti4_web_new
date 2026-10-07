import {
  Stack,
  Switch,
  Text,
  Divider,
  SegmentedControl,
  Tabs,
} from "@mantine/core";
import { useSettingsStore } from "@/state/appStore";
import { isMobileDevice } from "@/utils/isTouchDevice";
import { AppModal } from "@/shared/ui/AppModal";
import type { ControlTokenDisplayMode } from "@/entities/game/controlTokenDisplay";

type PlayerAreaToggleKey =
  | "showPlayerAreaCommandTokens"
  | "showPlayerAreaArmyStrength"
  | "showPlayerAreaUnitUpgrades"
  | "showPlayerAreaTotalSpend"
  | "showPlayerAreaReinforcements"
  | "showPlayerAreaFactionAbilities"
  | "showPlayerAreaNeighborship";

const PLAYER_AREA_TOGGLES: { key: PlayerAreaToggleKey; label: string; description: string }[] = [
  {
    key: "showPlayerAreaCommandTokens",
    label: "Command Tokens",
    description: "Show tactical, fleet, and strategy command token counts.",
  },
  {
    key: "showPlayerAreaArmyStrength",
    label: "Army Strength",
    description: "Show the ground and space strength summary.",
  },
  {
    key: "showPlayerAreaUnitUpgrades",
    label: "Unit Upgrades",
    description: "Show upgraded-unit styling and upgrade faction badges.",
  },
  {
    key: "showPlayerAreaTotalSpend",
    label: "Total Spend",
    description: "Show the literal total resource and influence spend column. Optimal spend stays visible.",
  },
  {
    key: "showPlayerAreaReinforcements",
    label: "Reinforcements",
    description: "Show faction reinforcement tokens near planet cards, including sleepers, wormholes, breach, and galvanize tokens.",
  },
  {
    key: "showPlayerAreaFactionAbilities",
    label: "Faction Abilities",
    description: "Show faction abilities, faction tech, and related custom notes.",
  },
  {
    key: "showPlayerAreaNeighborship",
    label: "Neighborship",
    description: "Show neighbor faction icons.",
  },
];

type SettingsModalProps = {
  opened: boolean;
  onClose: () => void;
};

export function SettingsModal({ opened, onClose }: SettingsModalProps) {
  const settings = useSettingsStore((state) => state.settings);
  const handlers = useSettingsStore((state) => state.handlers);

  return (
    <AppModal
      opened={opened}
      onClose={onClose}
      title="Settings"
      size="xl"
      centered
    >
      <Tabs defaultValue="general" variant="pills" radius="md">
        <Tabs.List grow mb="lg">
          <Tabs.Tab value="general" fw={700} py="sm">
            General
          </Tabs.Tab>
          <Tabs.Tab value="player-areas" fw={700} py="sm">
            Player Areas
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="general">
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
                <Stack gap="xs">
                  <Text size="sm">Control Tokens</Text>
                  <SegmentedControl
                    value={settings.controlTokenDisplayMode}
                    onChange={(value) =>
                      handlers.updateSettings({
                        controlTokenDisplayMode:
                          value as ControlTokenDisplayMode,
                      })
                    }
                    data={[
                      { label: "Always On", value: "always" },
                      { label: "On if Ambiguous", value: "ambiguous" },
                      { label: "Off Unless Empty", value: "empty" },
                    ]}
                    fullWidth
                  />
                  <Text size="xs" c="dimmed">
                    Ambiguous planets are empty or contain ground pieces from
                    more than one faction.
                  </Text>
                </Stack>
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

            {!isMobileDevice() && (
              <div>
                <Text size="sm" fw={500} mb="xs">
                  Map View Style
                </Text>
                <Stack gap="xs">
                  <SegmentedControl
                    value={settings.mapViewPreference || "pannable"}
                    onChange={(value) =>
                      handlers.setMapViewPreference(
                        value as "panels" | "pannable"
                      )
                    }
                    data={[
                      { label: "Pannable", value: "pannable" },
                      { label: "Panels", value: "panels" },
                    ]}
                    fullWidth
                  />
                  <Text size="xs" c="dimmed">
                    Pannable: Denser layout for quick cross-comparison. Panels:
                    More breathing room when you want a calmer read.
                  </Text>
                </Stack>
              </div>
            )}

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
        </Tabs.Panel>

        <Tabs.Panel value="player-areas">
          <Stack gap="sm">
            <Text size="sm" c="dimmed">
              Choose which data groups appear in player area cards.
            </Text>
            {PLAYER_AREA_TOGGLES.map(({ key, label, description }) => (
              <Switch
                key={key}
                checked={settings[key]}
                onChange={(event) =>
                  handlers.updateSettings({ [key]: event.currentTarget.checked })
                }
                size="sm"
                label={label}
                description={description}
              />
            ))}
          </Stack>
        </Tabs.Panel>
      </Tabs>
    </AppModal>
  );
}
