import { Box, Image } from "@/ds";
import type { KeyboardEvent } from "react";
import { Objective, PlayerData } from "@/entities/data/types";
import { CircularFactionIcon } from "@/shared/ui/CircularFactionIcon";
import { publicObjectives } from "@/entities/data/publicObjectives";
import { getSeatOrder } from "@/domains/objectives/hooks/useOrderedFactions";
import styles from "./ExpandedObjectiveCard.module.css";
import ProgressObjectiveDisplay from "./ProgressObjectiveDisplay";
import { ObjectiveDetailsCard } from "@/domains/cards/components/ObjectiveDetailsCard/ObjectiveDetailsCard";
import { SmoothPopover } from "@/shared/ui/SmoothPopover";
import { isMobileDevice } from "@/utils/isTouchDevice";
import { lowPriorityImageProps } from "@/shared/ui/imageLoading";

type Props = {
  playerData: PlayerData[];
  objective: Objective;
  color: "orange" | "blue" | "gray";
  opened?: boolean;
  alwaysShowRequirement?: boolean;
  onToggle?: () => void;
  onOpenChange?: (opened: boolean) => void;
};

function ExpandedObjectiveCard({
  objective,
  playerData,
  color,
  opened = false,
  alwaysShowRequirement = false,
  onToggle,
  onOpenChange,
}: Props) {
  const isMobile = isMobileDevice();
  const objectiveData = publicObjectives.find(
    (obj) => obj.alias === objective.key,
  );
  const showRequirementInline = !isMobile || alwaysShowRequirement;
  const shouldShowMobileTooltip =
    !showRequirementInline &&
    objective.revealed &&
    Boolean(objectiveData?.text);

  const factionProgressData = getSeatOrder(playerData).map((player) => {
    const progress = objective.factionProgress[player.faction] || 0;
    return {
      player,
      progress,
      isScored: objective.scoredFactions.includes(player.faction),
      isAtThreshold:
        objective.progressThreshold > 0 &&
        progress >= objective.progressThreshold,
    };
  });

  const renderProgressDisplay = () => {
    if (!objective.revealed) return null;

    if (color !== "gray") {
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

  const cardContent = objective.revealed ? (
    <Box className={styles.objectiveCard} data-stage={color}>
      <Box className={styles.contentArea}>
        <span className={styles.objectiveTitle}>
          {objective.hasRedTape && (
            <Image
              {...lowPriorityImageProps}
              className={styles.redTape}
              src={"/redTape.png"}
              alt="Red tape"
              w={16}
              h={16}
            />
          )}
          {objective.name}
        </span>
        {objectiveData && showRequirementInline && (
          <span className={styles.requirementText}>{objectiveData.text}</span>
        )}
      </Box>
      <Box className={styles.progressBadges}>{renderProgressDisplay()}</Box>
    </Box>
  ) : (
    <Box className={styles.unrevealed} data-stage={color}>
      Unrevealed
    </Box>
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
