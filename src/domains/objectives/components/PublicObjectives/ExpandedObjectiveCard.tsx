import { Box, Text, Group, Stack, Image } from "@mantine/core";
import { Shimmer } from "@/domains/player/components/Shimmer";
import { getGradientClasses } from "@/domains/player/components/gradientClasses";
import { Objective, PlayerData } from "@/entities/data/types";
import { CircularFactionIcon } from "@/shared/ui/CircularFactionIcon";
import { publicObjectives } from "@/entities/data/publicObjectives";
import styles from "./ExpandedObjectiveCard.module.css";
import ProgressObjectiveDisplay from "./ProgressObjectiveDisplay";
import { ObjectiveDetailsCard } from "./ObjectiveDetailsCard";
import { SmoothPopover } from "@/shared/ui/SmoothPopover";
import { isMobileDevice } from "@/utils/isTouchDevice";

type Props = {
  playerData: PlayerData[];
  objective: Objective;
  color: "orange" | "blue" | "gray";
  custom?: boolean;
  opened?: boolean;
  onToggle?: () => void;
  onOpenChange?: (opened: boolean) => void;
};

function ExpandedObjectiveCard({
  objective,
  playerData,
  color,
  custom = true,
  opened = false,
  onToggle,
  onOpenChange,
}: Props) {
  const isMobile = isMobileDevice();
  const objectiveData = publicObjectives.find(
    (obj) => obj.alias === objective.key
  );
  const shouldShowMobileTooltip =
    isMobile && objective.revealed && Boolean(objectiveData?.text);

  // Create faction progress data with alphabetical sorting for consistency
  const factionProgressData = playerData
    .map((player) => ({
      player,
      progress: objective.factionProgress[player.faction] || 0,
      isScored: objective.scoredFactions.includes(player.faction),
      isAtThreshold:
        (objective.factionProgress[player.faction] || 0) >=
        objective.progressThreshold,
    }))
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

    if (custom) {
      return objective.scoredFactions.map((faction, index) => (
        <CircularFactionIcon
          key={`${faction}-${index}`}
          faction={faction}
          size={28}
        />
      ));
    }

    return null;
  };

  const cardContent = (
    <Shimmer
      color={color}
      p="sm"
      className={`${getGradientClasses(color).border} ${getGradientClasses(color).backgroundStrong} ${getGradientClasses(color).leftBorder} ${styles[color]} ${!objective.revealed ? styles.unrevealed : ""}`}
    >
      <Group className={styles.mainRow}>
        {objective.hasRedTape && (
          <Image className={styles.redTape} src={"/redTape.png"} w={23} h={23} />
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
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onToggle?.();
              }
            }}
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
