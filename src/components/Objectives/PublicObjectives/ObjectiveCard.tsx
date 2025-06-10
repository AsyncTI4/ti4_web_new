import { Box, Text } from "@mantine/core";
import { useMemo, useState } from "react";
import { Shimmer } from "../../PlayerArea/Shimmer";
import { PlayerData } from "../../../data/types";
import { CircularFactionIcon } from "../../shared/CircularFactionIcon";
import { useOrderedFactions } from "../../../hooks/useOrderedFactions";
import { SmoothPopover } from "../../shared/SmoothPopover";
import { ObjectiveDetailsCard } from "./ObjectiveDetailsCard";
import { publicObjectives } from "../../../data/publicObjectives";
import styles from "./ObjectiveCard.module.css";

type Props = {
  text: string;
  vp: number;
  color: "orange" | "blue" | "gray";
  revealed?: boolean;
  scoredFactions: string[];
  playerData: PlayerData[];
  objectiveKey: string;
};

function ObjectiveCard({
  text,
  vp,
  color,
  revealed = true,
  scoredFactions,
  playerData,
  objectiveKey,
}: Props) {
  const [opened, setOpened] = useState(false);

  const allFactionsSorted = useOrderedFactions(playerData);

  const scoredFactionsSet = useMemo(() => {
    return new Set(scoredFactions);
  }, [scoredFactions]);

  // Check if this objective has detailed data available for popover
  const hasObjectiveData = publicObjectives.some(
    (obj) => obj.alias === objectiveKey
  );

  // Only show popover/clickable behavior if objective is revealed AND has data
  const shouldShowPopover = revealed && hasObjectiveData;

  const cardContent = (
    <Shimmer
      color={color}
      p={2}
      px="sm"
      className={`${styles.objectiveCard} ${styles[color]} ${!revealed ? styles.unrevealed : ""} ${shouldShowPopover ? styles.clickable : ""}`}
    >
      <Box className={styles.objectiveContent}>
        {/* VP indicator */}
        <Box
          className={`${styles.vpIndicator} ${revealed ? styles.revealed : styles.hidden} ${revealed ? styles[color] : ""}`}
        >
          <Text
            className={`${styles.vpText} ${revealed ? styles.revealed : styles.hidden}`}
          >
            {vp}
          </Text>
        </Box>

        {/* Objective text */}
        <Text
          className={`${styles.objectiveText} ${revealed ? styles.revealed : styles.hidden}`}
        >
          {revealed ? text : "UNREVEALED"}
        </Text>

        {/* Control token area */}
        <Box className={styles.controlTokenArea}>
          {/* Show each faction in its designated position - faction icon if scored, empty slot if not */}
          {allFactionsSorted.slice(0, 6).map((faction) => (
            <Box
              key={faction}
              className={`${styles.controlTokenSlot} ${scoredFactionsSet.has(faction) ? "" : styles.emptySlot}`}
            >
              {scoredFactionsSet.has(faction) && (
                <CircularFactionIcon faction={faction} size={28} />
              )}
            </Box>
          ))}
        </Box>
      </Box>
    </Shimmer>
  );

  // If no objective data exists or objective is not revealed, render without popover functionality
  if (!shouldShowPopover) {
    return <Box>{cardContent}</Box>;
  }

  // Otherwise, render with popover functionality
  return (
    <SmoothPopover opened={opened} onChange={setOpened}>
      <SmoothPopover.Target>
        <Box onClick={() => setOpened((o) => !o)}>{cardContent}</Box>
      </SmoothPopover.Target>
      <SmoothPopover.Dropdown p={0}>
        <ObjectiveDetailsCard
          objectiveKey={objectiveKey}
          playerData={playerData}
          scoredFactions={scoredFactions}
          color={color}
        />
      </SmoothPopover.Dropdown>
    </SmoothPopover>
  );
}

export { ObjectiveCard };
