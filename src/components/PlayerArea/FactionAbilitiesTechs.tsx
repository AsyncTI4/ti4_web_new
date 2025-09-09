import { Flex, Group } from "@mantine/core";
import { Ability } from "./Ability";
import { getAbility } from "@/lookup/abilities";
import { Tech } from "./Tech";

interface FactionAbilitiesTechsProps {
  abilities: string[] | undefined;
  notResearchedFactionTechs: string[];
}

export default function FactionAbilitiesTechs({
  abilities,
  notResearchedFactionTechs,
}: FactionAbilitiesTechsProps) {
  return (
    <Group gap={4} wrap="wrap" my="xs">
      {abilities?.map((abilityId, index) => {
        const abilityData = getAbility(abilityId);
        if (!abilityData) {
          console.log("Could not find ability", abilityId);
          return null;
        }

        return <Ability id={abilityId} key={index} />;
      })}

      <div style={{ flex: 1 }} />
      {notResearchedFactionTechs?.length > 0 &&
        notResearchedFactionTechs.map((techId) => (
          <Tech techId={techId} key={techId} />
        ))}
    </Group>
  );
}
