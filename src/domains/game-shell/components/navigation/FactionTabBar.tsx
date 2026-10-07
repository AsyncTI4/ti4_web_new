import { Box, Group } from "@mantine/core";
import cx from "clsx";
import { FactionIcon } from "@/shared/ui/FactionIcon";
import classes from "./FactionTabBar.module.css";
import type { AreaType } from "@/hooks/useTabsAndTooltips";
import type { PlayerData } from "@/entities/data/types";
import { filterPlayersWithAssignedFaction } from "@/entities/game/playerUtils";

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
        {filterPlayersWithAssignedFaction(playerData).map((player) => {
          const isActive =
            activeArea?.type === "faction" &&
            activeArea.faction === player.faction;
          const isPinned =
            selectedArea?.type === "faction" &&
            selectedArea.faction === player.faction;
          const area: AreaType = {
            type: "faction",
            faction: player.faction,
            coords: { x: 0, y: 0 },
          };

          return (
            <Box
              key={player.color}
              onClick={() => onAreaSelect(area)}
              onMouseEnter={() => onAreaMouseEnter(area)}
              onMouseLeave={onAreaMouseLeave}
              className={cx(
                classes.tab,
                isPinned ? classes.pinned : isActive && classes.active,
              )}
            >
              <FactionIcon
                faction={player.faction}
                factionImageOverride={player.factionImage}
                factionImageTypeOverride={player.factionImageType}
                alt={player.faction}
                w={24}
                h={24}
                className={cx(
                  classes.img,
                  isPinned ? classes.imgPinned : isActive && classes.imgActive,
                )}
              />
              {player.active && (
                <Box className={classes.activePlayerIndicator} />
              )}
            </Box>
          );
        })}
      </Group>
    </Box>
  );
}
