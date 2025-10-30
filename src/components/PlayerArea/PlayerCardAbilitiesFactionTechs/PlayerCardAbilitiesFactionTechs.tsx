import { Group, Box } from "@mantine/core";
import { getAbility } from "@/lookup/abilities";
import { Ability } from "../Ability";
import { Tech } from "../Tech";

type PlayerCardAbilitiesFactionTechsProps = {
  abilities?: string[];
  notResearchedFactionTechs?: string[];
  variant?: "compact" | "mobile";
  gap?: number | string;
};

export function PlayerCardAbilitiesFactionTechs({
  abilities = [],
  notResearchedFactionTechs = [],
  variant = "compact",
  gap = 2,
}: PlayerCardAbilitiesFactionTechsProps) {
  const isMobile = variant === "mobile";

  if (isMobile) {
    return (
      <Group gap="xs" wrap="wrap" align="center" mb="lg" mt="xs">
        {abilities.length > 0 && (
          <Group gap={gap}>
            {abilities.map((abilityId, index) => {
              const abilityData = getAbility(abilityId);
              if (!abilityData) return null;
              return <Ability id={abilityId} key={index} />;
            })}
          </Group>
        )}
        {notResearchedFactionTechs.length > 0 && (
          <Group gap={gap}>
            {notResearchedFactionTechs.map((techId) => (
              <Tech techId={techId} key={techId} />
            ))}
          </Group>
        )}
      </Group>
    );
  }

  return (
    <Group wrap="initial" gap={gap} mb="md" mt="xs">
      <Group gap={gap}>
        {abilities.map((abilityId, index) => {
          const abilityData = getAbility(abilityId);
          if (!abilityData) {
            console.log("Could not find ability", abilityId);
            return null;
          }
          return (
            <Box
              key={index}
              style={{
                flexShrink: 1,
                minWidth: 0,
                overflow: "hidden",
              }}
            >
              <Ability id={abilityId} />
            </Box>
          );
        })}
      </Group>
      <div style={{ flex: 1 }} />
      {notResearchedFactionTechs.length > 0 && (
        <Group gap={gap} style={{ flexShrink: 1 }}>
          {notResearchedFactionTechs.map((techId, index) => (
            <Box
              key={index}
              style={{
                filter: "grayscale(0.5)",
              }}
            >
              <Tech techId={techId} />
            </Box>
          ))}
        </Group>
      )}
    </Group>
  );
}

