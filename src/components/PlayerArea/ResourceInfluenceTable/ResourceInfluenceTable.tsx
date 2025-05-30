import { Table, Group, Text, Image } from "@mantine/core";
// @ts-ignore
import InfluenceIcon from "../../InfluenceIcon";
import { cdnImage } from "../../../data/cdnImage";

// Component for the half-yellow, half-blue combined icon
function CombinedResourceInfluenceIcon({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <defs>
        <linearGradient id="half-yellow-blue" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="50%" stopColor="#eab308" />
          <stop offset="50%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
      <polygon
        points="6,2 18,2 22,12 18,22 6,22 2,12"
        fill="transparent"
        stroke="url(#half-yellow-blue)"
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
    <Table horizontalSpacing="xs" verticalSpacing="xs">
      <Table.Thead>
        <Table.Tr>
          <Table.Th></Table.Th>
          <Table.Th>
            <Text
              size="xs"
              c="gray.4"
              fw={600}
              style={{ textTransform: "uppercase", letterSpacing: "0.5px" }}
            >
              Total
            </Text>
          </Table.Th>
          <Table.Th>
            <Text
              size="xs"
              c="gray.4"
              fw={600}
              style={{ textTransform: "uppercase", letterSpacing: "0.5px" }}
            >
              Optimal
            </Text>
          </Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        <Table.Tr>
          <Table.Td>
            <Group gap={4} align="center">
              <Image
                src={cdnImage("/player_area/pa_resources.png")}
                width={16}
                height={16}
              />
            </Group>
          </Table.Td>
          <Table.Td>
            <Group gap={4} align="baseline">
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
          </Table.Td>
          <Table.Td>
            <Group gap={4} align="baseline">
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
          </Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Td>
            <Group gap={4} align="center">
              <InfluenceIcon size={16} />
            </Group>
          </Table.Td>
          <Table.Td>
            <Group gap={4} align="baseline">
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
          </Table.Td>
          <Table.Td>
            <Group gap={4} align="baseline">
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
          </Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Td>
            <Group gap={4} align="center">
              <CombinedResourceInfluenceIcon size={16} />
            </Group>
          </Table.Td>
          <Table.Td colSpan={2} style={{ textAlign: "center" }}>
            <Group gap={4} align="baseline" justify="center">
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
          </Table.Td>
        </Table.Tr>
      </Table.Tbody>
    </Table>
  );
}
