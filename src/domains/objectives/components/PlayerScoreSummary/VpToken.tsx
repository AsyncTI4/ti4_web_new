import type { CSSProperties } from "react";
import { Tooltip } from "@/ds";
import type { ScoreBreakdownEntry } from "@/entities/data/types";
import { isMobileDevice } from "@/utils/isTouchDevice";
import { SCORE_SOURCES, STATE_LABEL, type ScoreSource } from "./scoreSources";
import styles from "./VpToken.module.css";

function Glyph({ glyph }: { glyph: ScoreSource["glyph"] }) {
  if ("text" in glyph) return <span className={styles.numeral}>{glyph.text}</span>;
  if ("mask" in glyph) {
    return (
      <span
        className={styles.mask}
        style={{ "--glyph": `url("${glyph.mask}")` } as CSSProperties}
      />
    );
  }
  return <span className={styles.icon}>{glyph.icon}</span>;
}

function hasProgress(entry: ScoreBreakdownEntry) {
  return (
    entry.type !== "SECRET" &&
    entry.state !== "SCORED" &&
    entry.currentProgress != null &&
    entry.totalProgress != null
  );
}

/**
 * One point source sitting on the victory track, spanning as many spaces as
 * it is worth. Filled when scored, outlined when it can be scored now, dashed
 * when it is only possible. A yellow corner marks a point that can be lost.
 */
export function VpToken({ entry }: { entry: ScoreBreakdownEntry }) {
  const source = SCORE_SOURCES[entry.type];
  const progress = hasProgress(entry);
  const span = Math.max(1, entry.pointValue);

  const label = (
    <span className={styles.tip}>
      <b>{source.label}</b>
      <span>
        {STATE_LABEL[entry.state]}
        {entry.pointValue > 1 ? `, ${entry.pointValue} points` : ""}
        {progress ? `, ${entry.currentProgress} of ${entry.totalProgress}` : ""}
        {entry.losable ? ", can be lost" : ""}
      </span>
      {entry.description && <span className={styles.tipBody}>{entry.description}</span>}
      {entry.canDrawSecret && (
        <span className={styles.tipBody}>Draws a secret objective instead.</span>
      )}
    </span>
  );

  const isMobile = isMobileDevice();

  return (
    <Tooltip label={label} multiline w={260} openDelay={120} events={{ hover: !isMobile, focus: true, touch: isMobile }}>
      <span
        className={styles.tok}
        tabIndex={0}
        aria-label={`${source.label}: ${STATE_LABEL[entry.state].toLowerCase()}`}
        data-state={entry.state}
        data-losable={entry.losable || undefined}
        style={{ "--k": source.tone, gridColumn: `span ${span}` } as CSSProperties}
      >
        <Glyph glyph={source.glyph} />
        {entry.canDrawSecret && (
          <span className={styles.alt}>
            <Glyph glyph={SCORE_SOURCES.SECRET.glyph} />
          </span>
        )}
        {progress && (
          <span className={styles.progress}>
            {entry.currentProgress}
            <i>/{entry.totalProgress}</i>
          </span>
        )}
      </span>
    </Tooltip>
  );
}
