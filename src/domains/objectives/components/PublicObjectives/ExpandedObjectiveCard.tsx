import { Box, Text, Group, Stack, Image } from "@mantine/core";
import type { KeyboardEvent } from "react";
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
import { lowPriorityImageProps } from "@/shared/ui/imageLoading";
import { useViewerDiscordId, useHideScoreOrder } from "@/hooks/useGameContext";
import { computeScoreTier, getOwnFaction } from "@/utils/objectiveScoreTiers";
import { AnonymousPlayerToken } from "@/shared/ui/AnonymousPlayerToken";

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
  const viewerDiscordId = useViewerDiscordId();
  const hideScoreOrder = useHideScoreOrder();
  const objectiveData = publicObjectives.find(
    (obj) => obj.alias === objective.key,
  );
  const shouldShowMobileTooltip =
    isMobile && objective.revealed && Boolean(objectiveData?.text);

  const ownFaction = getOwnFaction(playerData, viewerDiscordId);
  const tier = computeScoreTier(
    objective.scoredFactions,
    objective.unidentifiedScorerCount ?? 0,
    playerData,
    ownFaction,
    hideScoreOrder,
  );
  const ownProgress = ownFaction
    ? (objective.factionProgress[ownFaction] ?? null)
    : null;

  const renderProgressDisplay = () => {
    if (!objective.revealed) return null;

    if (objective.progressThreshold > 0) {
      return (
        <ProgressObjectiveDisplay
          tier={tier}
          progressThreshold={objective.progressThreshold}
          ownProgress={ownProgress}
          factionProgress={objective.factionProgress}
        />
      );
    }

    if (custom) {
      return (
        <>
          {tier.ownFaction && tier.ownScored && (
            <CircularFactionIcon faction={tier.ownFaction} size={24} />
          )}
          {tier.identified
            .filter(({ scored }) => scored)
            .map(({ player }) => (
              <CircularFactionIcon
                key={player.faction}
                faction={player.faction}
                factionImageOverride={player.factionImage}
                factionImageTypeOverride={player.factionImageType}
                size={24}
              />
            ))}
          {Array.from({ length: tier.anonymousScorerCount }, (_, i) => (
            <AnonymousPlayerToken key={i} size={24} />
          ))}
        </>
      );
    }

    return null;
  };

  const cardContent = (
    <Shimmer
      color={color}
      p="xs"
      className={`${getGradientClasses(color).border} ${getGradientClasses(color).backgroundStrong} ${getGradientClasses(color).leftBorder} ${styles[color]} ${!objective.revealed ? styles.unrevealed : ""}`}
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
            unidentifiedScorerCount={objective.unidentifiedScorerCount ?? 0}
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
