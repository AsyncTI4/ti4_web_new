import { Box, Group, Image, Text } from "@mantine/core";
import { IconFlask, IconHandStop, IconTank } from "@tabler/icons-react";
import { ReactNode } from "react";
import { cdnImage } from "../data/cdnImage";
import classes from "./FactionTabBar.module.css";
import { AreaType } from "@/hooks/useTabsAndTooltips";
import { PlayerData } from "@/data/types";

type FactionTabBarProps = {
  playerData: PlayerData[];
  selectedArea: AreaType;
  activeArea: AreaType;
  onAreaSelect: (area: AreaType) => void;
  onAreaMouseEnter: (area: AreaType) => void;
  onAreaMouseLeave: () => void;
};

type TabButtonProps = {
  icon: ReactNode;
  text: string;
  areaType: "tech" | "components" | "strength";
  iconClass: string;
  textClass: string;
  buttonPositionClass?: string;
  selectedArea: AreaType;
  activeArea: AreaType;
  onAreaSelect: (area: AreaType) => void;
  onAreaMouseEnter: (area: AreaType) => void;
  onAreaMouseLeave: () => void;
};

function TabButton({
  icon,
  text,
  areaType,
  iconClass,
  textClass,
  buttonPositionClass = "",
  selectedArea,
  activeArea,
  onAreaSelect,
  onAreaMouseEnter,
  onAreaMouseLeave,
}: TabButtonProps) {
  const isPinned = selectedArea?.type === areaType;
  const isActive = activeArea?.type === areaType;

  return (
    <Box
      onClick={() => onAreaSelect(isPinned ? null : { type: areaType })}
      onMouseEnter={() => onAreaMouseEnter({ type: areaType })}
      onMouseLeave={() => onAreaMouseLeave()}
      className={`${classes.tab} ${classes.btnTab} ${buttonPositionClass} ${
        isPinned ? classes.pinned : isActive ? classes.active : ""
      }`}
    >
      <Box
        className={`${classes.icon} ${iconClass} ${
          isPinned ? classes.iconPinned : isActive ? classes.iconActive : ""
        }`}
      >
        {icon}
      </Box>
      <Text
        className={`${classes.text} ${textClass} ${
          isPinned ? classes.textPinned : isActive ? classes.textActive : ""
        }`}
      >
        {text}
      </Text>
    </Box>
  );
}

export function FactionTabBar({
  playerData,
  selectedArea,
  activeArea,
  onAreaSelect,
  onAreaMouseEnter,
  onAreaMouseLeave,
}: FactionTabBarProps) {
  return (
    <Box className={classes.factionTabBar}>
      <Group gap={0} justify="center" wrap="wrap">
        {playerData
          .filter((p) => p.faction !== "null")
          .map((player) => {
            const isActive =
              activeArea?.type === "faction" &&
              activeArea.faction === player.faction;
            const isPinned =
              selectedArea?.type === "faction" &&
              selectedArea.faction === player.faction;
            const isActivePlayer = player.active;
            const factionUrl = (
              player.factionImageType === "DISCORD"
                ? player.factionImage!
                : cdnImage(`/factions/${player.faction}.png`)
            )!;

            return (
              <Box
                key={player.color}
                onClick={() =>
                  onAreaSelect({
                    type: "faction",
                    faction: player.faction,
                    coords: { x: 0, y: 0 },
                  })
                }
                onMouseEnter={() =>
                  onAreaMouseEnter({
                    type: "faction",
                    faction: player.faction,
                    coords: { x: 0, y: 0 },
                  })
                }
                onMouseLeave={() => onAreaMouseLeave()}
                className={`${classes.tab} ${
                  isPinned ? classes.pinned : isActive ? classes.active : ""
                }`}
              >
                <Image
                  src={factionUrl}
                  alt={player.faction}
                  w={24}
                  h={24}
                  className={`${classes.img} ${
                    isPinned
                      ? classes.imgPinned
                      : isActive
                        ? classes.imgActive
                        : ""
                  }`}
                />
                {isActivePlayer && (
                  <Box className={classes.activePlayerIndicator} />
                )}
              </Box>
            );
          })}

        {/* Temporarily hidden */}
        {/* <TabButton
          icon={<IconFlask size={16} />}
          text="TECH"
          areaType="tech"
          iconClass={classes.iconTech}
          textClass={classes.textTech}
          buttonPositionClass={classes.btnLeft}
          selectedArea={selectedArea}
          activeArea={activeArea}
          onAreaSelect={onAreaSelect}
          onAreaMouseEnter={onAreaMouseEnter}
          onAreaMouseLeave={onAreaMouseLeave}
        /> */}

        {/* Temporarily hidden */}
        {/* <TabButton
          icon={<IconHandStop size={16} />}
          text="HAND"
          areaType="components"
          iconClass={classes.iconComp}
          textClass={classes.textComp}
          buttonPositionClass={classes.btnRight}
          selectedArea={selectedArea}
          activeArea={activeArea}
          onAreaSelect={onAreaSelect}
          onAreaMouseEnter={onAreaMouseEnter}
          onAreaMouseLeave={onAreaMouseLeave}
        /> */}

        {/* Temporarily hidden */}
        {/* <TabButton
          icon={<IconTank size={16} />}
          text="Strength"
          areaType="strength"
          iconClass={classes.iconTech}
          textClass={classes.textTech}
          buttonPositionClass={classes.btnLeft}
          selectedArea={selectedArea}
          activeArea={activeArea}
          onAreaSelect={onAreaSelect}
          onAreaMouseEnter={onAreaMouseEnter}
          onAreaMouseLeave={onAreaMouseLeave}
        /> */}
      </Group>
    </Box>
  );
}
