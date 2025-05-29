import { cdnImage } from "../../data/cdnImage";
import { Table, Image, Text } from "@mantine/core";
import { IconRocket, IconPlanet } from "@tabler/icons-react";

type Props = {
  stats: {
    spaceHealth: number;
    groundHealth: number;
    spaceHit: number;
    groundHit: number;
    spaceUnits: number;
    groundUnits: number;
  };
};

export function ArmyStats({ stats }: Props) {
  return (
    <Table horizontalSpacing={0} verticalSpacing={1}>
      <Table.Thead>
        <Table.Tr>
          <Table.Th></Table.Th>
          <Table.Th>
            <IconRocket size={16} />
          </Table.Th>
          <Table.Th>
            <IconPlanet size={16} />
          </Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        <Table.Tr>
          <Table.Td>
            <Image
              src={cdnImage("/player_area/pa_resources.png")}
              style={{ width: "20px" }}
            />
          </Table.Td>
          <Table.Td>
            <Text size="md" fw={700} c="white">
              {stats.spaceUnits}
            </Text>
          </Table.Td>
          <Table.Td>
            <Text size="md" fw={700} c="white">
              {stats.groundUnits}
            </Text>
          </Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Td>
            <Image
              src={cdnImage("/player_area/pa_health.png")}
              style={{ width: "20px" }}
            />
          </Table.Td>
          <Table.Td>
            <Text size="md" fw={700} c="white">
              {stats.spaceHealth}
            </Text>
          </Table.Td>
          <Table.Td>
            <Text size="md" fw={700} c="white">
              {stats.groundHealth}
            </Text>
          </Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Td>
            <Image
              src={cdnImage("/player_area/pa_hit.png")}
              style={{ width: "20px" }}
            />
          </Table.Td>
          <Table.Td>
            <Text size="md" fw={700} c="white">
              {stats.spaceHit}
            </Text>
          </Table.Td>
          <Table.Td>
            <Text size="md" fw={700} c="white">
              {stats.groundHit}
            </Text>
          </Table.Td>
        </Table.Tr>
      </Table.Tbody>
    </Table>
  );
}
