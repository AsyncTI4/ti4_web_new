import {
  IconArrowsLeftRight,
  IconBuildingFactory2,
  IconSwords,
} from "@tabler/icons-react";
import type { GameSubEvent } from "@/entities/data/types";
import { ActionCardDetailsCard } from "@/domains/player/components/ActionCardDetailsCard";
import { LeaderDetailsCard } from "@/domains/player/components/LeaderDetailsCard";
import { SecretObjectiveCard } from "@/domains/player/components/SecretObjectiveCard";
import { TechCard } from "@/domains/player/components/Tech";
import {
  resolveCardName,
  resolveObjectiveName,
  resolvePlanetName,
  resolveTechName,
  resolveUnitName,
} from "./eventFormatting";
import type { SystemNameResolver } from "./eventPayload";
import { EventPopover, ProductionSummary, SubFaction } from "./EventParts";
import classes from "./GameEventPanel.module.css";

type SubOf<T extends GameSubEvent["type"]> = Extract<GameSubEvent, { type: T }>;

function retreatUnitBreakdown(
  units: Record<string, [number, number, number, number]>,
): string {
  return Object.entries(units)
    .map(([id, states]) => {
      const count = states.reduce((total, value) => total + value, 0);
      return `${count}× ${resolveUnitName(id)}`;
    })
    .join(", ");
}

function combatLocation(
  sub: SubOf<"COMBAT">,
  systemName: SystemNameResolver,
): string {
  if (sub.kind === "space") return sub.tile ? systemName(sub.tile) : "Combat";
  return sub.planet ? resolvePlanetName(sub.planet) : "Combat";
}

function SubCardPlay({
  faction,
  verb,
  name,
  details,
}: {
  faction: string;
  verb: string;
  name: string;
  details: React.ReactNode;
}) {
  return (
    <EventPopover buttonClassName={classes.subEventButton} details={details}>
      <SubFaction faction={faction} />
      <span className={classes.subMuted}>{verb}</span>
      <span className={classes.subCardName}>{name}</span>
    </EventPopover>
  );
}

function SubObjectiveScored({ sub }: { sub: SubOf<"OBJECTIVE_SCORED"> }) {
  const content = (
    <>
      <SubFaction faction={sub.faction} />
      <span className={classes.subMuted}>{sub.category}</span>
      <span className={classes.subCardName}>
        {resolveObjectiveName(sub.objectiveId)}
      </span>
    </>
  );
  if (sub.category !== "SECRET" || !sub.objectiveId) return content;
  return (
    <EventPopover
      buttonClassName={classes.subEventButton}
      details={<SecretObjectiveCard secretId={sub.objectiveId} />}
    >
      {content}
    </EventPopover>
  );
}

function SubEventContent({
  sub,
  systemName,
  actorFaction,
}: {
  sub: GameSubEvent;
  systemName: SystemNameResolver;
  actorFaction?: string | null;
}) {
  switch (sub.type) {
    case "COMBAT":
      return (
        <>
          <span className={classes.combat}>
            <IconSwords size={11} stroke={2} />
            {combatLocation(sub, systemName)}
          </span>
          {sub.vsFaction && (
            <>
              <span className={classes.subMuted}>vs</span>
              <SubFaction faction={sub.vsFaction} />
            </>
          )}
        </>
      );

    case "CONTROL_ESTABLISHED": {
      const controllingFaction = sub.faction ?? actorFaction;
      return (
        <>
          {controllingFaction && <SubFaction faction={controllingFaction} />}
          <span>Took control of {resolvePlanetName(sub.planet)}</span>
        </>
      );
    }

    case "ACTION_CARD_PLAYED":
      return (
        <SubCardPlay
          faction={sub.faction}
          verb="played"
          name={
            sub.cardName || resolveCardName("CARD_PLAY_ACTION_CARD", sub.cardId)
          }
          details={<ActionCardDetailsCard actionCardId={sub.cardId} />}
        />
      );

    case "LEADER_PLAYED":
      return (
        <SubCardPlay
          faction={sub.faction}
          verb={sub.leaderType === "AGENT" ? "exhausted" : "played"}
          name={resolveCardName(
            sub.leaderType === "HERO" ? "CARD_PLAY_HERO" : "CARD_PLAY_AGENT",
            sub.leaderId,
          )}
          details={<LeaderDetailsCard leaderId={sub.leaderId} />}
        />
      );

    case "TECH_EXHAUSTED":
      return (
        <SubCardPlay
          faction={sub.faction}
          verb="exhausted"
          name={resolveTechName(sub.techId)}
          details={<TechCard techId={sub.techId} />}
        />
      );

    case "OBJECTIVE_SCORED":
      return <SubObjectiveScored sub={sub} />;

    case "PRODUCTION":
      return (
        <>
          <span className={classes.productionPlace}>
            <IconBuildingFactory2 size={11} stroke={2} />
            {sub.tile ? systemName(sub.tile) : "Production"}
          </span>
          <ProductionSummary units={sub.units} cost={sub.cost} />
        </>
      );

    case "RETREAT":
      return (
        <>
          <SubFaction faction={sub.faction} />
          <span className={classes.combat}>
            <IconArrowsLeftRight size={11} stroke={2} />
            Retreated {retreatUnitBreakdown(sub.units)}
          </span>
          <span className={classes.subMuted}>
            {sub.fromHolder !== "space" && (
              <>from {resolvePlanetName(sub.fromHolder)} </>
            )}
            to {systemName(sub.toTile)}
          </span>
        </>
      );

    case "MANUAL_COMMAND":
      return <span className={classes.mono}>{sub.command}</span>;

    default:
      return null;
  }
}

const KNOWN_SUB_EVENT_TYPES = new Set<string>([
  "COMBAT",
  "CONTROL_ESTABLISHED",
  "ACTION_CARD_PLAYED",
  "LEADER_PLAYED",
  "TECH_EXHAUSTED",
  "OBJECTIVE_SCORED",
  "PRODUCTION",
  "RETREAT",
  "MANUAL_COMMAND",
] satisfies GameSubEvent["type"][]);

export function SubEventList({
  subEvents,
  systemName,
  actorFaction,
}: {
  subEvents: GameSubEvent[];
  systemName: SystemNameResolver;
  actorFaction?: string | null;
}) {
  return (
    <div className={classes.subEvents}>
      {subEvents.map((sub, index) => {
        if (!KNOWN_SUB_EVENT_TYPES.has(sub.type)) return null;
        return (
          <div key={`${sub.type}-${index}`} className={classes.subEventLine}>
            <SubEventContent
              sub={sub}
              systemName={systemName}
              actorFaction={actorFaction}
            />
          </div>
        );
      })}
    </div>
  );
}
