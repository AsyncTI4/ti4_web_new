import { Group, Stack } from "@mantine/core";
import { Ability } from "./Ability";
import { getAbility } from "@/lookup/abilities";
import { Tech } from "./Tech";
import { Breakthrough } from "./Breakthrough/Breakthrough";
import { PromissoryNote } from "./PromissoryNote";
import Caption from "../shared/Caption/Caption";

interface FactionAbilitiesTechsProps {
  abilities: string[] | undefined;
  factionTechs: string[] | undefined;
  notResearchedFactionTechs: string[];
  customPromissoryNotes?: string[];
  breakthrough?: {
    unlocked?: boolean;
    breakthroughId?: string;
    exhausted?: boolean;
    tradeGoodsStored?: number;
  };
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
              <Tech techId={techId} key={index} />
            ))}
            {notResearchedFactionTechs?.length > 0 &&
              notResearchedFactionTechs.map((techId) => (
                <Tech techId={techId} key={techId} />
              ))}
          </Group>
        </Stack>
      )}
    </Group>
  );
}
