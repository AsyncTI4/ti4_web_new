import { Stack, Image, Divider } from "@mantine/core";
import { leaders } from "@/entities/data/leaders";
import { DetailsCard } from "@/shared/ui/DetailsCard";
import { showLeader } from "./Leader/showLeader";
import { useIsTwilightsFallMode } from "@/hooks/useIsTwilightsFallMode";

type Props = {
  leaderId: string;
};

export function LeaderDetailsCard({ leaderId }: Props) {
  const leaderData = getLeaderData(leaderId);
  const isTwilightsFallMode = useIsTwilightsFallMode();

  if (!leaderData) return null;

  const displayName =
    (isTwilightsFallMode && leaderData.tfName) || leaderData.name;
  const displayTitle =
    (isTwilightsFallMode && leaderData.tfTitle) || leaderData.title;
  const displayAbilityWindow =
    (isTwilightsFallMode && leaderData.tfAbilityWindow) ||
    leaderData.abilityWindow;
  const displayAbilityText =
    (isTwilightsFallMode && leaderData.tfAbilityText) || leaderData.abilityText;

  const renderLeaderIcon = () => {
    if (showLeader(leaderData.source)) {
      return (
        <Image src={`/leaders/${leaderId}.webp`} w={60} h={80} radius="50%" />
      );
    }
    return <></>;
  };

  return (
    <DetailsCard width={320}>
      <Stack gap="md">
        {/* Header with image and basic info */}
        <DetailsCard.Title
          title={displayName}
          subtitle={displayTitle}
          icon={<DetailsCard.Icon icon={renderLeaderIcon()} />}
          caption={leaderData.type}
        />

        <Divider c="gray.7" opacity={0.8} />

        <DetailsCard.Section
          title="Unlock Condition"
          content={leaderData.unlockCondition}
        />

        <Divider c="gray.7" opacity={0.8} />

        <DetailsCard.Section
          title={displayAbilityWindow}
          content={displayAbilityText}
        />
      </Stack>
    </DetailsCard>
  );
}

// Helper function to get leader data by ID
const getLeaderData = (leaderId: string) => {
  return leaders.find((leader) => leader.id === leaderId);
};
