import { Box, Text, Group, Stack, Image } from "@mantine/core";
import type { KeyboardEvent } from "react";
import { Shimmer } from "@/domains/player/components/Shimmer";
import { Objective, PlayerData } from "@/entities/data/types";
import { CircularFactionIcon } from "@/shared/ui/CircularFactionIcon";
import { publicObjectives } from "@/entities/data/publicObjectives";
import styles from "./ExpandedObjectiveCard.module.css";
import ProgressObjectiveDisplay from "./ProgressObjectiveDisplay";
import { ObjectiveDetailsCard } from "./ObjectiveDetailsCard";
import { SmoothPopover } from "@/shared/ui/SmoothPopover";
import { isMobileDevice } from "@/utils/isTouchDevice";
import { lowPriorityImageProps } from "@/shared/ui/imageLoading";

type Props = {
  playerData: PlayerData[];
  objective: Objective;
  color: "orange" | "blue" | "gray";
  opened?: boolean;
  onToggle?: () => void;
  onOpenChange?: (opened: boolean) => void;
};

function ExpandedObjectiveCard({
  objective,
  playerData,
  color,
  opened = false,
  onToggle,
  onOpenChange,
}: Props) {
  const isMobile = isMobileDevice();
  const objectiveData = publicObjectives.find(
    (obj) => obj.alias === objective.key,
  );
  const shouldShowMobileTooltip =
    isMobile && objective.revealed && Boolean(objectiveData?.text);

  const factionProgressData = playerData
    .map((player) => {
      const progress = objective.factionProgress[player.faction] || 0;
      return {
        player,
        progress,
        isScored: objective.scoredFactions.includes(player.faction),
        isAtThreshold: progress >= objective.progressThreshold,
      };
    })
    .sort((a, b) => a.player.faction.localeCompare(b.player.faction));

  const renderProgressDisplay = () => {
    if (!objective.revealed) return null;

    if (objective.progressThreshold > 0) {
      return (
        <ProgressObjectiveDisplay
          factionProgressData={factionProgressData}
          progressThreshold={objective.progressThreshold}
        />
      );
    }

    return objective.scoredFactions.map((faction, index) => (
      <CircularFactionIcon
        key={`${faction}-${index}`}
        faction={faction}
        size={24}
      />
    ));
  };

  const cardContent = (
    <Shimmer
      color={color}
      p={objective.revealed ? "xs" : "6px 10px"}
      className={`${styles.objectiveCard} ${styles[color]} ${!objective.revealed ? styles.unrevealed : ""}`}
    >
      <Group className={styles.mainRow}>
        {objective.hasRedTape && (
          <Image
            {...lowPriorityImageProps}
            className={styles.redTape}
            src={"/redTape.png"}
            w={23}
            h={23}
          />
        )}
        <Box className={styles.contentArea}>
          <Text
            className={`${styles.objectiveTitle} ${objective.revealed ? styles.revealed : styles.hidden}`}
          >
            {objective.revealed ? objective.name : "UNREVEALED"}
          </Text>
          {objective.revealed && objectiveData && !isMobile && (
            <Text className={styles.requirementText} size="sm">
              {objectiveData.text}
            </Text>
          )}
        </Box>
        <Stack>
          <Group className={styles.progressBadges}>
            {renderProgressDisplay()}
          </Group>
        </Stack>
      </Group>
    </Shimmer>
  );
  const handleDetailsKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onToggle?.();
    }
  };

  if (shouldShowMobileTooltip) {
    return (
      <SmoothPopover
        opened={opened}
        onChange={(nextOpened) => onOpenChange?.(nextOpened)}
        position="top-start"
        withArrow={false}
      >
        <SmoothPopover.Target>
          <Box
            tabIndex={0}
            role="button"
            aria-label={`Objective requirement: ${objectiveData?.text}`}
            onClick={onToggle}
            onKeyDown={handleDetailsKeyDown}
          >
            {cardContent}
          </Box>
        </SmoothPopover.Target>
        <SmoothPopover.Dropdown p={0}>
          <ObjectiveDetailsCard
            objectiveKey={objective.key}
            playerData={playerData}
            hasRedTape={objective.hasRedTape}
            scoredFactions={objective.scoredFactions}
            color={color}
            factionProgress={objective.factionProgress}
            progressThreshold={objective.progressThreshold}
            showFactionProgress={false}
          />
        </SmoothPopover.Dropdown>
      </SmoothPopover>
    );
  }

  return cardContent;
}

export default ExpandedObjectiveCard;
