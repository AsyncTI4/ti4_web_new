import { Box, Group } from "@mantine/core";
import type { BoxProps, GroupProps } from "@mantine/core";
import { PlayerCardPlanetsArea, type PlayerCardPlanetsAreaProps } from "./PlayerCardPlanetsArea";
import {
  ReinforcementTokensGroup,
  type ReinforcementTokensGroupProps,
} from "../ReinforcementTokensGroup";

export type PlayerCardPlanetsWithReinforcementsProps =
  PlayerCardPlanetsAreaProps & {
    groupProps?: GroupProps;
    planetsWrapperProps?: BoxProps;
    reinforcementProps?: ReinforcementTokensGroupProps;
  };

export function PlayerCardPlanetsWithReinforcements({
  groupProps,
  planetsWrapperProps,
  reinforcementProps,
  ...planetsAreaProps
}: PlayerCardPlanetsWithReinforcementsProps) {
  const {
    style: groupStyle,
    gap,
    wrap,
    align,
    ...restGroupProps
  } = groupProps || {};

  const { style: wrapperStyle, ...restWrapperProps } = planetsWrapperProps || {};

  return (
    <Group
      gap={gap ?? 4}
      wrap={wrap ?? "wrap"}
      align={align ?? "flex-start"}
      style={groupStyle}
      {...restGroupProps}
    >
      <Box
        {...restWrapperProps}
        style={{
          flex: 1,
          minWidth: 0,
          ...wrapperStyle,
        }}
      >
        <PlayerCardPlanetsArea {...planetsAreaProps} />
      </Box>
      <ReinforcementTokensGroup {...reinforcementProps} />
    </Group>
  );
}
