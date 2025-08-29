import { Box, Group } from "@mantine/core";
import { CircularFactionIcon } from "../../shared/CircularFactionIcon";
import { PlayerData } from "../../../data/types";
import styles from "./CompactObjective.module.css";
import { Chip } from "@/components/shared/primitives/Chip";

type Props = {
  objectiveKey: string;
  name: string;
  color: "orange" | "blue" | "gray";
  revealed?: boolean;
  onClick?: () => void;
  scoredFactions?: string[];
  playerData?: PlayerData[];
  multiScoring?: boolean;
};

export function CompactObjective({
  name,
  color,
  revealed = true,
  onClick,
  scoredFactions = [],
  playerData = [],
  multiScoring = false,
}: Props) {
  const isClickable = revealed && color !== "gray";

  const renderFactionIcons = () => {
    if (!revealed || !playerData || playerData.length === 0) return null;

    if (multiScoring) {
      // For multiscoring objectives, show only the scored factions
      return (
        <Group gap={2} className={styles.factionIcons}>
          {scoredFactions.map((faction, index) => (
            <CircularFactionIcon
              key={`${faction}-${index}`}
              faction={faction}
              size={20}
            />
          ))}
        </Group>
      );
    } else {
      // For non-multiscoring objectives, show consistent slots for all factions
      // Sort faction names alphabetically for consistent ordering
      const sortedFactions = [...playerData]
        .sort((a, b) => a.faction.localeCompare(b.faction))
        .map((p) => p.faction);

      return (
        <Group gap={2} className={styles.factionIcons}>
          {sortedFactions.map((faction) => {
            const hasScored = scoredFactions.includes(faction);
            return (
              <Box
                key={faction}
                style={{
                  width: 20,
                  height: 20,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {hasScored ? (
                  <CircularFactionIcon faction={faction} size={20} />
                ) : (
                  // Empty slot placeholder
                  <Box
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                    }}
                  />
                )}
              </Box>
            );
          })}
        </Group>
      );
    }
  };

  return (
    <Chip
      accent={color}
      className={`${!revealed ? styles.unrevealed : ""}`}
      onClick={isClickable ? onClick : undefined}
      accentLine
      strong
      title={revealed ? name : "UNREVEALED"}
    >
      {renderFactionIcons()}
    </Chip>
  );
}
