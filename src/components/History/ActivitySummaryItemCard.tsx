import { useState } from 'react';
import { Paper, Popover, Box } from '@mantine/core';

interface ActivitySummaryItemCardProps {
  children: React.ReactNode;
  extraContent?: React.ReactNode;
  clickable?: boolean;
}

export function ActivitySummaryItemCard({
  children,
  extraContent,
  clickable = Boolean(extraContent),
}: ActivitySummaryItemCardProps) {
  const [opened, setOpened] = useState(false);

  return (
    <Popover
      opened={opened}
      onChange={setOpened}
      position="right"
      withArrow
      shadow="md"
    >
      <Popover.Target>
        <Paper
          withBorder
          p="md"
          radius="md"
          onClick={() => clickable && setOpened((o) => !o)}
          style={{
            cursor: clickable ? 'pointer' : 'default',
            transition: 'background-color 150ms ease',
          }}
          onMouseEnter={(e: { currentTarget: { style: { backgroundColor: string; }; }; }) =>
            (e.currentTarget.style.backgroundColor =
              'var(--mantine-color-gray-0)')
          }
          onMouseLeave={(e: { currentTarget: { style: { backgroundColor: string; }; }; }) =>
            (e.currentTarget.style.backgroundColor = '')
          }
        >
          {children}
        </Paper>
      </Popover.Target>

      {extraContent && (
        <Popover.Dropdown>
          <Box>
            {extraContent}
          </Box>
        </Popover.Dropdown>
      )}
    </Popover>
  );
}
