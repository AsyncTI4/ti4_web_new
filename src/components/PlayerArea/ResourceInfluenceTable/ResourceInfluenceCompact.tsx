import { Group, Text, Image, Tabs, Stack } from "@mantine/core";
import { StatMono } from "@/components/shared/primitives/StatMono";
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
      <Group gap="lg" align="center" wrap="nowrap">
        <Tabs.List>
          <Stack gap={2}>
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
          </Stack>
        </Tabs.List>

        <div style={{ flex: 1 }}>
          <Tabs.Panel value="total">
            <Group gap="sm" wrap="nowrap" justify="center">
              <Group gap={6} align="center" wrap="nowrap">
                <Image
                  src={cdnImage("/player_area/pa_resources.png")}
                  width={24}
                  height={24}
                />
                <Group gap={6} align="baseline" wrap="nowrap">
                  <StatMono
                    size="xl"
                    fw={700}
                    c="yellow.3"
                    style={{ lineHeight: 1 }}
                  >
                    {padNumber(planetEconomics.total.currentResources)}
                  </StatMono>
                  <StatMono
                    size="sm"
                    c="yellow.5"
                    fw={500}
                    style={{ lineHeight: 1 }}
                  >
                    / {padNumber(planetEconomics.total.totalResources)}
                  </StatMono>
                </Group>
              </Group>

              <Text c="gray.6" size="lg">
                |
              </Text>

              <Group gap={6} align="center" wrap="nowrap">
                <InfluenceIcon size={24} />
                <Group gap={6} align="baseline" wrap="nowrap">
                  <StatMono
                    size="xl"
                    fw={700}
                    c="blue.3"
                    style={{ lineHeight: 1 }}
                  >
                    {padNumber(planetEconomics.total.currentInfluence)}
                  </StatMono>
                  <StatMono
                    size="sm"
                    c="blue.5"
                    fw={500}
                    style={{ lineHeight: 1 }}
                  >
                    / {padNumber(planetEconomics.total.totalInfluence)}
                  </StatMono>
                </Group>
              </Group>
            </Group>
          </Tabs.Panel>

          <Tabs.Panel value="optimal">
            <Group gap="sm" wrap="nowrap" justify="center">
              <Group gap={6} align="center" wrap="nowrap">
                <Image
                  src={cdnImage("/player_area/pa_resources.png")}
                  width={24}
                  height={24}
                />
                <Group gap={6} align="baseline" wrap="nowrap">
                  <StatMono
                    size="xl"
                    fw={700}
                    c="yellow.3"
                    style={{ lineHeight: 1 }}
                  >
                    {padNumber(planetEconomics.optimal.currentResources)}
                  </StatMono>
                  <StatMono
                    size="sm"
                    c="yellow.5"
                    fw={500}
                    style={{ lineHeight: 1 }}
                  >
                    / {padNumber(planetEconomics.optimal.totalResources)}
                  </StatMono>
                </Group>
              </Group>

              <Text c="gray.6" size="lg">
                |
              </Text>

              <Group gap={6} align="center" wrap="nowrap">
                <InfluenceIcon size={24} />
                <Group gap={6} align="baseline" wrap="nowrap">
                  <StatMono
                    size="xl"
                    fw={700}
                    c="blue.3"
                    style={{ lineHeight: 1 }}
                  >
                    {padNumber(planetEconomics.optimal.currentInfluence)}
                  </StatMono>
                  <StatMono
                    size="sm"
                    c="blue.5"
                    fw={500}
                    style={{ lineHeight: 1 }}
                  >
                    / {padNumber(planetEconomics.optimal.totalInfluence)}
                  </StatMono>
                </Group>
              </Group>

              <Text c="gray.6" size="lg">
                |
              </Text>

              <Group gap={6} align="center" wrap="nowrap">
                <CombinedResourceInfluenceIcon size={24} />
                <Group gap={6} align="baseline" wrap="nowrap">
                  <StatMono
                    size="xl"
                    fw={700}
                    c="gray.3"
                    style={{ lineHeight: 1 }}
                  >
                    {padNumber(planetEconomics.flex.currentFlex)}
                  </StatMono>
                  <StatMono
                    size="sm"
                    c="gray.5"
                    fw={500}
                    style={{ lineHeight: 1 }}
                  >
                    / {padNumber(planetEconomics.flex.totalFlex)}
                  </StatMono>
                </Group>
              </Group>
            </Group>
          </Tabs.Panel>
        </div>
      </Group>
    </Tabs>
  );
}
