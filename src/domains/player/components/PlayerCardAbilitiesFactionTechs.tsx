import { Group, Box, Stack } from "@mantine/core";
import { getAbility } from "@/entities/lookup/abilities";
import { Ability } from "./Ability";
import { Tech } from "./Tech";
import { Breakthrough } from "./Breakthrough/Breakthrough";
import { PromissoryNote } from "./PromissoryNote";
import Caption from "@/shared/ui/Caption/Caption";
import { getBreakthroughData } from "@/entities/lookup/breakthroughs";
import type { BreakthroughData } from "@/entities/data/types";

type PlayerCardAbilitiesFactionTechsProps = {
  abilities?: string[];
  notResearchedFactionTechs?: string[];
  customPromissoryNotes?: string[];
  gap?: number | string;
  breakthrough?: BreakthroughData;
  className?: string;
  showFactionAbilities?: boolean;
};

function useBreakthroughValues(breakthrough?: BreakthroughData) {
  const breakthroughData = breakthrough?.breakthroughId
    ? getBreakthroughData(breakthrough.breakthroughId)
    : undefined;

  return {
    synergy: breakthroughData?.synergy,
    breakthroughUnlocked: breakthrough?.unlocked ?? false,
  };
}

export function PlayerCardAbilitiesFactionTechsMobile({
  abilities = [],
  notResearchedFactionTechs = [],
  customPromissoryNotes = [],
  gap = 2,
  breakthrough,
  className,
  showFactionAbilities = true,
}: PlayerCardAbilitiesFactionTechsProps) {
  const { synergy, breakthroughUnlocked } = useBreakthroughValues(breakthrough);

  return (
    <Group gap="md" wrap="wrap" align="center" className={className}>
      {breakthrough?.breakthroughId && (
        <Group gap={gap}>
          <Breakthrough
            breakthroughId={breakthrough.breakthroughId}
            exhausted={breakthrough.exhausted}
            tradeGoodsStored={breakthrough.tradeGoodsStored}
            unlocked={breakthrough.unlocked ?? false}
            strong={false}
          />
        </Group>
      )}
      {showFactionAbilities && abilities.length > 0 && (
        <Group gap={gap}>
          {abilities.map((abilityId, index) => {
            const abilityData = getAbility(abilityId);
            if (!abilityData) return null;
            return <Ability id={abilityId} key={index} strong={false} />;
          })}
        </Group>
      )}
      {showFactionAbilities && customPromissoryNotes.length > 0 && (
        <Group gap={gap}>
          {customPromissoryNotes.map((pnId) => (
            <PromissoryNote promissoryNoteId={pnId} key={pnId} />
          ))}
        </Group>
      )}
      {showFactionAbilities && notResearchedFactionTechs.length > 0 && (
        <Group gap={gap}>
          {notResearchedFactionTechs.map((techId) => (
            <Tech
              techId={techId}
              key={techId}
              synergy={synergy}
              breakthroughUnlocked={breakthroughUnlocked}
            />
          ))}
        </Group>
      )}
    </Group>
  );
}

export function PlayerCardAbilitiesFactionTechs({
  abilities = [],
  notResearchedFactionTechs = [],
  customPromissoryNotes = [],
  gap = 2,
  breakthrough,
  showFactionAbilities = true,
}: PlayerCardAbilitiesFactionTechsProps) {
  const { synergy, breakthroughUnlocked } = useBreakthroughValues(breakthrough);

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
      {showFactionAbilities && abilities.length > 0 && (
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
      {showFactionAbilities && customPromissoryNotes.length > 0 && (
        <Stack gap={4}>
          <Caption size="xs">Promissory Notes</Caption>
          <Group gap={gap}>
            {customPromissoryNotes.map((pnId) => (
              <PromissoryNote promissoryNoteId={pnId} key={pnId} />
            ))}
          </Group>
        </Stack>
      )}
      {showFactionAbilities && notResearchedFactionTechs.length > 0 && (
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
                <Tech
                  techId={techId}
                  synergy={synergy}
                  breakthroughUnlocked={breakthroughUnlocked}
                />
              </Box>
            ))}
          </Group>
        </Stack>
      )}
    </Group>
  );
}
