import { Box, Group, Text, Image, Stack } from "@mantine/core";
import { StatusBadge } from "@/domains/player/components/StatusBadge";
import { PlayerData } from "@/entities/data/types";
import { cdnImage } from "@/entities/data/cdnImage";
import styles from "./FactionsInGame.module.css";

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
      <Text className={styles.sectionTitle}>Factions in Game</Text>
      <Group gap="sm">
        {sortedPlayerData.map((player, index) => {
          let statusBadge = null;
          if (player.active) {
            statusBadge = <StatusBadge status="active" />;
          } else if (index === nextPlayerIndex) {
            statusBadge = <StatusBadge status="next" />;
          }

          return (
            <Stack key={player.faction} gap="xs" align="center">
              <Image
                src={cdnImage(`/factions/${player.faction}.png`)}
                w={36}
                h={36}
                className={styles.factionIcon}
              />
              {statusBadge}
            </Stack>
          );
        })}
      </Group>
    </Box>
  );
}

export default FactionsInGame;
