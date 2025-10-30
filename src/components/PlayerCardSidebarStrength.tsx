import { Stack, Box } from "@mantine/core";
import { ResourceInfluenceCompact } from "./PlayerArea/ResourceInfluenceTable/ResourceInfluenceCompact";
import { PlayerData } from "../data/types";
import { getFactionImage } from "@/lookup/factions";
import { PlayerCardBox } from "./PlayerCardBox";
import { ArmyStats } from "./PlayerArea";
import layout from "./PlayerCardSidebarStrength.module.css";
import { PlayerCardHeaderCompact } from "./PlayerArea/PlayerCardHeader/PlayerCardHeaderCompact";
import { PlayerCardPlanetsArea } from "./PlayerArea/PlayerCardPlanetsArea";
import { usePlanetEconomics } from "@/hooks/usePlanetEconomics";

type Props = {
  playerData: PlayerData;
};

export default function PlayerCardSidebarStrength(props: Props) {
  const {
    userName,
    faction,
    color,
    planets,
    spaceArmyCombat,
    groundArmyCombat,
    spaceArmyHealth,
    groundArmyHealth,
    spaceArmyRes,
    groundArmyRes,
    factionImage,
    factionImageType,
  } = props.playerData;
  const factionUrl = getFactionImage(faction, factionImage, factionImageType);

  const exhaustedPlanetAbilities =
    props.playerData.exhaustedPlanetAbilities || [];
  const planetEconomics = usePlanetEconomics(props.playerData);

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

      <div className={layout.strengthRow}>
        <div className={layout.box} style={{ flex: "0 0 auto" }}>
          <ResourceInfluenceCompact planetEconomics={planetEconomics} />
        </div>

        <div className={`${layout.box} ${layout.planetCardsBox}`}>
          <div className={layout.planetCards}>
            <PlayerCardPlanetsArea
              planets={planets}
              exhaustedPlanetAbilities={exhaustedPlanetAbilities}
            />
          </div>
        </div>

        <div className={layout.box} style={{ flex: "0 0 auto" }}>
          <ArmyStats
            stats={{
              spaceArmyRes,
              groundArmyRes,
              spaceArmyHealth,
              groundArmyHealth,
              spaceArmyCombat,
              groundArmyCombat,
            }}
          />
        </div>
      </div>
    </PlayerCardBox>
  );
}
