import { Box, Group, Stack } from "@mantine/core";
import type { BoxProps, GroupProps } from "@mantine/core";
import { PlayerCardCounts } from "../PlayerCardCounts";
import { CCPool } from "../CCPool";
import { FragmentsPool } from "../FragmentsPool";

import type { ComponentProps } from "react";

const DEFAULT_GAP = 4;

type PlayerCardCountsProps = ComponentProps<typeof PlayerCardCounts>;
type CCPoolProps = ComponentProps<typeof CCPool>;

type Props = {
  counts: PlayerCardCountsProps;
  commandCounters: CCPoolProps;
  fragments: string[];
  fragmentsPlacement?: "inline" | "stacked";
  groupProps?: GroupProps;
  commandCountersWrapperProps?: BoxProps;
  fragmentsWrapperProps?: BoxProps;
};

export function PlayerCardLogisticsRow({
  counts,
  commandCounters,
  fragments,
  fragmentsPlacement = "inline",
  groupProps,
  commandCountersWrapperProps,
  fragmentsWrapperProps,
}: Props) {
  const { gap, ...restGroupProps } = groupProps || {};

  const countersGroup = (
    <Group gap={gap ?? DEFAULT_GAP} align="flex-start" {...restGroupProps}>
      <PlayerCardCounts {...counts} />
      <Box {...commandCountersWrapperProps}>
        <CCPool {...commandCounters} />
      </Box>
      {fragmentsPlacement === "inline" && (
        <Box {...fragmentsWrapperProps}>
          <FragmentsPool fragments={fragments} />
        </Box>
      )}
    </Group>
  );

  if (fragmentsPlacement === "stacked") {
    return (
      <Stack gap={4} align="flex-start">
        {countersGroup}
        <Box {...fragmentsWrapperProps}>
          <FragmentsPool fragments={fragments} />
        </Box>
      </Stack>
    );
  }

  return countersGroup;
}
