import { Timeline, Title } from '@mantine/core';
import { ActivitySummaryItem } from './ActivitySummaryItem';
import {GameActivitySummary } from '@/data/types';

interface ActivityHistoryViewProps {
  activities?: GameActivitySummary[];
}

export function ActivityHistoryView({
  activities,
}: ActivityHistoryViewProps) {
  console.log("WH1")
  return (
    <>
      <Title order={2} mb="md">
        Activity History
      </Title>

      <Timeline align="left">
        <>
        {activities?.map((activitySummary) => {
            return <ActivitySummaryItem 
              activitySummary={activitySummary}
            />
        })}
        </>
      </Timeline>
    </>
  );
}

export default ActivityHistoryView