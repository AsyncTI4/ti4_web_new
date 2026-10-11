import type { CSSProperties, ReactNode } from "react";
import { IconAtom, IconGavel, IconHexagon } from "@tabler/icons-react";
import { CircularFactionIcon } from "@/shared/ui/CircularFactionIcon";
import { getTechData } from "@/entities/lookup/tech";
import { actionCardTiming } from "../actionCardTiming";
import classes from "./EventChips.module.css";

/*
 * Inline object silhouettes for the event log. Each kind keeps its own shape so
 * an event's subject reads before its words do: tech is a circuit module, a
 * secret a hazard-striped folder, a promissory note an IOU ticket, a relic a
 * gold octagon, an action card a card with a rounded heel and timing tag.
 */

const TECH_TONE: Record<string, string> = {
  PROPULSION: "var(--gd-blue)",
  BIOTIC: "var(--gd-green)",
  CYBERNETIC: "var(--gd-yellow)",
  WARFARE: "var(--gd-red)",
};

function tone(value: string | undefined): CSSProperties | undefined {
  return value ? ({ "--k": value } as CSSProperties) : undefined;
}

export function HexChip({ children }: { children: ReactNode }) {
  return <span className={classes.hex}>{children}</span>;
}

export function ActionCardChip({ id, name }: { id: string; name: string }) {
  const timing = actionCardTiming(id);
  return (
    <span className={classes.acard}>
      <span className={classes.t}>{name}</span>
      {timing && <span className={classes.when}>{timing}</span>}
    </span>
  );
}

export function TechChip({ id, name }: { id: string; name: string }) {
  const tech = getTechData(id);
  const type = tech?.types?.[0];
  return (
    <span
      className={classes.tech}
      style={tone(type ? TECH_TONE[type] : undefined)}
    >
      <span className={classes.t}>{name}</span>
    </span>
  );
}

export function SecretChip({ name }: { name: string }) {
  return (
    <span className={classes.secret}>
      <img src="/so_icon.png" alt="" className={classes.g} />
      <span className={classes.t}>{name}</span>
    </span>
  );
}

/** A public objective: plain row in its stage colour. */
export function ObjectiveChip({ name, stage }: { name: string; stage: 1 | 2 }) {
  return (
    <span className={classes.objective} data-stage={stage}>
      <span className={classes.t}>{name}</span>
    </span>
  );
}

export function PnChip({
  name,
  owner,
}: {
  name: string;
  owner?: string | null;
}) {
  return (
    <span className={classes.pn}>
      {owner ? (
        <CircularFactionIcon
          faction={owner}
          size={14}
          className={classes.stub}
        />
      ) : (
        <span className={classes.stubEmpty} />
      )}
      <span className={classes.t}>{name}</span>
    </span>
  );
}

export function RelicChip({ name }: { name: string }) {
  return (
    <span className={classes.relic}>
      <span className={classes.t}>{name}</span>
    </span>
  );
}

export function BreakthroughChip({ name }: { name: string }) {
  return (
    <span className={classes.brk}>
      <span className={classes.core}>
        <IconAtom size={10} />
      </span>
      <span className={classes.t}>{name}</span>
    </span>
  );
}

export function AbilityChip({ name }: { name: string }) {
  return (
    <span className={classes.abl}>
      <span className={classes.well}>
        <IconHexagon size={10} />
      </span>
      <span className={classes.t}>{name}</span>
    </span>
  );
}

export function LawChip({ name, outcome }: { name: string; outcome?: string }) {
  return (
    <span className={classes.law}>
      <span className={classes.seal}>
        <IconGavel size={11} />
      </span>
      <span className={classes.lawText}>
        <b>{name}</b>
        {outcome && <small>{outcome}</small>}
      </span>
    </span>
  );
}

const SC_TONE: Record<number, string> = {
  1: "var(--gd-red)",
  2: "var(--gd-orange)",
  3: "var(--gd-yellow)",
  4: "var(--gd-green)",
  5: "var(--gd-teal)",
  6: "var(--gd-cyan)",
  7: "var(--gd-blue)",
  8: "var(--gd-purple)",
};

export function ScPlate({
  initiative,
  name,
  played = false,
}: {
  initiative?: number;
  name: string;
  played?: boolean;
}) {
  return (
    <span
      className={classes.scp}
      data-played={played || undefined}
      style={
        initiative
          ? ({ "--scc": SC_TONE[initiative] } as CSSProperties)
          : undefined
      }
    >
      {initiative !== undefined && (
        <span className={classes.disc}>{initiative}</span>
      )}
      <span className={classes.t}>{name}</span>
    </span>
  );
}

export function VpStamp({ children }: { children: ReactNode }) {
  return <span className={classes.vp}>{children}</span>;
}

export function LeaderPortrait({ id, name }: { id: string; name: string }) {
  return (
    <span className={classes.leader}>
      <img src={`/leaders/${id}.webp`} alt="" loading="lazy" />
      <span>{name}</span>
    </span>
  );
}

/** A counted resource: its token art and a mono count. */
export function CountChip({
  src,
  count,
  title,
}: {
  src: string;
  count: number;
  title: string;
}) {
  return (
    <span className={classes.count} title={title}>
      <img src={src} alt="" />
      <b>{count}</b>
    </span>
  );
}

export function PlainChip({ children }: { children: ReactNode }) {
  return <span className={classes.plain}>{children}</span>;
}
