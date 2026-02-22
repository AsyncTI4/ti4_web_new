import { Stack, Divider, Image, Text } from "@mantine/core";
import { getActionCard } from "@/entities/lookup/actionCards";
import { DetailsCard } from "@/shared/ui/DetailsCard";

type Props = {
  actionCardId: string;
};

export function ActionCardDetailsCard({ actionCardId }: Props) {
  const actionCardData = getActionCard(actionCardId);

  if (!actionCardData) return null;

  const renderActionIcon = () => (
    <Text
      size="sm"
      fw={700}
      c="yellow.3"
      style={{ textAlign: "center", padding: "12px 12px" }}
    >
      AC
    </Text>
  );

  return (
    <DetailsCard width={320} color="yellow">
      <Stack gap="md">
        <DetailsCard.Title
          title={actionCardData.name}
          subtitle={`${actionCardData.phase} Phase`}
          icon={<DetailsCard.Icon icon={renderActionIcon()} />}
          caption="Action Card"
          captionColor="yellow"
        />

        <Divider c="gray.7" opacity={0.8} />

        <DetailsCard.Section
          title={actionCardData.window}
          content={actionCardData.text}
        />

        {actionCardData.flavorText && (
          <>
            <Divider c="gray.7" opacity={0.8} />
            <Text size="sm" c="yellow.3" fs="italic" lh={1.5}>
              {actionCardData.flavorText}
            </Text>
          </>
        )}
      </Stack>
    </DetailsCard>
  );
}
