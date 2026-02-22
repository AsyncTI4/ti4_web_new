import { Group, Box, Stack } from "@mantine/core";
import { getAbility } from "@/entities/lookup/abilities";
import { Ability } from "./Ability";
import { Tech } from "./Tech";
import { Breakthrough } from "./Breakthrough/Breakthrough";
import { PromissoryNote } from "./PromissoryNote";
import Caption from "@/shared/ui/Caption/Caption";
import type { BreakthroughData } from "@/entities/data/types";

type PlayerCardAbilitiesFactionTechsProps = {
  abilities?: string[];
  notResearchedFactionTechs?: string[];
  customPromissoryNotes?: string[];
  variant?: "compact" | "mobile";
  gap?: number | string;
  breakthrough?: BreakthroughData;
};

export function PlayerCardAbilitiesFactionTechs({
  abilities = [],
  notResearchedFactionTechs = [],
  customPromissoryNotes = [],
  variant = "compact",
  gap = 2,
  breakthrough,
}: PlayerCardAbilitiesFactionTechsProps) {
  const isMobile = variant === "mobile";

  if (isMobile) {
    return (
      <Group gap="xs" wrap="wrap" align="center" mb="xs" mt="md">
        {breakthrough?.breakthroughId && (
          <Breakthrough
            breakthroughId={breakthrough.breakthroughId}
            exhausted={breakthrough.exhausted}
            tradeGoodsStored={breakthrough.tradeGoodsStored}
            unlocked={breakthrough.unlocked ?? false}
            strong={false}
          />
        )}
        {abilities.length > 0 && (
          <Group gap={gap}>
            {abilities.map((abilityId, index) => {
              const abilityData = getAbility(abilityId);
              if (!abilityData) return null;
              return <Ability id={abilityId} key={index} strong={false} />;
            })}
          </Group>
        )}
        {customPromissoryNotes.length > 0 && (
          <Group gap={gap}>
            {customPromissoryNotes.map((pnId) => (
              <PromissoryNote
                promissoryNoteId={pnId}
                key={pnId}
                strong={false}
              />
            ))}
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
      {customPromissoryNotes.length > 0 && (
        <Stack gap={4}>
          <Caption size="xs">Promissory Notes</Caption>
          <Group gap={gap}>
            {customPromissoryNotes.map((pnId) => (
              <PromissoryNote promissoryNoteId={pnId} key={pnId} />
            ))}
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
