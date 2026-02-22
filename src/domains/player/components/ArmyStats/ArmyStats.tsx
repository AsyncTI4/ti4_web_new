import { cdnImage } from "@/entities/data/cdnImage";
import { Table, Image, Text, Flex, Box } from "@mantine/core";
import { IconTrophy } from "@tabler/icons-react";
import classes from "./ArmyStats.module.css";

type ArmyStatsData = {
  spaceArmyRes: number;
  groundArmyRes: number;
  spaceArmyHealth: number;
  groundArmyHealth: number;
  spaceArmyCombat: number;
  groundArmyCombat: number;
};

type Props = {
  stats: ArmyStatsData;
  rank?: number;
};

function formatOneDecimal(value: number): string {
  if (value === undefined || value === null || Number.isNaN(Number(value))) {
    return "0.0";
  }
  return Number(value).toFixed(1);
}

function StatIcon({ path }: { path: string }) {
  return (
    <Flex justify="center">
      <Image src={cdnImage(path)} className={classes.headerIcon} />
    </Flex>
  );
}

function StatValue({ value, size = "sm" }: { value: number; size?: "sm" | "md" }) {
  return (
    <Text size={size} ff="mono" fw={700} c="white" ta="right" className={classes.number}>
      {formatOneDecimal(value)}
    </Text>
  );
}

function HeaderLabel({ children }: { children: React.ReactNode }) {
  return (
    <Text size="xs" ff="mono" fw={700} ta="center" className={classes.caption}>
      {children}
    </Text>
  );
}

function TopHeaderRow() {
  return (
    <Table.Tr>
      <Table.Th />
      <Table.Th><HeaderLabel>GROUND</HeaderLabel></Table.Th>
      <Table.Th><HeaderLabel>SPACE</HeaderLabel></Table.Th>
    </Table.Tr>
  );
}

type MetricRowDualProps = {
  iconPath: string;
  ground: number;
  space: number;
};

function MetricRowDual({ iconPath, ground, space }: MetricRowDualProps) {
  return (
    <Table.Tr>
      <Table.Td><StatIcon path={iconPath} /></Table.Td>
      <Table.Td><StatValue value={ground} /></Table.Td>
      <Table.Td><StatValue value={space} /></Table.Td>
    </Table.Tr>
  );
}

const RANK_CONFIG = {
  1: { color: "var(--army-rank-first-color)", bg: "rgba(255, 215, 0, 0.12)", border: "rgba(255, 215, 0, 0.3)" },
  2: { color: "var(--army-rank-second-color)", bg: "rgba(192, 192, 192, 0.12)", border: "rgba(192, 192, 192, 0.3)" },
  3: { color: "var(--army-rank-third-color)", bg: "rgba(205, 127, 50, 0.12)", border: "rgba(205, 127, 50, 0.3)" },
  default: { color: "rgba(180, 180, 180, 0.9)", bg: "rgba(20, 20, 20, 0.4)", border: "rgba(80, 80, 80, 0.3)" },
} as const;

function RankBadge({ rank }: { rank: number }) {
  const config = rank <= 3 ? RANK_CONFIG[rank as 1 | 2 | 3] : RANK_CONFIG.default;

  return (
    <Box
      className={classes.rankBadge}
      style={{
        background: config.bg,
        border: `1px solid ${config.border}`,
        boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.05)",
      }}
    >
      <IconTrophy size={12} style={{ color: config.color }} />
      <Text size="xs" fw={700} style={{ color: config.color }}>
        {rank}
      </Text>
    </Box>
  );
}

export function ArmyStats({ stats, rank }: Props) {
  return (
    <Box style={{ position: "relative" }}>
      {rank && <RankBadge rank={rank} />}
      <Table horizontalSpacing={6} verticalSpacing={6} className={classes.table}>
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
    </Box>
  );
}
