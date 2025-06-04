import { Tabs, Group, Text, Image, Stack } from "@mantine/core";
// @ts-ignore
import InfluenceIcon from "../../InfluenceIcon";
import { cdnImage } from "../../../data/cdnImage";

// Component for the half-yellow, half-blue combined icon
function CombinedResourceInfluenceIcon({ size = 12 }: { size?: number }) {
  const gradientId = `half-yellow-blue-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="50%" stopColor="#eab308" />
          <stop offset="50%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
      <polygon
        points="6,2 18,2 22,12 18,22 6,22 2,12"
        fill="transparent"
        stroke={`url(#${gradientId})`}
        strokeWidth="2"
      />
    </svg>
  );
}

// Helper function to pad single digits with space for alignment and round down decimals
const padNumber = (num: number): string => {
  const rounded = Math.floor(num);
  return rounded < 10 ? ` ${rounded}` : `${rounded}`;
};

type PlanetEconomics = {
  total: {
    currentResources: number;
    totalResources: number;
    currentInfluence: number;
    totalInfluence: number;
  };
  optimal: {
    currentResources: number;
    totalResources: number;
    currentInfluence: number;
    totalInfluence: number;
  };
  flex: {
    currentFlex: number;
    totalFlex: number;
  };
};

type Props = {
  planetEconomics: PlanetEconomics;
};

export function ResourceInfluenceTable({ planetEconomics }: Props) {
  return (
    <Tabs defaultValue="optimal" variant="pills">
      <Stack gap="xs">
        <Tabs.List grow>
          <Tabs.Tab value="total" size="xs" h={20} p={4}>
            <Text size="xs" fw={600}>
              Tot
            </Text>
          </Tabs.Tab>
          <Tabs.Tab value="optimal" size="xs" h={20} p={4}>
            <Text size="xs" fw={600}>
              Opt
            </Text>
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="total" pt={4}>
          <Group gap="xs" wrap="nowrap">
            <Group gap={3} align="center" wrap="nowrap">
              <Image
                src={cdnImage("/player_area/pa_resources.png")}
                width={16}
                height={16}
              />
              <Group gap={3} align="baseline" wrap="nowrap">
                <Text
                  size="md"
                  fw={700}
                  c="yellow.3"
                  ff="mono"
                  style={{
                    textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
                    lineHeight: 1,
                  }}
                >
                  {padNumber(planetEconomics.total.currentResources)}
                </Text>
                <Text
                  size="xs"
                  c="yellow.5"
                  fw={500}
                  ff="mono"
                  style={{ lineHeight: 1 }}
                >
                  / {padNumber(planetEconomics.total.totalResources)}
                </Text>
              </Group>
            </Group>

            <Group gap={3} align="center" wrap="nowrap">
              <InfluenceIcon size={16} />
              <Group gap={3} align="baseline" wrap="nowrap">
                <Text
                  size="md"
                  fw={700}
                  c="blue.3"
                  ff="mono"
                  style={{
                    textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
                    lineHeight: 1,
                  }}
                >
                  {padNumber(planetEconomics.total.currentInfluence)}
                </Text>
                <Text
                  size="xs"
                  c="blue.5"
                  fw={500}
                  ff="mono"
                  style={{ lineHeight: 1 }}
                >
                  / {padNumber(planetEconomics.total.totalInfluence)}
                </Text>
              </Group>
            </Group>
          </Group>
        </Tabs.Panel>

        <Tabs.Panel value="optimal" pt={4}>
          <Stack gap="xs">
            <Group gap="xs" wrap="nowrap">
              <Group gap={3} align="center" wrap="nowrap">
                <Image
                  src={cdnImage("/player_area/pa_resources.png")}
                  width={16}
                  height={16}
                />
                <Group gap={3} align="baseline" wrap="nowrap">
                  <Text
                    size="md"
                    fw={700}
                    c="yellow.3"
                    ff="mono"
                    style={{
                      textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
                      lineHeight: 1,
                    }}
                  >
                    {padNumber(planetEconomics.optimal.currentResources)}
                  </Text>
                  <Text
                    size="xs"
                    c="yellow.5"
                    fw={500}
                    ff="mono"
                    style={{ lineHeight: 1 }}
                  >
                    / {padNumber(planetEconomics.optimal.totalResources)}
                  </Text>
                </Group>
              </Group>

              <Group gap={3} align="center" wrap="nowrap">
                <InfluenceIcon size={16} />
                <Group gap={3} align="baseline" wrap="nowrap">
                  <Text
                    size="md"
                    fw={700}
                    c="blue.3"
                    ff="mono"
                    style={{
                      textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
                      lineHeight: 1,
                    }}
                  >
                    {padNumber(planetEconomics.optimal.currentInfluence)}
                  </Text>
                  <Text
                    size="xs"
                    c="blue.5"
                    fw={500}
                    ff="mono"
                    style={{ lineHeight: 1 }}
                  >
                    / {padNumber(planetEconomics.optimal.totalInfluence)}
                  </Text>
                </Group>
              </Group>
            </Group>

            <Group gap={3} align="center" wrap="nowrap" mt={6} justify="center">
              <CombinedResourceInfluenceIcon size={16} />
              <Group gap={4} align="baseline" wrap="nowrap">
                <Text
                  size="md"
                  fw={700}
                  c="gray.3"
                  ff="mono"
                  style={{
                    textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
                    lineHeight: 1,
                  }}
                >
                  {padNumber(planetEconomics.flex.currentFlex)}
                </Text>
                <Text
                  size="xs"
                  c="gray.5"
                  fw={500}
                  ff="mono"
                  style={{ lineHeight: 1 }}
                >
                  / {padNumber(planetEconomics.flex.totalFlex)}
                </Text>
              </Group>
            </Group>
          </Stack>
        </Tabs.Panel>
      </Stack>
    </Tabs>
  );
}
