import { IconHexagon } from "@tabler/icons-react";
import { getAbility } from "@/entities/lookup/abilities";
import { DetailsCard } from "@/shared/ui/DetailsCard";

type Props = {
  abilityId: string;
};

export function AbilityDetailsCard({ abilityId }: Props) {
  const ability = getAbility(abilityId);

  if (!ability) return null;

  return (
    <DetailsCard width={340} color="violet">
      <DetailsCard.Title
        title={ability.name}
        type="Faction ability"
        meta={[ability.faction, ability.permanentEffect ? "Passive" : null]}
        icon={
          <DetailsCard.Icon shape="round" icon={<IconHexagon stroke={1.6} />} />
        }
      />
      {ability.permanentEffect && (
        <DetailsCard.Section
          title="Permanent effect"
          content={ability.permanentEffect}
        />
      )}
      {ability.window && (
        <DetailsCard.Section title="Timing" content={ability.window} />
      )}
      {ability.windowEffect && (
        <DetailsCard.Section title="Effect" content={ability.windowEffect} />
      )}
    </DetailsCard>
  );
}
