import { getAbility, getAbilityKind } from "@/entities/lookup/abilities";
import { DetailsCard } from "@/shared/ui/DetailsCard";
import { ABILITY_KIND_LABEL, AbilityMark } from "./AbilityMark";

type Props = {
  abilityId: string;
};

export function AbilityDetailsCard({ abilityId }: Props) {
  const ability = getAbility(abilityId);

  if (!ability) return null;

  const kind = getAbilityKind(ability);

  return (
    <DetailsCard width={340} color="violet">
      <DetailsCard.Title
        title={ability.name}
        type={`${ABILITY_KIND_LABEL[kind]} ability`}
        meta={[ability.faction]}
        icon={
          <DetailsCard.Icon shape="round" icon={<AbilityMark kind={kind} />} />
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
