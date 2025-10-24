import { Group, Text, Image, Stack, Flex } from "@mantine/core";
import { PlayerData, Objectives, EntryType } from "@/data/types";
import { PlayerColor } from "@/components/PlayerArea/PlayerColor";
import styles from "./PlayerScoreSummary.module.css";
import legendStyles from "./PlayerScoreSummaryLegend.module.css";
import styxStyles from "./StyxIcon.module.css";
import { useFactionImages } from "@/hooks/useFactionImages";
import { ObjectiveChip } from "./ObjectiveChip";
import { cdnImage } from "@/data/cdnImage";
import { IconAlertTriangle, IconBook2, IconDiamond } from "@tabler/icons-react";
import { useGameData } from "@/hooks/useGameContext";
import cx from "clsx";
import type { ReactNode } from "react";
import cornerBadgeStyles from "./CornerBadgeIcon.module.css";
import vpTokenStyles from "./VPTokenIcon.module.css";
import { OBJECTIVE_IMAGE_MAP } from "./constants/objectiveImageMap";
import { calculateBorderVisibility } from "./utils/borderVisibility";
import Caption from "@/components/shared/Caption/Caption";

type Props = {
  playerData: PlayerData[];
  objectives: Objectives;
};

function StyxIcon() {
  return (
    <div className={styxStyles.styxIcon}>
      <img
        src={cdnImage("/planet_cards/pc_legendary_rdy.png")}
        alt="legendary ready"
        className={styxStyles.legendaryIcon}
      />
    </div>
  );
}

function getObjectiveIcon(
  entryType: EntryType,
  invertAgenda = false
): ReactNode {
  if (entryType === "STYX") {
    return <StyxIcon />;
  }

  if (entryType === "CUSTODIAN") {
    return (
      <div className={vpTokenStyles.token}>
        <div className={vpTokenStyles.content}>
          <div className={vpTokenStyles.number}>1</div>
          <div className={vpTokenStyles.label}>VP</div>
        </div>
      </div>
    );
  }

  if (entryType === "IMPERIAL") {
    return (
      <div className={vpTokenStyles.imperialToken}>
        <div className={vpTokenStyles.content}>
          <div className={vpTokenStyles.imperialNumber}>8</div>
        </div>
      </div>
    );
  }

  const imageSrc = OBJECTIVE_IMAGE_MAP[entryType];

  if (entryType === "LATVINIA") {
    return (
      <div className={cornerBadgeStyles.container}>
        <img
          src={imageSrc}
          alt="Relic"
          className={cornerBadgeStyles.baseImage}
        />
        <div className={cornerBadgeStyles.badge}>
          <IconBook2 size={12} className={cornerBadgeStyles.bookIcon} />
        </div>
      </div>
    );
  }

  if (entryType === "SHARD") {
    return (
      <div className={cornerBadgeStyles.container}>
        <img
          src={imageSrc}
          alt="Relic"
          className={cornerBadgeStyles.baseImage}
        />
        <div className={cornerBadgeStyles.badge}>
          <IconDiamond size={12} className={cornerBadgeStyles.diamondIcon} />
        </div>
      </div>
    );
  }
  return (
    <img
      src={imageSrc}
      alt={`${entryType} icon`}
      style={
        entryType === "AGENDA" && invertAgenda
          ? { filter: "invert(100%)" }
          : entryType === "SFTT"
            ? { filter: "invert(100%)" }
            : undefined
      }
    />
  );
}

