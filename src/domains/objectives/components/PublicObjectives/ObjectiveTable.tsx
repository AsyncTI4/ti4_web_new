import type { CSSProperties, ReactNode } from "react";
import { Image, UnstyledButton } from "@/ds";
import type { Objective, PlayerData } from "@/entities/data/types";
import { publicObjectives } from "@/entities/data/publicObjectives";
import { FactionIcon } from "@/shared/ui/FactionIcon";
import { SmoothPopover } from "@/shared/ui/SmoothPopover";
import { lowPriorityImageProps } from "@/shared/ui/imageLoading";
import { ObjectiveDetailsCard } from "@/domains/cards/components/ObjectiveDetailsCard/ObjectiveDetailsCard";
import styles from "./ObjectiveTable.module.css";

export type ObjectiveStage = "orange" | "blue" | "gray";

type Seat = PlayerData;

/** A scored objective: the seat's faction badge seated in a lit well. */
function ScoredBadge({ seat, count = 1 }: { seat: Seat; count?: number }) {
  return (
    <span className={styles.scored} title={`${seat.userName}: scored${count > 1 ? ` ${count} times` : ""}`}>
      <FactionIcon
        faction={seat.faction}
        factionImageOverride={seat.factionImage}
        factionImageTypeOverride={seat.factionImageType}
        alt=""
        w={22}
        h={22}
      />
      {count > 1 && <b>{count}</b>}
    </span>
  );
}

function ProgressMeter({ seat, progress, threshold }: { seat: Seat; progress: number; threshold: number }) {
  const ready = progress >= threshold;
  return (
    <span
      className={styles.meter}
      data-ready={ready || undefined}
      title={`${seat.userName}: ${progress} of ${threshold}${ready ? ", ready to score" : ""}`}
    >
      <span className={styles.count}>
        {progress}
        <i>/{threshold}</i>
      </span>
      <span className={styles.bar} style={{ "--fill": Math.min(1, progress / threshold) } as CSSProperties} />
    </span>
  );
}

function SeatCell({ objective, seat }: { objective: Objective; seat: Seat }) {
  if (objective.scoredFactions.includes(seat.faction)) return <ScoredBadge seat={seat} />;
  const threshold = objective.progressThreshold;
  if (threshold > 0) {
    const progress = objective.factionProgress[seat.faction] ?? 0;
    return <ProgressMeter seat={seat} progress={progress} threshold={threshold} />;
  }
  return <span className={styles.empty} aria-hidden="true" />;
}

/**
 * Faction icons, once per table, so every row below is just state. Under each
 * icon, one pip per revealed objective, lit for each one that seat has scored.
 */
