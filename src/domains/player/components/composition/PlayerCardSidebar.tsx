import type { ReactNode } from "react";
import { PlayerData } from "@/entities/data/types";
import { usePlayerCardComputedData } from "@/domains/player/components/PlayerCardShared/usePlayerCardComputedData";
import { getPlayerCardLayoutFields } from "@/domains/player/components/PlayerCardShared/getPlayerCardLayoutFields";
import { PlayerCardBox } from "@/domains/player/components/PlayerCardBox";
import { PlayerCardHeaderCompact } from "@/domains/player/components/PlayerCardHeader/PlayerCardHeaderCompact";
import { Breakthrough } from "@/domains/player/components/Breakthrough/Breakthrough";
import { PromissoryNote } from "@/domains/player/components/PromissoryNote";
import { Ability } from "@/domains/player/components/Ability";
import { Tech } from "@/domains/player/components/Tech";
import { Leaders } from "@/domains/player/components/Leaders";
import { ObjectivesRack } from "@/domains/player/components/PlayerCardShared/ObjectivesRack";
import { buildTechElementsForType, techCategories, getBreakthroughSynergy } from "@/domains/player/components/Tech/TechGridShared";
import { PlayerCardUnitsArea } from "@/domains/player/components/PlayerCardUnitsArea";
import { PlayerCardPlanetsArea } from "@/domains/player/components/PlayerCardPlanetsArea";
import { ResourceInfluenceCompact } from "@/domains/player/components/ResourceInfluenceTable";
import { StoresStrip } from "@/domains/player/components/PlayerCardShared/StoresStrip";
import { useSettingsStore } from "@/state/appStore";
import styles from "./PlayerCardSidebar.module.css";

type Props = {
  playerData: PlayerData;
};

function Block({
  label,
  meta,
  children,
}: {
  label: string;
  meta?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className={styles.blk}>
      <header className={styles.lbl}>
        <span>{label}</span>
        {meta !== undefined && <span>{meta}</span>}
      </header>
      {children}
    </section>
  );
}

/**
 * The Panels-view right dossier: the player deck's lanes as vertical labelled
 * blocks in lane order — loadout, stores, leaders, holdings, tech, units,
 * planets — with no sub-tabs to hunt through.
 */
export default function PlayerCardSidebar(props: Props) {
  const settings = useSettingsStore((state) => state.settings);
  const playerData = props.playerData;
  const player = getPlayerCardLayoutFields(playerData);
  const {
    factionImageUrl: factionUrl,
    planetEconomics,
    filteredTechs,
    allNotResearchedFactionTechs,
    promissoryNotes,
    mahactEdict,
  } = usePlayerCardComputedData(playerData);
  const { synergy, breakthroughUnlocked } = getBreakthroughSynergy(playerData.breakthrough);
  const breakthrough = playerData.breakthrough;
  const showLoadout = settings.showPlayerAreaFactionAbilities;
  const techs = techCategories.flatMap((techType) =>
    buildTechElementsForType(
      techType,
      filteredTechs,
      playerData.exhaustedTechs ?? [],
      undefined,
      breakthrough,
    ),
  );
  const secretsScored = Object.keys(player.secretsScored ?? {}).length;
  const unitsOnBoard = Object.values(player.unitCounts ?? {}).reduce(
    (sum, unit) => sum + (unit.deployedCount ?? 0),
    0,
  );

  return (
    <PlayerCardBox color={player.color} isActive={player.active}>
      <PlayerCardHeaderCompact
        userName={player.userName}
        faction={player.faction}
        factionDisplayName={player.factionDisplayName}
        color={player.color}
        factionImageUrl={factionUrl ?? ""}
        isSpeaker={player.isSpeaker}
        isTyrant={player.isTyrant}
        scs={player.scs}
        exhaustedSCs={player.exhaustedSCs}
        passed={player.passed}
        active={player.active}
      />

      <div className={styles.scroll}>
        <Block label="Loadout">
          <div className={styles.two}>
            {breakthrough?.breakthroughId && (
              <Breakthrough
                breakthroughId={breakthrough.breakthroughId}
                exhausted={breakthrough.exhausted}
                tradeGoodsStored={breakthrough.tradeGoodsStored}
                unlocked={breakthrough.unlocked ?? false}
              />
            )}
            {showLoadout &&
              (player.customPromissoryNotes ?? []).map((pnId) => (
                <PromissoryNote key={pnId} promissoryNoteId={pnId} />
              ))}
            {showLoadout &&
              (player.abilities ?? []).map((abilityId) => (
                <Ability key={abilityId} id={abilityId} />
              ))}
            {showLoadout &&
              allNotResearchedFactionTechs.map((techId) => (
                <Tech
                  key={techId}
                  techId={techId}
                  synergy={synergy}
                  breakthroughUnlocked={breakthroughUnlocked}
                  unresearched={(player.notResearchedFactionTechs ?? []).includes(techId)}
                />
              ))}
          </div>
        </Block>

        <Block label="Stores" meta="hand · command">
          <StoresStrip
            tg={player.tg}
            commodities={player.commodities}
            commoditiesTotal={player.commoditiesTotal}
            acCount={player.acCount}
            pnCount={player.pnCount}
            fragments={player.fragments}
            debtTokens={player.debtTokens}
            tacticalCC={player.tacticalCC}
            fleetCC={player.fleetCC + (mahactEdict?.length ?? 0)}
            strategicCC={player.strategicCC}
            showCommandTokens={settings.showPlayerAreaCommandTokens}
          />
        </Block>

        <Block label="Leaders">
          <Leaders leaders={player.leaders} faction={player.faction} />
        </Block>

        <Block label="Holdings" meta={`${secretsScored} secrets scored`}>
          <ObjectivesRack
            fluid
            secretsScored={player.secretsScored}
            knownUnscoredSecrets={player.knownUnscoredSecrets}
            soCount={player.soCount}
            promissoryNotes={promissoryNotes}
            relics={player.relics}
            exhaustedRelics={player.exhaustedRelics}
          />
        </Block>

        <Block label="Tech" meta={techs.length}>
          <div className={styles.two}>{techs}</div>
        </Block>

        <Block label="Units" meta={`${unitsOnBoard} on the board`}>
          <div className={styles.bays}>
            <PlayerCardUnitsArea
              playerData={playerData}
              color={player.color}
              faction={player.faction}
              showUnavailable
              condensed
              showUnitUpgrades={settings.showPlayerAreaUnitUpgrades}
            />
          </div>
        </Block>

        <Block label="Planets">
          <ResourceInfluenceCompact
            planetEconomics={planetEconomics}
            showTotalSpend={settings.showPlayerAreaTotalSpend}
          />
          <div className={styles.planets}>
            <PlayerCardPlanetsArea
              planets={player.planets}
              exhaustedPlanetAbilities={player.exhaustedPlanetAbilities}
              exhaustedPlanets={player.exhaustedPlanets}
            />
          </div>
        </Block>
      </div>
    </PlayerCardBox>
  );
}
