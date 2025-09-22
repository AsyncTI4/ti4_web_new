import { Group, Text, Stack, Box, Image } from "@mantine/core";
import { PlanetCard } from "./PlayerArea/PlanetCard";
import { PlayerColor } from "./PlayerArea/PlayerColor";
import { ResourceInfluenceCompact } from "./PlayerArea/ResourceInfluenceTable/ResourceInfluenceCompact";
import { PlayerData } from "../data/types";
import { getFactionImage } from "@/lookup/factions";
import { PlayerCardBox } from "./PlayerCardBox";
import { ArmyStats } from "./PlayerArea";
import layout from "./PlayerCardSidebarStrength.module.css";

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

  // Create planet economics object from pre-calculated values
  const planetEconomics = {
    total: {
      currentResources: props.playerData.resources,
      totalResources: props.playerData.totResources,
      currentInfluence: props.playerData.influence,
      totalInfluence: props.playerData.totInfluence,
    },
    optimal: {
      currentResources: props.playerData.optimalResources,
      totalResources: props.playerData.totOptimalResources,
      currentInfluence: props.playerData.optimalInfluence,
      totalInfluence: props.playerData.totOptimalInfluence,
    },
    flex: {
      currentFlex: props.playerData.flexValue,
      totalFlex: props.playerData.totFlexValue,
    },
  };

  return (
    <PlayerCardBox color={color} faction={faction}>
      <Group
        gap={4}
        px={4}
        w="100%"
        align="center"
        wrap="nowrap"
        justify="space-between"
        style={{ minWidth: 0 }}
      >
        <Group gap={4} style={{ minWidth: 0, flex: 1 }}>
          {/* Small circular faction icon */}
          <Image
            src={factionUrl}
            alt={faction}
            w={24}
            h={24}
            style={{
              filter:
                "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.8)) brightness(1.1)",
              flexShrink: 0,
            }}
          />
          <Text
            span
            c="white"
            size="sm"
            ff="heading"
            style={{
              textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
              flexShrink: 0, // Username has lowest priority for truncation
              minWidth: 0,
            }}
          >
            {userName}
          </Text>
          <Text
            size="xs"
            span
            ml={4}
            opacity={0.9}
            c="white"
            ff="heading"
            style={{
              textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
              flexShrink: 1, // Faction has medium priority for truncation
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
              minWidth: 0,
            }}
          >
            [{faction}]
          </Text>
          <Box style={{ flexShrink: 2 }}>
            {" "}
            {/* Color has highest priority for truncation/hiding */}
            <PlayerColor color={color} size="sm" />
          </Box>
        </Group>
      </Group>

      <div className={layout.strengthRow}>
        <div className={layout.box} style={{ flex: "0 0 auto" }}>
          <ResourceInfluenceCompact planetEconomics={planetEconomics} />
        </div>

        <div className={`${layout.box} ${layout.planetCardsBox}`}>
          <div className={layout.planetCards}>
            {planets.map((planetId, index) => (
              <PlanetCard
                key={index}
                planetId={planetId}
                legendaryAbilityExhausted={exhaustedPlanetAbilities.includes(
                  planetId
                )}
              />
            ))}
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
