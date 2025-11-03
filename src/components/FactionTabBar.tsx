import { Box, Group, Image } from "@mantine/core";
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
      </Group>
    </Box>
  );
}
