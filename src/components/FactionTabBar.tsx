import { Box, Group, Image, Text } from "@mantine/core";
import { IconFlask, IconComponents } from "@tabler/icons-react";
import { cdnImage } from "../data/cdnImage";
import classes from "./FactionTabBar.module.css";
import { AreaType } from "@/hooks/useTabsAndTooltips";

type FactionTabBarProps = {
  playerData: Array<{
    color: string;
    faction: string;
  }>;
  selectedArea: AreaType;
  activeArea: AreaType;
  onAreaSelect: (area: AreaType) => void;
  onAreaMouseEnter: (area: AreaType) => void;
  onAreaMouseLeave: () => void;
};

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
        {playerData.map((player) => {
          const isActive =
            activeArea?.type === "faction" &&
            activeArea.faction === player.faction;
          const isPinned =
            selectedArea?.type === "faction" &&
            selectedArea.faction === player.faction;

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
                src={cdnImage(`/factions/${player.faction}.png`)}
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
            </Box>
          );
        })}

        {/* TECH Button */}
        <Box
          onClick={() =>
            onAreaSelect(
              selectedArea?.type === "tech" ? null : { type: "tech" }
            )
          }
          onMouseEnter={() => onAreaMouseEnter({ type: "tech" })}
          onMouseLeave={() => onAreaMouseLeave()}
          className={`${classes.tab} ${classes.btnTab} ${classes.btnLeft} ${
            selectedArea?.type === "tech"
              ? classes.pinned
              : activeArea?.type === "tech"
                ? classes.active
                : ""
          }`}
        >
          <IconFlask
            size={16}
            className={`${classes.icon} ${classes.iconTech} ${
              selectedArea?.type === "tech"
                ? classes.iconPinned
                : activeArea?.type === "tech"
                  ? classes.iconActive
                  : ""
            }`}
          />
          <Text
            className={`${classes.text} ${classes.textTech} ${
              selectedArea?.type === "tech"
                ? classes.textPinned
                : activeArea?.type === "tech"
                  ? classes.textActive
                  : ""
            }`}
          >
            TECH
          </Text>
        </Box>

        {/* COMPONENTS Button */}
        <Box
          onClick={() =>
            onAreaSelect(
              selectedArea?.type === "components"
                ? null
                : { type: "components" }
            )
          }
          onMouseEnter={() => onAreaMouseEnter({ type: "components" })}
          onMouseLeave={() => onAreaMouseLeave()}
          className={`${classes.tab} ${classes.btnTab} ${classes.btnRight} ${
            selectedArea?.type === "components"
              ? classes.pinned
              : activeArea?.type === "components"
                ? classes.active
                : ""
          }`}
        >
          <IconComponents
            size={16}
            className={`${classes.icon} ${classes.iconComp} ${
              selectedArea?.type === "components"
                ? classes.iconPinned
                : activeArea?.type === "components"
                  ? classes.iconActive
                  : ""
            }`}
          />
          <Text
            className={`${classes.text} ${classes.textComp} ${
              selectedArea?.type === "components"
                ? classes.textPinned
                : activeArea?.type === "components"
                  ? classes.textActive
                  : ""
            }`}
          >
            PARTS
          </Text>
        </Box>
      </Group>
    </Box>
  );
}
