import { cdnImage } from "../../../data/cdnImage";
import { Table, Image, Text, Flex } from "@mantine/core";
import classes from "./ArmyStats.module.css";

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

function formatOneDecimal(value: number): string {
  if (value === undefined || value === null || Number.isNaN(Number(value))) {
    return "0.0";
  }
  return Number(value).toFixed(1);
}

type StatRowProps = {
  label: string;
  res: number;
  health: number;
  combat: number;
};

function HeaderRow() {
  return (
    <Table.Tr>
      <Table.Th></Table.Th>
      <Table.Th>
        <Flex justify={"center"}>
          <Image
            src={cdnImage("/player_area/pa_resources.png")}
            className={classes.headerIcon}
          />
        </Flex>
      </Table.Th>
      <Table.Th>
        <Flex justify={"center"}>
          <Image
            src={cdnImage("/player_area/pa_health.png")}
            className={classes.headerIcon}
          />
        </Flex>
      </Table.Th>
      <Table.Th>
        <Flex justify={"center"}>
          <Image
            src={cdnImage("/player_area/pa_hit.png")}
            className={classes.headerIcon}
          />
        </Flex>
      </Table.Th>
    </Table.Tr>
  );
}

function StatRow({ label, res, health, combat }: StatRowProps) {
  return (
    <Table.Tr>
      <Table.Td>
        <Text
          size="xs"
          ff={"mono"}
          fw={700}
          ta="left"
          className={classes.caption}
        >
          {label}
        </Text>
      </Table.Td>
      <Table.Td>
        <Text
          size="md"
          ff={"mono"}
          fw={700}
          c="white"
          ta="right"
          className={classes.number}
        >
          {formatOneDecimal(res)}
        </Text>
      </Table.Td>
      <Table.Td>
        <Text
          size="md"
          ff={"mono"}
          fw={700}
          c="white"
          ta="right"
          className={classes.number}
        >
          {formatOneDecimal(health)}
        </Text>
      </Table.Td>
      <Table.Td>
        <Text
          size="md"
          ff={"mono"}
          fw={700}
          c="white"
          ta="right"
          className={classes.number}
        >
          {formatOneDecimal(combat)}
        </Text>
      </Table.Td>
    </Table.Tr>
  );
}

type MetricRowDualProps = {
  iconPath: string;
  ground: number;
  space: number;
};

function TopHeaderRow() {
  return (
    <Table.Tr>
      <Table.Th></Table.Th>
      <Table.Th>
        <Text
          size="xs"
          ff={"mono"}
          fw={700}
          ta="center"
          className={classes.caption}
        >
          GROUND
        </Text>
      </Table.Th>
      <Table.Th>
        <Text
          size="xs"
          ff={"mono"}
          fw={700}
          ta="center"
          className={classes.caption}
        >
          SPACE
        </Text>
      </Table.Th>
    </Table.Tr>
  );
}

function MetricRowDual({ iconPath, ground, space }: MetricRowDualProps) {
  return (
    <Table.Tr>
      <Table.Td>
        <Flex justify={"center"}>
          <Image src={cdnImage(iconPath)} className={classes.headerIcon} />
        </Flex>
      </Table.Td>
      <Table.Td>
        <Text
          size="sm"
          ff={"mono"}
          fw={700}
          c="white"
          ta="right"
          className={classes.number}
        >
          {formatOneDecimal(ground)}
        </Text>
      </Table.Td>
      <Table.Td>
        <Text
          size="sm"
          ff={"mono"}
          fw={700}
          c="white"
          ta="right"
          className={classes.number}
        >
          {formatOneDecimal(space)}
        </Text>
      </Table.Td>
    </Table.Tr>
  );
}

export function ArmyStats({ stats }: Props) {
  return (
    <Table horizontalSpacing={8} verticalSpacing={10} className={classes.table}>
      <Table.Thead>
        <TopHeaderRow />
      </Table.Thead>
      <Table.Tbody>
        <MetricRowDual
          iconPath="/player_area/pa_resources.png"
          ground={stats.groundArmyRes}
          space={stats.spaceArmyRes}
        />
        <MetricRowDual
          iconPath="/player_area/pa_health.png"
          ground={stats.groundArmyHealth}
          space={stats.spaceArmyHealth}
        />
        <MetricRowDual
          iconPath="/player_area/pa_hit.png"
          ground={stats.groundArmyCombat}
          space={stats.spaceArmyCombat}
        />
      </Table.Tbody>
    </Table>
  );
}

export function SpaceArmyStats({ stats }: Props) {
  return (
    <Table
      horizontalSpacing={12}
      verticalSpacing={10}
      className={classes.table}
    >
      <Table.Thead>
        <HeaderRow />
      </Table.Thead>
      <Table.Tbody>
        <StatRow
          label="SPACE"
          res={stats.spaceArmyRes}
          health={stats.spaceArmyHealth}
          combat={stats.spaceArmyCombat}
        />
      </Table.Tbody>
    </Table>
  );
}

export function GroundArmyStats({ stats }: Props) {
  return (
    <Table
      horizontalSpacing={12}
      verticalSpacing={10}
      className={classes.table}
    >
      <Table.Thead>
        <HeaderRow />
      </Table.Thead>
      <Table.Tbody>
        <StatRow
          label="GROUND"
          res={stats.groundArmyRes}
          health={stats.groundArmyHealth}
          combat={stats.groundArmyCombat}
        />
      </Table.Tbody>
    </Table>
  );
}
