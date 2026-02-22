import { Stack, Divider } from "@mantine/core";
import { getAbility } from "@/entities/lookup/abilities";
import { DetailsCard } from "@/shared/ui/DetailsCard";

type Props = {
  abilityId: string;
};

export function AbilityDetailsCard({ abilityId }: Props) {
  const ability = getAbility(abilityId);

  if (!ability) return null;

  return (
    <DetailsCard width={320} color="purple">
      <Stack gap="md">
        <DetailsCard.Title
          title={ability.name}
          subtitle={
            ability.permanentEffect ? "Passive Ability" : "Active Ability"
          }
        />

        {ability.permanentEffect && (
          <>
            <Divider c="gray.7" opacity={0.8} />
            <DetailsCard.Section
              title="PERMANENT EFFECT"
              content={ability.permanentEffect}
            />
          </>
        )}

        {ability.window && (
          <>
            <Divider c="gray.7" opacity={0.8} />
            <DetailsCard.Section
              title="TIMING WINDOW"
              content={ability.window}
            />
          </>
        )}

        {ability.windowEffect && (
          <>
            <Divider c="gray.7" opacity={0.8} />
            <DetailsCard.Section
              title="EFFECT"
              content={ability.windowEffect}
            />
          </>
        )}
      </Stack>
    </DetailsCard>
  );
}
