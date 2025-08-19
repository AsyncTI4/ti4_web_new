import { Group, Text, Image, Tabs, Stack } from "@mantine/core";
// @ts-ignore
import InfluenceIcon from "../../InfluenceIcon";
import { cdnImage } from "../../../data/cdnImage";

// Component for the half-yellow, half-blue combined icon
function CombinedResourceInfluenceIcon({ size = 20 }: { size?: number }) {
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

export function ResourceInfluenceCompact({ planetEconomics }: Props) {
  return (
    <Tabs defaultValue="optimal" variant="pills" orientation="vertical">
      <Stack gap="lg" align="center" justify="flex-start">
        <Tabs.List>
          <Group gap={2}>
            <Tabs.Tab value="total" size="xs" h={18} p="2px 6px">
              <Text size="xs" fw={600} style={{ fontSize: "10px" }}>
                Tot.
              </Text>
            </Tabs.Tab>
            <Tabs.Tab value="optimal" size="xs" h={18} p="2px 6px">
              <Text size="xs" fw={600} style={{ fontSize: "10px" }}>
                Opt.
              </Text>
            </Tabs.Tab>
          </Group>
        </Tabs.List>

        <div style={{ flex: 1 }}>
          <Tabs.Panel value="total">
            <Stack gap="sm"  justify="center">
              <Group gap={6} align="center" wrap="nowrap">
                <Image
                  src={cdnImage("/player_area/pa_resources.png")}
                  width={24}
                  height={24}
                />
                <Group gap={6} align="baseline" wrap="nowrap">
                  <Text
                    size="xl"
                    fw={700}
                    c="yellow.3"
                    ff="mono"
                    style={{
                      textShadow: "0 2px 4px rgba(0, 0, 0, 0.6)",
                      lineHeight: 1,
                    }}
                  >
                    {padNumber(planetEconomics.total.currentResources)}
                  </Text>
                  <Text
                    size="sm"
                    c="yellow.5"
                    fw={500}
                    ff="mono"
                    style={{ lineHeight: 1 }}
                  >
                    / {padNumber(planetEconomics.total.totalResources)}
                  </Text>
                </Group>
              </Group>

              <Group gap={6} align="center" wrap="nowrap">
                <InfluenceIcon size={24} />
                <Group gap={6} align="baseline" wrap="nowrap">
                  <Text
                    size="xl"
                    fw={700}
                    c="blue.3"
                    ff="mono"
                    style={{
                      textShadow: "0 2px 4px rgba(0, 0, 0, 0.6)",
                      lineHeight: 1,
                    }}
                  >
                    {padNumber(planetEconomics.total.currentInfluence)}
                  </Text>
                  <Text
                    size="sm"
                    c="blue.5"
                    fw={500}
                    ff="mono"
                    style={{ lineHeight: 1 }}
                  >
                    / {padNumber(planetEconomics.total.totalInfluence)}
                  </Text>
                </Group>
              </Group>
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="optimal">
            <Stack>
                <Group gap={6} align="center" wrap="nowrap">
                  <Image
                    src={cdnImage("/player_area/pa_resources.png")}
                    width={24}
                    height={24}
                  />
                  <Group gap={6} align="baseline" wrap="nowrap">
                    <Text
                      size="xl"
                      fw={700}
                      c="yellow.3"
                      ff="mono"
                      style={{
                        textShadow: "0 2px 4px rgba(0, 0, 0, 0.6)",
                        lineHeight: 1,
                      }}
                    >
                      {padNumber(planetEconomics.optimal.currentResources)}
                    </Text>
                    <Text
                      size="sm"
                      c="yellow.5"
                      fw={500}
                      ff="mono"
                      style={{ lineHeight: 1 }}
                    >
                      / {padNumber(planetEconomics.optimal.totalResources)}
                    </Text>
                  </Group>
                </Group>


                <Group gap={6} align="center" wrap="nowrap">
                  <InfluenceIcon size={24} />
                  <Group gap={6} align="baseline" wrap="nowrap">
                    <Text
                      size="xl"
                      fw={700}
                      c="blue.3"
                      ff="mono"
                      style={{
                        textShadow: "0 2px 4px rgba(0, 0, 0, 0.6)",
                        lineHeight: 1,
                      }}
                    >
                      {padNumber(planetEconomics.optimal.currentInfluence)}
                    </Text>
                    <Text
                      size="sm"
                      c="blue.5"
                      fw={500}
                      ff="mono"
                      style={{ lineHeight: 1 }}
                    >
                      / {padNumber(planetEconomics.optimal.totalInfluence)}
                    </Text>
                  </Group>
                </Group>


                <Group gap={6} align="center" wrap="nowrap">
                  <CombinedResourceInfluenceIcon size={24} />
                  <Group gap={6} align="baseline" wrap="nowrap">
                    <Text
                      size="xl"
                      fw={700}
                      c="gray.3"
                      ff="mono"
                      style={{
                        textShadow: "0 2px 4px rgba(0, 0, 0, 0.6)",
                        lineHeight: 1,
                      }}
                    >
                      {padNumber(planetEconomics.flex.currentFlex)}
                    </Text>
                    <Text
                      size="sm"
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
        </div>
      </Stack>
    </Tabs>
  );
}