export function PlayerScoreSummary({ playerData, objectives }: Props) {
  const gameData = useGameData();
  const playerScoreBreakdowns = gameData?.playerScoreBreakdowns;

  if (!playerData || !objectives) return null;

  const factionImages = useFactionImages();

  const sortedPlayers = [...playerData].sort((a, b) => {
    const aInit = a.scs[0] || 99;
    const bInit = b.scs[0] || 99;
    return aInit - bInit;
  });

  const maxGridColumns = Math.max(
    ...sortedPlayers.map((player) => {
      const breakdown = playerScoreBreakdowns?.[player.faction];
      if (!breakdown) return 10;
      return breakdown.entries.reduce(
        (sum, entry) => sum + entry.pointValue,
        0
      );
    }),
    10
  );

  return (
    <div className={styles.themedContainer}>
      <Stack gap={10}>
        {/* Title */}
        <Caption size="md">Score Breakdown</Caption>

        {/* Legend/Rubric */}
        <div className={legendStyles.legendContainer}>
          <div className={legendStyles.legendItem}>
            <div className={cx(legendStyles.legendBox, legendStyles.scored)} />
            <Text size="xs" c="dimmed">
              Scored
            </Text>
          </div>
          <div className={legendStyles.legendItem}>
            <div
              className={cx(legendStyles.legendBox, legendStyles.qualifies)}
            />
            <Text size="xs" c="dimmed">
              Qualifies
            </Text>
          </div>
          <div className={legendStyles.legendItem}>
            <div
              className={cx(legendStyles.legendBox, legendStyles.potential)}
            />
            <Text size="xs" c="dimmed">
              Potential
            </Text>
          </div>
          <div className={legendStyles.legendItem}>
            <IconAlertTriangle
              size={18}
              color="var(--mantine-color-yellow-6)"
            />
            <Text size="xs" c="dimmed">
              Losable
            </Text>
          </div>
        </div>

        {/* Number track - shown once above all players */}
        <div className={styles.rowContainer}>
          <div className={styles.playerInfoColumn} />
          <div
            className={styles.objectivesGrid}
            style={{ gridTemplateColumns: `repeat(${maxGridColumns}, 1fr)` }}
          >
            {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
              <div key={`number-${num}`} className={styles.numberCell}>
                <Text
                  ff="heading"
                  size="sm"
                  c="dimmed"
                  style={{ opacity: 0.7 }}
                >
                  {num}
                </Text>
              </div>
            ))}
          </div>
        </div>

        {sortedPlayers.map((player) => {
          const breakdown = playerScoreBreakdowns?.[player.faction];

          if (!breakdown) {
            return null;
          }

          const totalVPs = player.totalVps;
          const potentialVPs = breakdown.entries.reduce(
            (sum, entry) => sum + entry.pointValue,
            0
          );

          return (
            <div key={player.faction} className={styles.rowContainer}>
              <div className={cx(styles.nameBody, styles.playerInfoColumn)}>
                <Image
                  src={factionImages[player.faction!]?.image}
                  alt={player.faction}
                  w={24}
                  h={24}
                />
                <Text
                  size="md"
                  fw={700}
                  c="white"
                  ff="heading"
                  className={cx(styles.playerName, styles.playerNameText)}
                >
                  {player.userName}
                </Text>
                <PlayerColor color={player.color} size="sm" />
                <Text
                  ff={"text"}
                  className={cx(styles.initiativeBody, styles.initiativeText)}
                  size="md"
                  fw={600}
                >
                  {player.scs[0]}
                </Text>
                <Text
                  ff={"heading"}
                  className={cx(styles.vp, styles.vpText)}
                  size="sm"
                >
                  {totalVPs}/{potentialVPs} VP
                </Text>
              </div>

              <div
                className={styles.objectivesGrid}
                style={{
                  gridTemplateColumns: `repeat(${maxGridColumns}, 1fr)`,
                }}
              >
                {breakdown.entries.map((entry, idx) => {
                  const { hideLeftBorder, hideRightBorder } =
                    calculateBorderVisibility(idx, breakdown.entries);

                  const icon = getObjectiveIcon(
                    entry.type,
                    entry.type === "AGENDA"
                  );

                  return (
                    <ObjectiveChip
                      key={`${player.faction}-entry-${idx}`}
                      icon={
                        entry.type === "IMPERIAL" && entry.canDrawSecret ? (
                          <div className={vpTokenStyles.imperialContainer}>
                            {getObjectiveIcon("IMPERIAL")}
                            <img
                              className={vpTokenStyles.secretIcon}
                              src={OBJECTIVE_IMAGE_MAP.SECRET}
                              alt="Secret objective"
                            />
                          </div>
                        ) : (
                          icon
                        )
                      }
                      entryType={entry.type}
                      state={entry.state}
                      span={entry.pointValue}
                      warningIcon={
                        entry.losable ? <IconAlertTriangle size={20} /> : null
                      }
                      hideLeftBorder={hideLeftBorder}
                      hideRightBorder={hideRightBorder}
                      losable={entry.losable}
                      currentProgress={entry.currentProgress}
                      totalProgress={entry.totalProgress}
                      description={entry.description}
                      zIndex={1000 - idx}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Note about potential points */}
        <Text
          size="sm"
          c="gray.6"
          fs="italic"
          className={styles.noteText}
          mt="sm"
        >
          NOTE: Potential points (not filled) are a heuristic that do not
          account for action cards such as overrule, impersonation, and others.
          TI4 has a lot of nonsense that is hard to expect, so this only tracks
          above the board information.
        </Text>
      </Stack>
    </div>
  );
}

