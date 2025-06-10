import { cdnImage } from "../../../data/cdnImage";
import { Table, Image, Text } from "@mantine/core";

type Props = {
  stats: {
    spaceArmyRes: number;
    groundArmyRes: number;
    spaceArmyHealth: number;
    groundArmyHealth: number;
    spaceArmyCombat: number;
    groundArmyCombat: number;
  };
};

export function ArmyStats({ stats }: Props) {
  return (
    <Table horizontalSpacing={0} verticalSpacing={1}>
      <Table.Thead>
        <Table.Tr>
          <Table.Th></Table.Th>
          <Table.Th>
            <Text size="sm" fw={700} c="white" ta="center">
              Space
            </Text>
          </Table.Th>
          <Table.Th>
            <Text size="sm" fw={700} c="white" ta="center">
              Ground
            </Text>
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
            <Text size="md" fw={700} c="white" ta="center">
              {stats.spaceArmyRes}
            </Text>
          </Table.Td>
          <Table.Td>
            <Text size="md" fw={700} c="white" ta="center">
              {stats.groundArmyRes}
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
            <Text size="md" fw={700} c="white" ta="center">
              {stats.spaceArmyHealth}
            </Text>
          </Table.Td>
          <Table.Td>
            <Text size="md" fw={700} c="white" ta="center">
              {stats.groundArmyHealth}
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
            <Text size="md" fw={700} c="white" ta="center">
              {stats.spaceArmyCombat}
            </Text>
          </Table.Td>
          <Table.Td>
            <Text size="md" fw={700} c="white" ta="center">
              {stats.groundArmyCombat}
            </Text>
          </Table.Td>
        </Table.Tr>
      </Table.Tbody>
    </Table>
  );
}
