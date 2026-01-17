import { Timeline, Text, Badge, Group } from '@mantine/core';
import {
  IconCheck,
  IconX,
  IconInfoCircle,
} from '@tabler/icons-react';
import { ActivitySummaryItemCard } from './ActivitySummaryItemCard';
import { GameActivitySummary } from '@/data/types';
import { ActivitySummaryDetails } from './ActivitySummaryDetails';

export type ActionStatus = 'success' | 'error' | 'info';

interface ActionHistoryItemProps {
  activitySummary: GameActivitySummary;
  timestamp?: string;
  lineVariant?: 'solid' | 'dotted' | 'dashed';
  extraInfo?: React.ReactNode;
}

const statusConfig = {
  complete: {
    icon: <IconCheck size={16} />,
    color: 'green',
    label: 'Completed',
  },
  in_progress: {
    icon: <IconX size={16} />,
    color: 'yellow',
    label: 'In Progress',
  },
};

export function ActivitySummaryItem({
  activitySummary,
  timestamp,
  lineVariant = 'solid',
  extraInfo,
}: ActionHistoryItemProps) {
  const toCamelCase = (value?: string) =>
    value ? value[0].toUpperCase() + value.slice(1).toLowerCase() : "";
  
  const status = activitySummary.activityStatus === "COMPLETE" ? "complete" : "in_progress"
  const { icon, color, label } = statusConfig[status];

  const activitySummaryType = activitySummary.activitySummaryType;

  let actionType;
  if (activitySummaryType === 'ACTION') {
    actionType = activitySummary.actionType;
  }

  return (
    <Timeline.Item
      title={getActivityTitle(activitySummary)}
      bullet={icon}
      lineVariant={lineVariant}
    >
      <ActivitySummaryItemCard extraContent={extraInfo}>
        <Group justify="space-between" align="center" mb={4}>
          {/* LEFT SIDE */}
          <Group align="center" gap="xs">
            <Badge color={color} size="sm">
              {label}
            </Badge>

            {activitySummary.summaryDetails && (
              <ActivitySummaryDetails
                activitySummaryType={activitySummaryType}
                actionType={actionType}
                details={activitySummary.summaryDetails}
              />
            )}
          </Group>

          {/* RIGHT SIDE */}
          <Text size="xs" c="dimmed">
            {activitySummary.timestamp}
          </Text>
        </Group>

        {activitySummary.activitySummaryType === "ACTION" && (
          <Text>
            {`${toCamelCase(activitySummary.actionType)} Action taken by ${activitySummary.actionedBy}`}
          </Text>
        )}
      </ActivitySummaryItemCard>
    </Timeline.Item>
  );
}

const ACTION_TITLES: Record<
  Extract<GameActivitySummary, { activitySummaryType: "ACTION" }>["actionType"],
  string
> = {
  TACTICAL: "Tactical Action",
  STRATEGY: "Strategy Action",
  COMPONENT: "Component Action",
};

export function getActivityTitle(activity: GameActivitySummary): string {
  if (activity.activitySummaryType === "AGENDA") {
    return "Agenda Phase";
  }

  return ACTION_TITLES[activity.actionType];
}
