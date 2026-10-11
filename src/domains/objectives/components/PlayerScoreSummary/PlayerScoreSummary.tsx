import { Text, Stack } from "@/ds";
import type { PlayerData, Objectives, EntryType, ScoreBreakdownEntry } from "@/entities/data/types";
import { PlayerColor } from "@/shared/ui/PlayerColor/PlayerColor";
import styles from "./PlayerScoreSummary.module.css";
import legendStyles from "./PlayerScoreSummaryLegend.module.css";
import styxStyles from "./StyxIcon.module.css";
import { ObjectiveChip } from "../ObjectiveChip";
import { cdnImage } from "@/entities/data/cdnImage";
import { IconAlertTriangle, IconBook2, IconDiamond } from "@tabler/icons-react";
import { useGameData } from "@/state/useGameContext";
import cx from "clsx";
import type { ReactNode } from "react";
import cornerBadgeStyles from "./CornerBadgeIcon.module.css";
import vpTokenStyles from "./VPTokenIcon.module.css";
import { OBJECTIVE_IMAGE_MAP } from "./objectiveImageMap";
import { calculateBorderVisibility } from "./borderVisibility";
import { RailLabel } from "@/domains/objectives/components/RailLabel";
import { lowPriorityImageProps } from "@/shared/ui/imageLoading";
import { FactionIcon } from "@/shared/ui/FactionIcon";

type Props = {
  playerData: PlayerData[];
  objectives: Objectives;
};

function StyxIcon() {
  return (
    <div className={styxStyles.styxIcon}>
      <img
        {...lowPriorityImageProps}
        src={cdnImage("/planet_cards/pc_legendary_rdy.png")}
        alt="legendary ready"
        className={styxStyles.legendaryIcon}
      />
    </div>
  );
}

const CORNER_BADGE_ICONS: Partial<Record<EntryType, ReactNode>> = {
  LATVINIA: <IconBook2 size={12} className={cornerBadgeStyles.bookIcon} />,
  SHARD: <IconDiamond size={12} className={cornerBadgeStyles.diamondIcon} />,
};

const INVERTED_ICONS = new Set<EntryType>(["AGENDA", "SFTT"]);

const LEGEND_STATES = [
  { label: "Scored", className: legendStyles.scored },
  { label: "Qualifies", className: legendStyles.qualifies },
  { label: "Potential", className: legendStyles.potential },
];

function sumPoints(entries: ScoreBreakdownEntry[]) {
  return entries.reduce((sum, entry) => sum + entry.pointValue, 0);
}

function getObjectiveIcon(entryType: EntryType): ReactNode {
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
  const cornerBadge = CORNER_BADGE_ICONS[entryType];

  if (cornerBadge) {
    return (
      <div className={cornerBadgeStyles.container}>
        <img
          {...lowPriorityImageProps}
          src={imageSrc}
          alt="Relic"
          className={cornerBadgeStyles.baseImage}
        />
        <div className={cornerBadgeStyles.badge}>{cornerBadge}</div>
      </div>
    );
  }

  return (
    <img
      {...lowPriorityImageProps}
      src={imageSrc}
      alt={`${entryType} icon`}
      style={INVERTED_ICONS.has(entryType) ? { filter: "invert(100%)" } : undefined}
    />
  );
}

export function PlayerScoreSummary({ playerData, objectives }: Props) {
  const gameData = useGameData();
  const playerScoreBreakdowns = gameData?.playerScoreBreakdowns;
  const vpsToWin = gameData?.vpsToWin ?? 10;

  if (!playerData || !objectives) return null;

  const sortedPlayers = [...playerData].sort((a, b) => {
    const aInit = a.scs[0] || 99;
    const bInit = b.scs[0] || 99;
    return aInit - bInit;
  });
  const maxPotentialVPs = sortedPlayers.reduce((maxTotal, player) => {
    const breakdown = playerScoreBreakdowns?.[player.faction];
    if (!breakdown) return maxTotal;
    return Math.max(maxTotal, sumPoints(breakdown.entries));
  }, 0);
  const gridColumns = Math.max(vpsToWin, maxPotentialVPs);
  const gridStyle = { gridTemplateColumns: `repeat(${gridColumns}, var(--score-cell, 40px))` };
  const leadingVPs = Math.max(...sortedPlayers.map((p) => p.totalVps), 0);

  return (
    <div
      className={styles.themedContainer}
      style={
        {
          "--vps-to-win": vpsToWin,
          "--score-columns": gridColumns,
        } as React.CSSProperties
      }
    >
      <Stack gap={10}>
        <RailLabel rule>Score breakdown</RailLabel>

        <div className={legendStyles.legendContainer}>
          {LEGEND_STATES.map(({ label, className }) => (
            <div key={label} className={legendStyles.legendItem}>
              <div className={cx(legendStyles.legendBox, className)} />
              <span>{label}</span>
            </div>
          ))}
          <div className={legendStyles.legendItem}>
            <IconAlertTriangle size={13} className={legendStyles.losable} />
            <span>Losable</span>
          </div>
        </div>

        {/* Number track - shown once above all players */}
        <div className={styles.rowContainer}>
          <div className={styles.playerInfoColumn} />
          <div
            className={cx(styles.objectivesGrid, styles.numberTrack)}
            style={gridStyle}
          >
            {Array.from({ length: gridColumns }, (_, i) => i + 1).map((num) => (
              <div key={`number-${num}`} className={styles.numberCell}>
                {num <= vpsToWin ? (
                  <span
                    className={cx(
                      styles.numberText,
                      num === vpsToWin && styles.winningNumberText,
                    )}
                  >
                    {num}
                  </span>
                ) : null}
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
          const potentialVPs = sumPoints(breakdown.entries);
          const isLeader = totalVPs === leadingVPs && totalVPs > 0;

          return (
            <div
              key={player.faction}
              className={cx(
                styles.rowContainer,
                isLeader && styles.leaderRow,
              )}
            >
              <div className={cx(styles.nameBody, styles.playerInfoColumn)}>
                <FactionIcon
                  faction={player.faction}
                  factionImageOverride={player.factionImage}
                  factionImageTypeOverride={player.factionImageType}
                  alt={player.faction}
                  w={22}
                  h={22}
                />
                <span className={styles.playerNameText}>
                  {player.userName}
                </span>
                <PlayerColor color={player.color} size="sm" />
                <span className={styles.initiativeText} title="Initiative">
                  {player.scs[0]}
                </span>
                <span className={styles.vpText}>
                  <b>{totalVPs}</b>/{potentialVPs}
                </span>
              </div>

              <div className={styles.objectivesGrid} style={gridStyle}>
                {breakdown.entries.map((entry, idx) => {
                  const { hideLeftBorder, hideRightBorder } =
                    calculateBorderVisibility(idx, breakdown.entries);

                  const icon = getObjectiveIcon(entry.type);

                  return (
                    <ObjectiveChip
                      key={`${player.faction}-entry-${idx}`}
                      icon={
                        entry.type === "IMPERIAL" && entry.canDrawSecret ? (
                          <div className={vpTokenStyles.imperialContainer}>
                            {getObjectiveIcon("IMPERIAL")}
                            <img
                              {...lowPriorityImageProps}
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
                        entry.losable ? <IconAlertTriangle size={13} /> : null
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

        <Text className={styles.noteText}>
          Potential points are a heuristic based on above-the-board information
          only — they cannot account for action cards such as Overrule or
          Impersonation.
        </Text>
      </Stack>
    </div>
  );
}

