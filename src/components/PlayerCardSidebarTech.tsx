import { Stack, SimpleGrid } from "@mantine/core";
import { DynamicTechGrid } from "./PlayerArea/Tech/DynamicTechGrid";
import { UnitCard } from "./PlayerArea/UnitCard";
import { PlayerCardBox } from "./PlayerCardBox";
import { PlayerData } from "../data/types";
import { getUnitAsyncId, isUnitUpgradedOrWarSun } from "@/lookup/units";
import { getFactionImage } from "@/lookup/factions";
import { PlayerCardHeaderCompact } from "./PlayerArea/PlayerCardHeader/PlayerCardHeaderCompact";
import { Breakthrough } from "./PlayerArea";
import Caption from "./shared/Caption/Caption";

type Props = {
  playerData: PlayerData;
};

export default function PlayerCardSidebarTech(props: Props) {
  const {
    userName,
    faction,
    color,
    techs,
    unitsOwned,
    factionImage,
    factionImageType,
  } = props.playerData;
  const upgradedUnits = unitsOwned.filter(isUnitUpgradedOrWarSun);
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

      <Stack gap="xs">
        <Stack gap="xs">
          <DynamicTechGrid
            techs={techs}
            exhaustedTechs={props.playerData.exhaustedTechs}
          />
        </Stack>

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

        {/* Units Section - Only show upgraded units */}
        {upgradedUnits.length > 0 && (
          <SimpleGrid cols={4} spacing="8px">
            {upgradedUnits.map((unitId, index) => {
              const asyncId = getUnitAsyncId(unitId);
              const deployedCount = asyncId
                ? (props.playerData.unitCounts[asyncId].deployedCount ?? 0)
                : 0;

              return (
                <UnitCard
                  key={index}
                  unitId={unitId}
                  color={color}
                  deployedCount={deployedCount}
                  compact
                />
              );
            })}
          </SimpleGrid>
        )}
      </Stack>
    </PlayerCardBox>
  );
}
