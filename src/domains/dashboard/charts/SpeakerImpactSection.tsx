import { Group, Text } from "@mantine/core";
import { IconCrown } from "@tabler/icons-react";
import type { SpeakerImpact } from "../types";
import { Panel } from "@/shared/ui/primitives/Panel";
import Caption from "@/shared/ui/Caption/Caption";
import { Chip } from "@/shared/ui/primitives/Chip";
import FadedDivider from "@/shared/ui/primitives/FadedDivider/FadedDivider";
import cx from "clsx";
import classes from "./AggregateCharts.module.css";

type Props = { impact: SpeakerImpact };

export function SpeakerImpactSection({ impact }: Props) {
  const deltaPositive = impact.deltaWinRate >= 0;

  return (
    <Panel variant="elevated" className={classes.aggregateCard}>
      <div className={classes.sectionHeader}>
        <Group gap={6}>
          <IconCrown size={16} color="var(--mantine-color-yellow-4)" />
          <Caption size="sm">Speaker Impact</Caption>
        </Group>
        <Chip accent={deltaPositive ? "green" : "red"} size="xs">
          <Text size="10px" fw={700} c="white">
            {deltaPositive ? "+" : ""}{impact.deltaWinRate.toFixed(1)}%
          </Text>
        </Chip>
      </div>
      <FadedDivider orientation="horizontal" />
      <div className={classes.speakerComparison}>
        <div className={cx(classes.speakerBucket, classes.speaker)}>
          <Caption size="xs">As Speaker</Caption>
          <span className={classes.speakerBucketRate}>
            {impact.speaker.winRate.toFixed(1)}%
          </span>
          <Text size="10px" c="gray.5">
            {impact.speaker.wins}W / {impact.speaker.games}G
          </Text>
        </div>

        <div className={classes.speakerDelta}>
          <span
            className={cx(
              classes.speakerDeltaValue,
              deltaPositive ? classes.deltaPositive : classes.deltaNegative,
            )}
          >
            {deltaPositive ? "+" : ""}{impact.deltaWinRate.toFixed(1)}%
          </span>
          <Text size="9px" c="gray.6">delta</Text>
        </div>

        <div className={cx(classes.speakerBucket, classes.nonSpeaker)}>
          <Caption size="xs">Non-Speaker</Caption>
          <span className={classes.speakerBucketRate}>
            {impact.nonSpeaker.winRate.toFixed(1)}%
          </span>
          <Text size="10px" c="gray.5">
            {impact.nonSpeaker.wins}W / {impact.nonSpeaker.games}G
          </Text>
        </div>
      </div>
    </Panel>
  );
}
