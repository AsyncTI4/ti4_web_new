import { Stack, Box, SimpleGrid, Group } from "@mantine/core";
import { FragmentsPool } from "./PlayerArea/FragmentsPool";
import { ScoredSecrets } from "./PlayerArea/ScoredSecrets";
import { PromissoryNotesStack } from "./PlayerArea/PromissoryNotesStack";
import { PlayerCardCounts } from "./PlayerArea/PlayerCardCounts";
import { CCPool } from "./PlayerArea/CCPool";
import { PlayerCardBox } from "./PlayerCardBox";
import { PlayerData } from "../data/types";
import { Leaders } from "./PlayerArea/Leaders";
import { getFactionImage } from "@/lookup/factions";
import { Relic } from "./PlayerArea/Relic";
import { PlayerCardHeaderCompact } from "./PlayerArea/PlayerCardHeader/PlayerCardHeaderCompact";
import { Breakthrough } from "./PlayerArea";
import Caption from "./shared/Caption/Caption";

type Props = {
  playerData: PlayerData;
};

export default function PlayerCardSidebarComponents(props: Props) {
  const {
    userName,
    faction,
    color,
    tacticalCC,
    fleetCC,
    strategicCC,
    fragments,
    relics,
    secretsScored,
    leaders,
    factionImage,
    factionImageType,
  } = props.playerData;
  const promissoryNotes = props.playerData.promissoryNotesInPlayArea || [];
  const factionUrl = getFactionImage(faction, factionImage, factionImageType);
  return (
    <PlayerCardBox color={color} faction={faction}>
      <PlayerCardHeaderCompact
        userName={userName}
        faction={faction}
        color={color}
        factionImageUrl={factionUrl}
        variant="compact"
        showStrategyCards={false}
      />

      <SimpleGrid cols={2} spacing="xs">
        <Stack gap={8}>
          <Group gap={2}>
            <PlayerCardCounts
              tg={props.playerData.tg || 0}
              commodities={props.playerData.commodities || 0}
              commoditiesTotal={props.playerData.commoditiesTotal || 0}
              pnCount={props.playerData.pnCount || 0}
              acCount={props.playerData.acCount || 0}
            />

            <CCPool
              tacticalCC={tacticalCC}
              fleetCC={fleetCC}
              strategicCC={strategicCC}
              mahactEdict={props.playerData.mahactEdict}
            />

            <FragmentsPool fragments={fragments} />
          </Group>
          <ScoredSecrets
            secretsScored={secretsScored}
            unscoredSecrets={props.playerData.soCount || 0}
          />
        </Stack>
        <Stack gap={8}>
          <Leaders leaders={leaders} faction={faction} />
          {props.playerData.breakthrough?.breakthroughId && (
            <Stack gap={4}>
              <Caption size="xs">Breakthrough</Caption>
              <Breakthrough
                breakthroughId={props.playerData.breakthrough.breakthroughId}
                exhausted={props.playerData.breakthrough.exhausted}
                tradeGoodsStored={
                  props.playerData.breakthrough.tradeGoodsStored
                }
                unlocked={props.playerData.breakthrough.unlocked ?? false}
              />
            </Stack>
          )}
          {relics.map((relicId, index) => (
            <Relic
              key={index}
              relicId={relicId}
              isExhausted={
                props.playerData.exhaustedRelics?.includes(relicId) ?? false
              }
            />
          ))}
          <PromissoryNotesStack promissoryNotes={promissoryNotes} />
        </Stack>
      </SimpleGrid>
    </PlayerCardBox>
  );
}
