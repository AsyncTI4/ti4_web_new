import { Group, Stack } from "@mantine/core";
import { Ability } from "./Ability";
import { getAbility } from "@/entities/lookup/abilities";
import { Tech } from "./Tech";
import { Breakthrough } from "./Breakthrough/Breakthrough";
import { PromissoryNote } from "./PromissoryNote";
import Caption from "@/shared/ui/Caption/Caption";
import { getBreakthroughData } from "@/entities/lookup/breakthroughs";
import type { BreakthroughData } from "@/entities/data/types";

interface FactionAbilitiesTechsProps {
  abilities: string[] | undefined;
  factionTechs: string[] | undefined;
  notResearchedFactionTechs: string[];
  customPromissoryNotes?: string[];
  breakthrough?: BreakthroughData;
}

export default function FactionAbilitiesTechs({
  abilities,
  notResearchedFactionTechs,
  factionTechs,
  customPromissoryNotes,
  breakthrough,
}: FactionAbilitiesTechsProps) {
  const researchedFactionTechs = factionTechs?.filter(
    (techId) => !notResearchedFactionTechs.includes(techId)
  );

  const breakthroughData = breakthrough?.breakthroughId
    ? getBreakthroughData(breakthrough.breakthroughId)
    : undefined;
  const synergy = breakthroughData?.synergy;
  const breakthroughUnlocked = breakthrough?.unlocked ?? false;

  return (
    <Group gap="xs" wrap="wrap" align="center" mb="md" mt="xs">
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
      {abilities && abilities.length > 0 && (
        <Stack gap={4}>
          <Caption size="xs">Abilities</Caption>
          <Group gap={2}>
            {abilities.map((abilityId, index) => {
              const abilityData = getAbility(abilityId);
              if (!abilityData) return;
              return <Ability id={abilityId} key={index} />;
            })}
          </Group>
        </Stack>
      )}
      {customPromissoryNotes && customPromissoryNotes.length > 0 && (
        <Stack gap={4}>
          <Caption size="xs">Promissory Notes</Caption>
          <Group gap={2}>
            {customPromissoryNotes.map((pnId) => (
              <PromissoryNote promissoryNoteId={pnId} key={pnId} />
            ))}
          </Group>
        </Stack>
      )}
      {(researchedFactionTechs?.length > 0 ||
        notResearchedFactionTechs?.length > 0) && (
        <Stack gap={4}>
          <Caption size="xs">Faction Techs</Caption>
          <Group gap={2}>
            {researchedFactionTechs?.map((techId, index) => (
              <Tech
                techId={techId}
                key={index}
                synergy={synergy}
                breakthroughUnlocked={breakthroughUnlocked}
              />
            ))}
            {notResearchedFactionTechs?.length > 0 &&
              notResearchedFactionTechs.map((techId) => (
                <Tech
                  techId={techId}
                  key={techId}
                  synergy={synergy}
                  breakthroughUnlocked={breakthroughUnlocked}
                />
              ))}
          </Group>
        </Stack>
      )}
    </Group>
  );
}
