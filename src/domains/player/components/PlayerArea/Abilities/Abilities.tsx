import { Group } from "@mantine/core";
import { Ability } from "../Ability/Ability";
import { getAbilitiesByFaction } from "@/entities/lookup/abilities";

type Props = {
  faction: string;
};

export function Abilities({ faction }: Props) {
  const factionAbilities = getAbilitiesByFaction(faction);

  if (factionAbilities.length === 0) {
    return null;
  }

  return (
    <Group gap={4} wrap="nowrap" style={{ minWidth: 0 }}>
      {factionAbilities.map((ability, index) => (
        <Ability key={index} id={ability.id} />
      ))}
    </Group>
  );
}
