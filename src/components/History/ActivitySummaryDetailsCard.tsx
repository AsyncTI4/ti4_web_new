import { ActionType, ActivitySummaryType, GameActivitySummaryDetails } from '@/data/types';
import { Group, Image, Text, Tooltip } from '@mantine/core';
import {
  IconCrosshair,
  IconCrown,
} from '@tabler/icons-react';


interface ActivitySummaryDetailsProps {
  activitySummaryType: ActivitySummaryType;
  details: GameActivitySummaryDetails;
}

const ACTION_ICON_MAP: Record<
  ActionType,
  { icon: React.ReactNode; label: string }
> = {
    TACTICAL: {
        icon: <IconCrosshair size={18} />,
        label: 'Tactical Action',
    },
    STRATEGY: {
        icon: <IconCrown size={18} />,
        label: 'Strategy Action',
    },
    COMPONENT: {
        icon: undefined,
        label: ''
    }
};

export function ActivitySummaryDetails({
  details,
}: ActivitySummaryDetailsProps) {
  const config = ACTION_ICON_MAP[details.type];

  return (
    <Tooltip label={config.label}>
      <Group gap="xs">
        {config.icon}
        <Text size="xs" c="dimmed">
          {details.type}
        </Text>
      </Group>
    </Tooltip>
  );
}
