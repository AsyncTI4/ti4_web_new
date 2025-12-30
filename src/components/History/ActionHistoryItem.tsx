import { Timeline, Text, Badge, Group } from '@mantine/core';
import {
  IconCheck,
  IconX,
  IconInfoCircle,
} from '@tabler/icons-react';
import { ActionHistoryItemCard } from './ActionHistoryItemCard';

export type ActionStatus = 'success' | 'error' | 'info';

interface ActionHistoryItemProps {
  title: string;
  description: string;
  status: ActionStatus;
  timestamp?: string;
  lineVariant?: 'solid' | 'dotted' | 'dashed';
  extraInfo?: React.ReactNode;
}

const statusConfig = {
  success: {
    icon: <IconCheck size={16} />,
    color: 'green',
    label: 'Completed',
  },
  error: {
    icon: <IconX size={16} />,
    color: 'red',
    label: 'Failed',
  },
  info: {
    icon: <IconInfoCircle size={16} />,
    color: 'blue',
    label: 'Info',
  },
};

export function ActionHistoryItem({
  title,
  description,
  status,
  timestamp,
  lineVariant = 'solid',
  extraInfo,
}: ActionHistoryItemProps) {
  const { icon, color, label } = statusConfig[status];

  return (
    <Timeline.Item
      title={title}
      bullet={icon}
      lineVariant={lineVariant}
    >
      <ActionHistoryItemCard extraContent={extraInfo}>
        <Group justify="space-between" mb={4}>
          <Badge color={color} size="sm">
            {label}
          </Badge>

          {timestamp && (
            <Text size="xs" c="dimmed">
              {timestamp}
            </Text>
          )}
        </Group>

        <Text size="sm">{description}</Text>
      </ActionHistoryItemCard>
    </Timeline.Item>
  );
}
