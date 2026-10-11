import type { CSSProperties } from "react";
import cx from "clsx";
import { Text } from "@/ds";
import type { PlayerData, Objectives, ScoreBreakdownEntry } from "@/entities/data/types";
import { SC_COLORS } from "@/entities/data/strategyCardColors";
import { PlayerColorSwatch } from "@/shared/ui/PlayerColor/PlayerColor";
import { FactionIcon } from "@/shared/ui/FactionIcon";
import { RailLabel } from "@/domains/objectives/components/RailLabel";
import { useGameData } from "@/state/useGameContext";
import { VpToken } from "./VpToken";
import styles from "./PlayerScoreSummary.module.css";

type Props = {
  playerData: PlayerData[];
  objectives: Objectives;
};

const LEGEND = [
  { label: "Scored", className: styles.keyScored },
  { label: "Ready to score", className: styles.keyReady },
  { label: "Possible", className: styles.keyPossible },
  { label: "Can be lost", className: styles.keyLosable },
];

function sumPoints(entries: ScoreBreakdownEntry[]) {
  return entries.reduce((sum, entry) => sum + entry.pointValue, 0);
}

function Legend() {
  return (
    <span className={styles.legend}>
      {LEGEND.map(({ label, className }) => (
        <span key={label} className={styles.key}>
          <i className={cx(styles.swatch, className)} aria-hidden="true" />
          {label}
        </span>
      ))}
    </span>
  );
}

function InitiativeDisc({ initiative }: { initiative?: number }) {
  const color = initiative ? SC_COLORS[initiative] : undefined;
  return (
    <span
      className={styles.init}
      title={initiative ? `Initiative ${initiative}` : "No strategy card"}
      style={color ? ({ "--scc": `var(--gd-${color})` } as CSSProperties) : undefined}
    >
      {initiative || "–"}
    </span>
  );
}

/**
 * Score breakdown: every seat on its own ten-space victory track, in
 * initiative order. Points sit on the track as tokens coloured by where they
 * came from, scored first, then what could still be scored.
 */
export function PlayerScoreSummary({ playerData, objectives }: Props) {
  const gameData = useGameData();
  const breakdowns = gameData?.playerScoreBreakdowns;
  const vpsToWin = gameData?.vpsToWin ?? 10;

  if (!playerData || !objectives) return null;

  const seats = [...playerData]
    .sort((a, b) => (a.scs[0] || 99) - (b.scs[0] || 99))
    .filter((player) => breakdowns?.[player.faction]);
  const columns = Math.max(
    vpsToWin,
    ...seats.map((player) => sumPoints(breakdowns![player.faction].entries)),
  );
  const leadingVps = Math.max(0, ...seats.map((player) => player.totalVps));
  const trackStyle = {
    "--vps-to-win": vpsToWin,
    "--columns": columns,
  } as CSSProperties;

  return (
    <div className={styles.vpBoard} style={trackStyle}>
      <RailLabel rule meta={<Legend />}>
        Score breakdown
      </RailLabel>

      <div className={styles.table}>
        <div className={cx(styles.row, styles.rulerRow)} aria-hidden="true">
          <span />
          <span className={styles.ruler}>
            {Array.from({ length: columns }, (_, i) => i + 1).map((space) => (
              <span key={space} data-win={space === vpsToWin || undefined}>
                {space <= vpsToWin ? space : ""}
              </span>
            ))}
          </span>
        </div>

        {seats.map((player) => {
          const entries = breakdowns![player.faction].entries;
          const possible = sumPoints(entries) - player.totalVps;
          const leading = player.totalVps === leadingVps && leadingVps > 0;

          return (
            <div key={player.faction} className={styles.row} data-leading={leading || undefined}>
              <span className={styles.seat}>
                <InitiativeDisc initiative={player.scs[0]} />
                <FactionIcon
                  faction={player.faction}
                  factionImageOverride={player.factionImage}
                  factionImageTypeOverride={player.factionImageType}
                  alt={player.faction}
                  w={26}
                  h={26}
                />
                <span className={styles.who}>
                  <span className={styles.name}>{player.userName}</span>
                  <PlayerColorSwatch color={player.color} />
                </span>
                <span className={styles.vp} title={`${player.totalVps} scored, ${possible} more possible`}>
                  <b>{player.totalVps}</b>
                  {possible > 0 && <small>+{possible}</small>}
                </span>
              </span>
              <span className={styles.track}>
                {entries.map((entry, idx) => (
                  <VpToken key={`${entry.type}-${idx}`} entry={entry} />
                ))}
              </span>
            </div>
          );
        })}
      </div>

      <Text className={styles.note}>
        Possible points only count what is visible on the board. Action cards
        such as Overrule or Impersonation can change them.
      </Text>
    </div>
  );
}
