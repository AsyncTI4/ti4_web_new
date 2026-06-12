import {
  Stack,
  Switch,
  Text,
  Divider,
  SegmentedControl,
  Tabs,
} from "@mantine/core";
import { useSettingsStore } from "@/utils/appStore";
import { isMobileDevice } from "@/utils/isTouchDevice";
import { AppModal } from "@/shared/ui/AppModal";

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
            <Switch
              checked={settings.showPlayerAreaCommandTokens}
              onChange={(event) =>
                handlers.updateSettings({
                  showPlayerAreaCommandTokens: event.currentTarget.checked,
                })
              }
              size="sm"
              label="Command Tokens"
              description="Show tactical, fleet, and strategy command token counts."
            />
            <Switch
              checked={settings.showPlayerAreaArmyStrength}
              onChange={(event) =>
                handlers.updateSettings({
                  showPlayerAreaArmyStrength: event.currentTarget.checked,
                })
              }
              size="sm"
              label="Army Strength"
              description="Show the ground and space strength summary."
            />
            <Switch
              checked={settings.showPlayerAreaUnitUpgrades}
              onChange={(event) =>
                handlers.updateSettings({
                  showPlayerAreaUnitUpgrades: event.currentTarget.checked,
                })
              }
              size="sm"
              label="Unit Upgrades"
              description="Show upgraded-unit styling and upgrade faction badges."
            />
            <Switch
              checked={settings.showPlayerAreaTotalSpend}
              onChange={(event) =>
                handlers.updateSettings({
                  showPlayerAreaTotalSpend: event.currentTarget.checked,
                })
              }
              size="sm"
              label="Total Spend"
              description="Show the literal total resource and influence spend column. Optimal spend stays visible."
            />
            <Switch
              checked={settings.showPlayerAreaReinforcements}
              onChange={(event) =>
                handlers.updateSettings({
                  showPlayerAreaReinforcements: event.currentTarget.checked,
                })
              }
              size="sm"
              label="Reinforcements"
              description="Show faction reinforcement tokens near planet cards, including sleepers, wormholes, breach, and galvanize tokens."
            />
            <Switch
              checked={settings.showPlayerAreaFactionAbilities}
              onChange={(event) =>
                handlers.updateSettings({
                  showPlayerAreaFactionAbilities: event.currentTarget.checked,
                })
              }
              size="sm"
              label="Faction Abilities"
              description="Show faction abilities, faction tech, and related custom notes."
            />
            <Switch
              checked={settings.showPlayerAreaNeighborship}
              onChange={(event) =>
                handlers.updateSettings({
                  showPlayerAreaNeighborship: event.currentTarget.checked,
                })
              }
              size="sm"
              label="Neighborship"
              description="Show neighbor faction icons."
            />
          </Stack>
        </Tabs.Panel>
      </Tabs>
    </AppModal>
  );
}
