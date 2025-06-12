import { Box, Text, Group } from "@mantine/core";
import { Shimmer } from "../Shimmer";
import { getGradientClasses } from "../gradientClasses";
import { CircularFactionIcon } from "../../shared/CircularFactionIcon";
import { PlayerData } from "../../../data/types";
import styles from "./CompactObjective.module.css";

type Props = {
  objectiveKey: string;
  name: string;
  pointValue: number;
  color: "orange" | "blue" | "gray";
  revealed?: boolean;
  onClick?: () => void;
  scoredFactions?: string[];
  playerData?: PlayerData[];
};

export function CompactObjective({
  name,
  pointValue,
  color,
  revealed = true,
  onClick,
  scoredFactions = [],
  playerData = [],
}: Props) {
  const gradientClasses = getGradientClasses(color);

  // Get players who have scored this objective
  const scoredPlayers = playerData.filter((player) =>
    scoredFactions.includes(player.faction)
  );

  // Gray objectives should not be clickable
  const isClickable = revealed && color !== "gray";

  return (
    <Box
      className={`${styles.objectiveCard} ${styles[color]} ${!revealed ? styles.unrevealed : ""} ${color === "gray" ? styles.nonClickable : ""}`}
      onClick={isClickable ? onClick : undefined}
    >
      <Shimmer color={color} py={2} px={6} className={gradientClasses.border}>
        <Box className={styles.contentContainer}>
          <Text size="xs" fw={700} c="white" className={styles.textContainer}>
            <Text
              span
              size="xs"
              fw={600}
              c={`${color}.4`}
              className={styles.scoreText}
            >
              ({pointValue}){" "}
            </Text>
            {revealed ? name : "UNREVEALED"}
          </Text>

          {/* Faction icons for scored players */}
          {revealed && scoredPlayers.length > 0 && (
            <Group gap={2} className={styles.factionIcons}>
              {scoredPlayers.map((player) => (
                <CircularFactionIcon
                  key={player.faction}
                  faction={player.faction}
                  size={20}
                />
              ))}
            </Group>
          )}
        </Box>
      </Shimmer>
    </Box>
  );
}
