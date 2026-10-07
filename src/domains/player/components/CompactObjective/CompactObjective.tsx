import { Box, Group, Image } from "@mantine/core";
import { CircularFactionIcon } from "@/shared/ui/CircularFactionIcon";
import { PlayerData } from "@/entities/data/types";
import styles from "./CompactObjective.module.css";
import { Chip } from "@/shared/ui/primitives/Chip";

type Props = {
  name: string;
  color: "orange" | "blue" | "gray";
  revealed?: boolean;
  onClick?: () => void;
  scoredFactions?: string[];
  playerData?: PlayerData[];
  multiScoring?: boolean;
  hasRedTape?: boolean;
};

export function CompactObjective({
  name,
  color,
  revealed = true,
  onClick,
  scoredFactions = [],
  playerData = [],
  multiScoring = false,
  hasRedTape = false,
}: Props) {
  const isClickable = revealed && color !== "gray";

  const renderFactionIcons = () => {
    if (!revealed || playerData.length === 0) return null;

    if (multiScoring) {
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
    }

    /* One seat per faction in alphabetical order, so seats line up across objectives. */
    const sortedFactions = playerData
      .map((p) => p.faction)
      .sort((a, b) => a.localeCompare(b));

    return (
      <Group gap={2} className={styles.factionIcons}>
        {sortedFactions.map((faction) => (
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
            {scoredFactions.includes(faction) ? (
              <CircularFactionIcon faction={faction} size={20} />
            ) : (
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
        ))}
      </Group>
    );
  };

  return (
    <Chip
      accent={color}
      leftSection={
        hasRedTape && (
          <Image src="/redTape.png" className="redTape" w={16} h={16} />
        )
      }
      className={revealed ? undefined : styles.unrevealed}
      onClick={isClickable ? onClick : undefined}
      accentLine
      strong
      title={revealed ? name : "UNREVEALED"}
      revealFullTitleOnHover
    >
      {renderFactionIcons()}
    </Chip>
  );
}
