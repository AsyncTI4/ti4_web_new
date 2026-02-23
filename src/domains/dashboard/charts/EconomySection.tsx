import { Group, Text } from "@mantine/core";
import { IconCoin } from "@tabler/icons-react";
import type { EconomyProfile } from "../types";
import { Panel } from "@/shared/ui/primitives/Panel";
import Caption from "@/shared/ui/Caption/Caption";
import FadedDivider from "@/shared/ui/primitives/FadedDivider/FadedDivider";
import classes from "./AggregateCharts.module.css";

type Props = { profile: EconomyProfile };

export function EconomySection({ profile }: Props) {
  return (
    <Panel variant="elevated" className={classes.aggregateCard}>
      <div className={classes.sectionHeader}>
        <Group gap={6}>
          <IconCoin size={16} color="var(--mantine-color-teal-4)" />
          <Caption size="sm">Economy Profile</Caption>
        </Group>
      </div>
      <FadedDivider orientation="horizontal" />
      <div className={classes.kpiRow}>
        <div className={classes.kpiBlock}>
          <Caption size="xs">Avg Expenses/Game</Caption>
          <span className={classes.kpiBlockValue}>
            {profile.avgTotalExpenses.toFixed(1)}
          </span>
        </div>
        <div className={classes.kpiBlock}>
          <Caption size="xs">Total Spent</Caption>
          <span className={classes.kpiBlockValue}>
            {profile.totalExpensesSum.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </span>
        </div>
        <div className={classes.kpiBlock}>
          <Caption size="xs">Games</Caption>
          <span className={classes.kpiBlockValue}>
            {profile.completedGamesConsidered}
          </span>
        </div>
      </div>
      <Text size="11px" c="gray.6" lh={1.3}>
        Total resource expenditure across all completed games. Higher values indicate more
        economically active games.
      </Text>
    </Panel>
  );
}