function SeatHeader({
  seats,
  title,
  meta,
  revealed,
  tally,
}: {
  seats: Seat[];
  title: string;
  meta?: ReactNode;
  revealed: Objective[];
  tally: boolean;
}) {
  return (
    <div className={styles.head}>
      <span className={styles.title}>
        {title}
        {meta && <small className={styles.titleNote}>{meta}</small>}
      </span>
      {seats.map((seat) => {
        const scored = revealed.filter((objective) => objective.scoredFactions.includes(seat.faction)).length;
        return (
          <span
            key={seat.faction}
            className={styles.seat}
            data-scored={scored > 0 || undefined}
            title={tally ? `${seat.userName}: ${scored} of ${revealed.length} scored` : seat.userName}
          >
            <FactionIcon
              faction={seat.faction}
              factionImageOverride={seat.factionImage}
              factionImageTypeOverride={seat.factionImageType}
              alt={seat.userName}
              w={22}
              h={22}
            />
            {tally && revealed.length > 0 && (
              <span className={styles.pips} aria-hidden="true">
                {revealed.map((objective, i) => (
                  <i key={objective.key} data-lit={i < scored || undefined} />
                ))}
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}

function ObjectiveRow({
  objective,
  stage,
  seats,
  playerData,
  showRequirement,
  opened,
  onOpenChange,
}: {
  objective: Objective;
  stage: ObjectiveStage;
  seats: Seat[];
  playerData: PlayerData[];
  showRequirement: boolean;
  opened: boolean;
  onOpenChange: (opened: boolean) => void;
}) {
  const requirement = publicObjectives.find((data) => data.alias === objective.key)?.text;

  return (
    <SmoothPopover opened={opened} onChange={onOpenChange} position="top-start" withArrow={false}>
      <SmoothPopover.Target>
        <UnstyledButton
          className={styles.row}
          aria-haspopup="dialog"
          onClick={() => onOpenChange(!opened)}
        >
          <span className={styles.text}>
            <span className={styles.name}>
              {objective.hasRedTape && (
                <Image {...lowPriorityImageProps} src="/redTape.png" alt="Red tape" w={14} h={14} />
              )}
              {objective.name}
            </span>
            {showRequirement && requirement && <span className={styles.req}>{requirement}</span>}
          </span>
          {seats.map((seat) => (
            <span key={seat.faction} className={styles.cell}>
              <SeatCell objective={objective} seat={seat} />
            </span>
          ))}
        </UnstyledButton>
      </SmoothPopover.Target>
      <SmoothPopover.Dropdown p={0}>
        <ObjectiveDetailsCard
          objectiveKey={objective.key}
          playerData={playerData}
          hasRedTape={objective.hasRedTape}
          scoredFactions={objective.scoredFactions}
          color={stage}
          factionProgress={objective.factionProgress}
          progressThreshold={objective.progressThreshold}
        />
      </SmoothPopover.Dropdown>
    </SmoothPopover>
  );
}

/** One-off points: who scored them, and how many times when a point repeats. */
function OtherPointRow({ objective, seats }: { objective: Objective; seats: Seat[] }) {
  const seated = new Set(seats.map((seat) => seat.faction));
  const unseated = [...new Set(objective.scoredFactions.filter((faction) => !seated.has(faction)))];
  const points = objective.pointValue;

  return (
    <div className={styles.row} data-static>
      <span className={styles.text}>
        <span className={styles.name}>
          <span className={styles.value} title={`Worth ${points} point${points === 1 ? "" : "s"}`}>
            {points}
          </span>
          {objective.name}
          {unseated.map((faction) => (
            <FactionIcon key={faction} faction={faction} alt={faction} title={faction} w={16} h={16} />
          ))}
        </span>
      </span>
      {seats.map((seat) => {
        const count = objective.scoredFactions.filter((faction) => faction === seat.faction).length;
        return (
          <span key={seat.faction} className={styles.cell}>
            {count > 0 ? <ScoredBadge seat={seat} count={count} /> : <span className={styles.empty} aria-hidden="true" />}
          </span>
        );
      })}
    </div>
  );
}

/** Face-down objectives collapse to one row of card backs. */
function FaceDownRow({ count }: { count: number }) {
  return (
    <div className={styles.faceDown}>
      <span className={styles.backs} aria-hidden="true">
        {Array.from({ length: count }, (_, i) => (
          <i key={i} />
        ))}
      </span>
      {count} face down
    </div>
  );
}

type TableProps = {
  title: string;
  meta?: ReactNode;
  stage: ObjectiveStage;
  objectives: Objective[];
  seats: Seat[];
  playerData: PlayerData[];
  showRequirement: boolean;
  openKey: string | null;
  onOpenKeyChange: (key: string | null) => void;
};

/**
 * Objectives as cards on the table: one row per objective, one column per
 * seat in seat order. A scored objective shows that seat's faction badge;
 * otherwise the seat shows how far it is toward the requirement.
 */
export function ObjectiveTable({
  title,
  meta,
  stage,
  objectives,
  seats,
  playerData,
  showRequirement,
  openKey,
  onOpenKeyChange,
}: TableProps) {
  const revealed = objectives.filter((objective) => objective.revealed);
  const faceDown = objectives.length - revealed.length;

  return (
    <div className={styles.table} data-stage={stage} style={{ "--seats": seats.length } as CSSProperties}>
      <SeatHeader seats={seats} title={title} meta={meta} revealed={revealed} tally={stage !== "gray"} />
      <div className={styles.well}>
        {revealed.map((objective) =>
          stage === "gray" ? (
            <OtherPointRow key={objective.key} objective={objective} seats={seats} />
          ) : (
            <ObjectiveRow
              key={objective.key}
              objective={objective}
              stage={stage}
              seats={seats}
              playerData={playerData}
              showRequirement={showRequirement}
              opened={openKey === objective.key}
              onOpenChange={(next) => onOpenKeyChange(next ? objective.key : null)}
            />
          ),
        )}
        {faceDown > 0 && <FaceDownRow count={faceDown} />}
      </div>
    </div>
  );
}
