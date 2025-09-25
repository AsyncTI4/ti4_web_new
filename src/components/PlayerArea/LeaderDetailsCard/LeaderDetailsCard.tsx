import { Stack, Image, Divider } from "@mantine/core";
import { leaders } from "../../../data/leaders";
import { DetailsCard } from "@/components/shared/DetailsCard";

type Props = {
  leaderId: string;
};

export function LeaderDetailsCard({ leaderId }: Props) {
  const leaderData = getLeaderData(leaderId);

  if (!leaderData) return null;

  const renderLeaderIcon = () => {
    if (leaderData.source === "base" || leaderData.source === "pok") {
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
          title={leaderData.name}
          subtitle={leaderData.title}
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
          title={leaderData.abilityWindow}
          content={leaderData.abilityText}
        />
      </Stack>
    </DetailsCard>
  );
}

// Helper function to get leader data by ID
const getLeaderData = (leaderId: string) => {
  return leaders.find((leader) => leader.id === leaderId);
};
