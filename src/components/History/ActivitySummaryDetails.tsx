import { ActionType, ActivitySummaryType, GameActivitySummaryDetails } from '@/data/types';
import { Group, Image, Text, Tooltip } from '@mantine/core';

import {
  IconCrosshair,
  IconCrown,
  IconBuildingFactory,
  IconSwords,
  IconTrophy,
  IconSearch,
  IconArrowBackUp,
  IconFlag,
} from '@tabler/icons-react';



interface ActivitySummaryDetailsProps {
  activitySummaryType: ActivitySummaryType;
  actionType?: ActionType;
  details: GameActivitySummaryDetails;
}

export type ActivitySummaryDetailType =
  | 'TRANSACTION'
  | 'SPACE_COMBAT'
  | 'GROUND_COMBAT'
  | 'SO_SCORED'
  | 'EXPLORE'
  | 'PRODUCTION'
  | 'RETREAT'
  | 'CONQUEST';

const ACTIVITY_DETAILS_ICON_MAP: Record<
  ActivitySummaryDetailType,
  { icon: React.ReactNode; label: string }
> = {
  TRANSACTION: {
    icon: <IconCrosshair size={18} />,
    label: 'Transaction',
  },
  SPACE_COMBAT: {
    icon: <IconCrown size={18} />,
    label: 'Space Combat',
  },
  GROUND_COMBAT: {
    icon: <IconSwords size={18} />,
    label: 'Ground Combat',
  },
  SO_SCORED: {
    icon: <IconTrophy size={18} />,
    label: 'Secret Objective Scored',
  },
  EXPLORE: {
    icon: <IconSearch size={18} />,
    label: 'Explore',
  },
  PRODUCTION: {
    icon: <IconBuildingFactory size={18} />,
    label: 'Production',
  },
  RETREAT: {
    icon: <IconArrowBackUp size={18} />,
    label: 'Retreat',
  },
  CONQUEST: {
    icon: <IconFlag size={18} />,
    label: 'Planet Conquered',
  },
};

export function ActivitySummaryDetails({
  activitySummaryType,
  actionType,
  details,
}: ActivitySummaryDetailsProps) {

  console.log("WH4")
  function deriveDetailTypes(
  activitySummaryType: ActivitySummaryType,
  actionType: ActionType | undefined,
  details: GameActivitySummaryDetails
): ActivitySummaryDetailType[] {
  const result: ActivitySummaryDetailType[] = [];

  if (details.transactions?.length) {
    result.push('TRANSACTION');
  }

  if (activitySummaryType === 'ACTION' && actionType === 'TACTICAL') {
    if ('spaceCombatUnits' in details && details.spaceCombatUnits?.length) {
      result.push('SPACE_COMBAT');
    }

    if (
      'groundCombatUnits' in details &&
      details.groundCombatUnits &&
      Object.keys(details.groundCombatUnits).length
    ) {
      result.push('GROUND_COMBAT');
    }

    if ('explores' in details && details.explores?.length) {
      result.push('EXPLORE');
    }

    if ('producedUnits' in details && details.producedUnits?.length) {
      result.push('PRODUCTION');
    }

    if ('retreatSystemId' in details && details.retreatSystemId) {
      result.push('RETREAT');
    }

    if ('planetsGained' in details && details.planetsGained?.length) {
      result.push('CONQUEST');
    }

    if (
      'scoredSOIds' in details &&
      details.scoredSOIds &&
      Object.keys(details.scoredSOIds).length
    ) {
      result.push('SO_SCORED');
    }
  }

  return result;
}

  const detailTypes = deriveDetailTypes(
    activitySummaryType,
    actionType,
    details
  );

  if (!detailTypes.length) {
    return null;
  }


    return (
    <Group gap="xs">
      {detailTypes.map((type) => {
        const meta = ACTIVITY_DETAILS_ICON_MAP[type];

        return (
          <Tooltip key={type} label={meta.label} withArrow>
            <Group gap={4}>
              {meta.icon}
            </Group>
          </Tooltip>
        );
      })}
    </Group>
  );
}
