import { LeaderPortraitImage } from "@/shared/ui/LeaderPortraitImage";
import { getLeaderById } from "@/entities/lookup/leaders";
import { DetailsCard } from "@/shared/ui/DetailsCard";
import { showLeader } from "@/entities/lookup/showLeader";
import { useIsTwilightsFallMode } from "@/hooks/useIsTwilightsFallMode";

type Props = {
  leaderId: string;
};

export function LeaderDetailsCard({ leaderId }: Props) {
  const leaderData = getLeaderById(leaderId);
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

  const portrait = showLeader(leaderData.source) ? (
    <DetailsCard.Icon
      shape="leader"
      icon={<LeaderPortraitImage leaderId={leaderId} />}
    />
  ) : undefined;

  return (
    <DetailsCard width={340} color="green">
      <DetailsCard.Title
        title={displayName}
        type={leaderData.type}
        meta={[displayTitle]}
        icon={portrait}
      />
      {leaderData.unlockCondition && (
        <DetailsCard.Section
          title="Unlocks"
          content={leaderData.unlockCondition}
        />
      )}
      <DetailsCard.Section
        title={displayAbilityWindow}
        content={displayAbilityText}
      />
    </DetailsCard>
  );
}
