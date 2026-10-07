import { Box, Group, Stack } from "@mantine/core";
import { StatusBadge } from "@/domains/player/components/StatusBadge";
import type { PlayerData } from "@/entities/data/types";
import { FactionIcon } from "@/shared/ui/FactionIcon";
import styles from "./FactionsInGame.module.css";
import { GeneralSectionTitle } from "../GeneralSectionTitle";

type Props = {
  playerData: PlayerData[];
};

function FactionsInGame({ playerData }: Props) {
  const sortedPlayerData = [...playerData].sort((a, b) => {
    const minScA = a.scs.length > 0 ? Math.min(...a.scs) : Infinity;
    const minScB = b.scs.length > 0 ? Math.min(...b.scs) : Infinity;
    return minScA - minScB;
  });

  const activePlayerIndex = sortedPlayerData.findIndex(
    (player) => player.active
  );
  const nextPlayerIndex =
    activePlayerIndex >= 0
      ? (activePlayerIndex + 1) % sortedPlayerData.length
      : -1;

  return (
    <Box>
      <GeneralSectionTitle>Factions in Game</GeneralSectionTitle>
      <Group gap="sm">
        {sortedPlayerData.map((player, index) => {
          const status = player.active
            ? "active"
            : index === nextPlayerIndex
              ? "next"
              : null;

          return (
            <Stack key={player.faction} gap="xs" align="center">
              <FactionIcon
                faction={player.faction}
                factionImageOverride={player.factionImage}
                factionImageTypeOverride={player.factionImageType}
                w={36}
                h={36}
                className={styles.factionIcon}
              />
              {status && <StatusBadge status={status} />}
            </Stack>
          );
        })}
      </Group>
    </Box>
  );
}

export default FactionsInGame;
