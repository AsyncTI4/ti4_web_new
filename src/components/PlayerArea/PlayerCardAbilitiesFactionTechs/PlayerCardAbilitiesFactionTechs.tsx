import { Group, Box, Stack } from "@mantine/core";
import { getAbility } from "@/lookup/abilities";
import { Ability } from "../Ability";
import { Tech } from "../Tech";
import { Breakthrough } from "../Breakthrough/Breakthrough";
import Caption from "../../shared/Caption/Caption";

type PlayerCardAbilitiesFactionTechsProps = {
  abilities?: string[];
  notResearchedFactionTechs?: string[];
  variant?: "compact" | "mobile";
  gap?: number | string;
  breakthrough?: {
    unlocked?: boolean;
    breakthroughId?: string;
    exhausted?: boolean;
    tradeGoodsStored?: number;
  };
};

export function PlayerCardAbilitiesFactionTechs({
  abilities = [],
  notResearchedFactionTechs = [],
  variant = "compact",
  gap = 2,
  breakthrough,
}: PlayerCardAbilitiesFactionTechsProps) {
  const isMobile = variant === "mobile";

  if (isMobile) {
    return (
      <Group gap="xs" wrap="wrap" align="center" mb="lg" mt="xs">
        {breakthrough?.breakthroughId && (
          <Stack gap={4}>
            <Caption size="xs">Breakthrough</Caption>
            <Breakthrough
              breakthroughId={breakthrough.breakthroughId}
              exhausted={breakthrough.exhausted}
              tradeGoodsStored={breakthrough.tradeGoodsStored}
              unlocked={breakthrough.unlocked ?? false}
            />
          </Stack>
        )}
        {abilities.length > 0 && (
          <Stack gap={4}>
            <Caption size="xs">Abilities</Caption>
            <Group gap={gap}>
              {abilities.map((abilityId, index) => {
                const abilityData = getAbility(abilityId);
                if (!abilityData) return null;
                return <Ability id={abilityId} key={index} />;
              })}
            </Group>
          </Stack>
        )}
        {notResearchedFactionTechs.length > 0 && (
          <Stack gap={4}>
            <Caption size="xs">Faction Techs</Caption>
            <Group gap={gap}>
              {notResearchedFactionTechs.map((techId) => (
                <Tech techId={techId} key={techId} />
              ))}
            </Group>
          </Stack>
        )}
      </Group>
    );
  }

  return (
    <Group wrap="wrap" gap="xs" mb="md" mt="xs" align="flex-start">
      {breakthrough?.breakthroughId && (
        <Stack gap={4}>
          <Caption size="xs">Breakthrough</Caption>
          <Breakthrough
            breakthroughId={breakthrough.breakthroughId}
            exhausted={breakthrough.exhausted}
            tradeGoodsStored={breakthrough.tradeGoodsStored}
            unlocked={breakthrough.unlocked ?? false}
          />
        </Stack>
      )}
      {abilities.length > 0 && (
        <Stack gap={4}>
          <Caption size="xs">Abilities</Caption>
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
        </Stack>
      )}
      {notResearchedFactionTechs.length > 0 && (
        <Stack gap={4}>
          <Caption size="xs">Faction Techs</Caption>
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
        </Stack>
      )}
    </Group>
  );
}
