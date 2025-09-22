import { Group, Stack } from "@mantine/core";
import { Ability } from "./Ability";
import { getAbility } from "@/lookup/abilities";
import { Tech } from "./Tech";

interface FactionAbilitiesTechsProps {
  abilities: string[] | undefined;
  factionTechs: string[] | undefined;
  notResearchedFactionTechs: string[];
}

export default function FactionAbilitiesTechs({
  abilities,
  notResearchedFactionTechs,
  factionTechs,
}: FactionAbilitiesTechsProps) {
  const researchedFactionTechs = factionTechs?.filter(
    (techId) => !notResearchedFactionTechs.includes(techId)
  );
  return (
    <Stack gap={4} my="xs">
      <Group gap={4} wrap="wrap" align="center">
        {abilities?.map((abilityId, index) => {
          const abilityData = getAbility(abilityId);
          if (!abilityData) {
            console.log("Could not find ability", abilityId);
            return null;
          }

          return <Ability id={abilityId} key={index} />;
        })}
      </Group>
      <Group gap={4} wrap="wrap" align="center">
        {researchedFactionTechs?.map((techId, index) => (
          <Tech techId={techId} key={index} />
        ))}
        {notResearchedFactionTechs?.length > 0 &&
          notResearchedFactionTechs.map((techId) => (
            <Tech techId={techId} key={techId} />
          ))}
      </Group>
    </Stack>
  );
}
