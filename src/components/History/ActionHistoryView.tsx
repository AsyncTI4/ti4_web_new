import { Timeline, Title } from '@mantine/core';
import { ActionHistoryItem } from './ActionHistoryItem';

export function ActionHistoryView() {
  return (
    <>
      <Title order={2} mb="md">
        Action History
      </Title>

      <Timeline align="left">
        <ActionHistoryItem
          title="Order Created"
          description="The order was successfully created."
          status="success"
          timestamp="2025-01-10 09:15"
        />

        <ActionHistoryItem
          title="Payment Processing"
          description="Payment authorization failed."
          status="error"
          timestamp="2025-01-10 09:17"
        />

        <ActionHistoryItem
          title="Manual Review"
          description="Order flagged for manual review."
          status="info"
          timestamp="2025-01-10 09:20"
          lineVariant="dotted"
        />

        <ActionHistoryItem
          title="Order Completed"
          description="Order processing completed successfully."
          status="success"
          timestamp="2025-01-10 09:45"
        />
      </Timeline>
    </>
  );
}

export default ActionHistoryView