import { Group, Box, Stack } from "@mantine/core";
import { getAbility } from "@/entities/lookup/abilities";
import { Ability } from "./Ability";
import { Tech } from "./Tech";
import { Breakthrough } from "./Breakthrough/Breakthrough";
import { PromissoryNote } from "./PromissoryNote";
import Caption from "@/shared/ui/Caption/Caption";
import { getBreakthroughData } from "@/entities/lookup/breakthroughs";
import type { BreakthroughData } from "@/entities/data/types";
import rail from "./PlayerCardHeader/HeaderRail.module.css";

type PlayerCardAbilitiesFactionTechsProps = {
  abilities?: string[];
  notResearchedFactionTechs?: string[];
  customPromissoryNotes?: string[];
  gap?: number | string;
  breakthrough?: BreakthroughData;
  showFactionAbilities?: boolean;
  showBreakthrough?: boolean;
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

/*
 * Renders straight into the header rail — no wrapper of its own, so abilities,
 * promissory notes and faction techs are siblings of the breakthrough and
 * neighbour groups and get divided by the same hairline seam. The spacing lives
 * in HeaderRail.module.css; nothing here sets its own.
 */
export function PlayerCardAbilitiesFactionTechsMobile({
  abilities = [],
  notResearchedFactionTechs = [],
  customPromissoryNotes = [],
  breakthrough,
  showFactionAbilities = true,
  showBreakthrough = true,
}: PlayerCardAbilitiesFactionTechsProps) {
  const { synergy, breakthroughUnlocked } = useBreakthroughValues(breakthrough);

  return (
    <>
      {showBreakthrough && breakthrough?.breakthroughId && (
        <div className={rail.railGroup}>
          <Breakthrough
            breakthroughId={breakthrough.breakthroughId}
            exhausted={breakthrough.exhausted}
            tradeGoodsStored={breakthrough.tradeGoodsStored}
            unlocked={breakthrough.unlocked ?? false}
            strong={false}
          />
        </div>
      )}
      {showFactionAbilities && abilities.length > 0 && (
        <div className={rail.railGroup}>
          {abilities.map((abilityId, index) => {
            const abilityData = getAbility(abilityId);
            if (!abilityData) return null;
            return <Ability id={abilityId} key={index} strong={false} />;
          })}
        </div>
      )}
      {showFactionAbilities && customPromissoryNotes.length > 0 && (
        <div className={rail.railGroup}>
          {customPromissoryNotes.map((pnId) => (
            <PromissoryNote promissoryNoteId={pnId} key={pnId} />
          ))}
        </div>
      )}
      {showFactionAbilities && notResearchedFactionTechs.length > 0 && (
        <div className={rail.railGroup}>
          {notResearchedFactionTechs.map((techId) => (
            <Tech
              techId={techId}
              key={techId}
              synergy={synergy}
              breakthroughUnlocked={breakthroughUnlocked}
            />
          ))}
        </div>
      )}
    </>
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
