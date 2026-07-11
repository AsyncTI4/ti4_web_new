import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Loader, Text, Tooltip } from "@mantine/core";
import {
  IconArrowsLeftRight,
  IconBuildingFactory2,
  IconMap2,
  IconPlayerPlayFilled,
  IconSwords,
  IconTargetArrow,
  IconTrophy,
} from "@tabler/icons-react";
import { CircularFactionIcon } from "@/shared/ui/CircularFactionIcon";
import { SmoothPopover } from "@/shared/ui/SmoothPopover";
import { useGameEvents } from "@/hooks/useGameEvents";
import { useMapStatePreview } from "@/hooks/useGameContext";
import { usePlayerData } from "@/hooks/usePlayerData";
import type {
  GameEvent,
  GameSubEvent,
  PlayerDataResponse,
} from "@/entities/data/types";
import type { MapStatePreview } from "@/app/providers/context/types";
import { getStrategyCardByInitiative } from "@/entities/lookup/strategyCards";
import { ActionCardDetailsCard } from "@/domains/player/components/ActionCardDetailsCard";
import { LeaderDetailsCard } from "@/domains/player/components/LeaderDetailsCard";
import { PromissoryNoteCard } from "@/domains/player/components/PromissoryNoteCard";
import { RelicCard } from "@/domains/player/components/Relic";
import { SecretObjectiveCard } from "@/domains/player/components/SecretObjectiveCard";
import { TechCard } from "@/domains/player/components/Tech";
import { BreakthroughCard } from "@/domains/player/components/Breakthrough/BreakthroughCard";
import { findMovementBaseline } from "@/utils/compactMovementState";
import {
  formatAbsoluteTime,
  formatRelativeTime,
  prettifyId,
  resolveAgendaName,
  resolveCardName,
  resolveObjectiveName,
  resolvePlanetName,
  resolvePlanetsList,
  resolveSystemName,
  resolveTechName,
  resolveUnitName,
} from "./eventFormatting";
import classes from "./GameEventPanel.module.css";

const MAX_VISIBLE = 150;
const selectTilePositions = (data: PlayerDataResponse) => data.tilePositions;

// Colored type-badge config per card archetype (distinct hues).
const CARD_BADGES: Record<string, { label: string; hue: string }> = {
  CARD_PLAY_ACTION_CARD: { label: "AC Played", hue: "oklch(0.66 0.18 45)" },
  CARD_PLAY_PROMISSORY_NOTE: {
    label: "Played Promissory Note",
    hue: "oklch(0.65 0.16 300)",
  },
  CARD_PLAY_AGENT: { label: "Agent", hue: "oklch(0.68 0.15 190)" },
  CARD_PLAY_HERO: { label: "Hero", hue: "oklch(0.64 0.18 330)" },
  CARD_PLAY_RELIC: { label: "Relic Exhausted", hue: "oklch(0.7 0.14 90)" },
  CARD_PLAY_TECH_EXHAUST: { label: "Tech", hue: "oklch(0.66 0.15 150)" },
  CARD_PLAY_BREAKTHROUGH: {
    label: "Breakthrough",
    hue: "oklch(0.64 0.17 330)",
  },
  CARD_PLAY_ABILITY: { label: "Ability", hue: "oklch(0.6 0.02 260)" },
};

function TypeBadge({ label, hue }: { label: string; hue: string }) {
  return (
    <span
      className={classes.badge}
      style={{ "--badge-hue": hue } as React.CSSProperties}
    >
      {label}
    </span>
  );
}

function ActorIcon({ faction }: { faction: string | null }) {
  if (!faction) return <span className={classes.glyph}>·</span>;
  return (
    <Tooltip label={prettifyId(faction)} withArrow openDelay={300}>
      <span style={{ display: "flex" }}>
        <CircularFactionIcon faction={faction} size={20} />
      </span>
    </Tooltip>
  );
}

function str(
  payload: Record<string, unknown>,
  key: string,
): string | undefined {
  const v = payload[key];
  return typeof v === "string" && v.length > 0 ? v : undefined;
}
function num(
  payload: Record<string, unknown>,
  key: string,
): number | undefined {
  const v = payload[key];
  return typeof v === "number" ? v : undefined;
}

function eventDescription(
  payload: Record<string, unknown>,
): string | undefined {
  return (
    str(payload, "description") ??
    str(payload, "summary") ??
    str(payload, "message")
  );
}

function EventDescription({ children }: { children?: string }) {
  if (!children) return null;
  return <div className={classes.description}>{children}</div>;
}

function Headline({
  title,
  meta,
  beforeTitle,
}: {
  title: React.ReactNode;
  meta?: React.ReactNode;
  beforeTitle?: React.ReactNode;
}) {
  return (
    <div className={classes.headline}>
      {meta && <div className={classes.metaLine}>{meta}</div>}
      <div className={classes.titleLine}>
        {beforeTitle}
        <span className={classes.primary}>{title}</span>
      </div>
    </div>
  );
}

function cardEventTitle(archetype: string, cardName: string): string {
  if (
    archetype === "CARD_PLAY_AGENT" ||
    archetype === "CARD_PLAY_RELIC" ||
    archetype === "CARD_PLAY_TECH_EXHAUST"
  ) {
    return `Exhausted ${cardName}`;
  }
  return cardName;
}

function strategyCardName(
  payload: Record<string, unknown>,
  initiative?: number,
): string {
  const explicitName =
    str(payload, "scName") ?? str(payload, "strategyCardName");
  if (explicitName) return explicitName;

  if (initiative === undefined) return "strategy card";
  return getStrategyCardByInitiative(initiative)?.name ?? "strategy card";
}

function pluralize(
  count: number,
  singular: string,
  plural = `${singular}s`,
): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

type TransactionItem = {
  sender: string;
  receiver: string;
  type: string;
  detail: string;
};

type TransactionSide = {
  sender: string;
  items: string[];
};

function parseTransactionItem(item: string): TransactionItem | null {
  const parts = item.split("_");
  if (parts.length < 4) return null;
  const sender = parts[0].replace(/^sending/, "");
  const receiver = parts[1].replace(/^receiving/, "");
  const type = parts[2];
  const detail = parts.slice(3).join("_");
  if (!sender || !receiver || !type || !detail) return null;
  return { sender, receiver, type, detail };
}

function genericCount(detail: string): { label: string; count: number } {
  const match = detail.match(/^(.*?)(\d+)$/);
  if (!match) return { label: detail, count: 1 };
  return { label: match[1], count: Number(match[2]) };
}

function formatTransactionItem(item: TransactionItem): string | null {
  const { type, detail } = item;

  switch (type) {
    case "TGs":
      return pluralize(Number(detail), "trade good");
    case "Comms":
      return pluralize(Number(detail), "commodity", "commodities");
    case "ACs": {
      const { label, count } = genericCount(detail);
      return label === "generic"
        ? pluralize(count, "action card")
        : resolveCardName("CARD_PLAY_ACTION_CARD", detail);
    }
    case "PNs": {
      const { label, count } = genericCount(detail);
      if (label !== "generic") return pluralize(1, "promissory note");
      return pluralize(count, "promissory note");
    }
    case "SOs": {
      const { count } = genericCount(detail);
      return pluralize(count, "secret objective");
    }
    case "Frags": {
      const { label, count } = genericCount(detail);
      return `${pluralize(count, `${prettifyId(label)} fragment`)}`;
    }
    case "SendDebt":
      return pluralize(Number(detail), "debt token");
    case "ClearDebt":
      return `cleared ${pluralize(Number(detail), "debt token")}`;
    case "Planets":
    case "AlliancePlanets":
    case "dmz":
      return resolvePlanetName(detail.replace(/exhausted|refreshed/g, ""));
    case "Technology":
      return resolveTechName(detail);
    case "shipOrders":
    case "starCharts":
      return resolveCardName("CARD_PLAY_RELIC", detail);
    case "action":
      return `${prettifyId(detail)} action`;
    case "details":
      return null;
    default:
      return prettifyId(detail || type);
  }
}

function transactionSides(
  rawItems: string[],
  from?: string,
  to?: string,
): TransactionSide[] {
  const parsed = rawItems
    .map(parseTransactionItem)
    .filter((item): item is TransactionItem => item !== null);
  if (parsed.length === 0) return [];

  const bySender = new Map<string, string[]>();
  for (const item of parsed) {
    const formatted = formatTransactionItem(item);
    if (!formatted) continue;
    const existing = bySender.get(item.sender) ?? [];
    existing.push(formatted);
    bySender.set(item.sender, existing);
  }

  const orderedSenders = [from, to].filter(
    (sender): sender is string => !!sender && bySender.has(sender),
  );
  for (const sender of bySender.keys()) {
    if (!orderedSenders.includes(sender)) orderedSenders.push(sender);
  }

  return orderedSenders.map((sender) => ({
    sender,
    items: bySender.get(sender) ?? [],
  }));
}

function TransactionItems({ sides }: { sides: TransactionSide[] }) {
  if (sides.length === 0) return null;

  return (
    <div className={classes.transactionGrid}>
      {sides.map((side) => (
        <div key={side.sender} className={classes.transactionSide}>
          <div className={classes.transactionSender}>
            {prettifyId(side.sender)}
          </div>
          <ul className={classes.transactionList}>
            {side.items.map((item, index) => (
              <li key={`${side.sender}-${item}-${index}`}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function EventPopover({
  children,
  details,
  buttonClassName,
}: {
  children: React.ReactNode;
  details: React.ReactNode;
  buttonClassName?: string;
}) {
  const [opened, setOpened] = useState(false);

  return (
    <SmoothPopover opened={opened} onChange={setOpened}>
      <SmoothPopover.Target>
        <button
          type="button"
          className={buttonClassName ?? classes.cardEventButton}
          onClick={() => setOpened(true)}
        >
          {children}
        </button>
      </SmoothPopover.Target>
      <SmoothPopover.Dropdown>{details}</SmoothPopover.Dropdown>
    </SmoothPopover>
  );
}

// ---------------------------------------------------------------------------
// Structured tactical-action sub-events (payload.subEvents)
// ---------------------------------------------------------------------------

/** Validated cast: keep only entries shaped like a sub-event. Unknown `type`
 *  values pass through and are dropped at render time. */
function parseSubEvents(value: unknown): GameSubEvent[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (e): e is GameSubEvent =>
      typeof e === "object" &&
      e !== null &&
      typeof (e as { type?: unknown }).type === "string",
  );
}

type SystemNameResolver = (position: string) => string;

function SubFaction({ faction }: { faction: string }) {
  if (!faction) return null;
  return (
    <span className={classes.subFaction}>
      <CircularFactionIcon faction={faction} size={13} />
      {prettifyId(faction)}
    </span>
  );
}

function unitBreakdown(units: Record<string, number>): string {
  return Object.entries(units)
    .map(([id, count]) => `${count}× ${resolveUnitName(id)}`)
    .join(", ");
}

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

function ProductionSummary({
  units,
  cost,
}: {
  units: Record<string, number> | null;
  cost: number | null;
}) {
  const breakdown =
    units && Object.keys(units).length > 0 ? unitBreakdown(units) : null;
  return (
    <>
      {breakdown && <span>{breakdown}</span>}
      {typeof cost === "number" && (
        <span className={classes.subMuted}>
          {breakdown ? "· " : ""}
          {pluralize(cost, "resource")}
        </span>
      )}
    </>
  );
}

function SubEventLine({
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
        <div className={classes.subEventLine}>
          <span className={classes.combat}>
            <IconSwords size={11} stroke={2} />
            {sub.kind === "space"
              ? sub.tile
                ? systemName(sub.tile)
                : "Combat"
              : sub.planet
                ? resolvePlanetName(sub.planet)
                : "Combat"}
          </span>
          {sub.vsFaction && (
            <>
              <span className={classes.subMuted}>vs</span>
              <SubFaction faction={sub.vsFaction} />
            </>
          )}
        </div>
      );

    case "CONTROL_ESTABLISHED": {
      const controllingFaction = sub.faction ?? actorFaction;
      return (
        <div className={classes.subEventLine}>
          {controllingFaction && <SubFaction faction={controllingFaction} />}
          <span>Took control of {resolvePlanetName(sub.planet)}</span>
        </div>
      );
    }

    case "ACTION_CARD_PLAYED": {
      const name =
        sub.cardName || resolveCardName("CARD_PLAY_ACTION_CARD", sub.cardId);
      return (
        <div className={classes.subEventLine}>
          <EventPopover
            buttonClassName={classes.subEventButton}
            details={<ActionCardDetailsCard actionCardId={sub.cardId} />}
          >
            <SubFaction faction={sub.faction} />
            <span className={classes.subMuted}>played</span>
            <span className={classes.subCardName}>{name}</span>
          </EventPopover>
        </div>
      );
    }

    case "LEADER_PLAYED": {
      const name = resolveCardName(
        sub.leaderType === "HERO" ? "CARD_PLAY_HERO" : "CARD_PLAY_AGENT",
        sub.leaderId,
      );
      return (
        <div className={classes.subEventLine}>
          <EventPopover
            buttonClassName={classes.subEventButton}
            details={<LeaderDetailsCard leaderId={sub.leaderId} />}
          >
            <SubFaction faction={sub.faction} />
            <span className={classes.subMuted}>
              {sub.leaderType === "AGENT" ? "exhausted" : "played"}
            </span>
            <span className={classes.subCardName}>{name}</span>
          </EventPopover>
        </div>
      );
    }

    case "TECH_EXHAUSTED":
      return (
        <div className={classes.subEventLine}>
          <EventPopover
            buttonClassName={classes.subEventButton}
            details={<TechCard techId={sub.techId} />}
          >
            <SubFaction faction={sub.faction} />
            <span className={classes.subMuted}>exhausted</span>
            <span className={classes.subCardName}>
              {resolveTechName(sub.techId)}
            </span>
          </EventPopover>
        </div>
      );

    case "OBJECTIVE_SCORED": {
      const objectiveName = resolveObjectiveName(sub.objectiveId);
      const content = (
        <>
          <SubFaction faction={sub.faction} />
          <span className={classes.subMuted}>{sub.category}</span>
          <span className={classes.subCardName}>{objectiveName}</span>
        </>
      );
      return (
        <div className={classes.subEventLine}>
          {sub.category === "SECRET" && sub.objectiveId ? (
            <EventPopover
              buttonClassName={classes.subEventButton}
              details={<SecretObjectiveCard secretId={sub.objectiveId} />}
            >
              {content}
            </EventPopover>
          ) : (
            content
          )}
        </div>
      );
    }

    case "PRODUCTION":
      return (
        <div className={classes.subEventLine}>
          <span className={classes.productionPlace}>
            <IconBuildingFactory2 size={11} stroke={2} />
            {sub.tile ? systemName(sub.tile) : "Production"}
          </span>
          <ProductionSummary units={sub.units} cost={sub.cost} />
        </div>
      );

    case "RETREAT":
      return (
        <div className={classes.subEventLine}>
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
        </div>
      );

    case "MANUAL_COMMAND":
      return (
        <div className={classes.subEventLine}>
          <span className={classes.mono}>{sub.command}</span>
        </div>
      );

    default:
      // Unknown future sub-event types: render nothing rather than crash.
      return null;
  }
}

// ---------------------------------------------------------------------------
// Row body per archetype. Returns null for events we deliberately drop.
// ---------------------------------------------------------------------------
function EventBody({
  event,
  systemName,
}: {
  event: GameEvent;
  systemName: SystemNameResolver;
}) {
  const p = event.payload ?? {};

  if (event.archetype in CARD_BADGES) {
    const { label, hue } = CARD_BADGES[event.archetype];
    const cardId = str(p, "cardId") ?? "";
    const cardName =
      str(p, "cardName") ?? resolveCardName(event.archetype, cardId);
    const content = (
      <>
        <Headline
          meta={<TypeBadge label={label} hue={hue} />}
          title={cardEventTitle(event.archetype, cardName)}
        />
        <EventDescription>{eventDescription(p)}</EventDescription>
      </>
    );

    if (event.archetype === "CARD_PLAY_ACTION_CARD" && cardId) {
      return (
        <EventPopover details={<ActionCardDetailsCard actionCardId={cardId} />}>
          {content}
        </EventPopover>
      );
    }

    if (event.archetype === "CARD_PLAY_PROMISSORY_NOTE" && cardId) {
      return (
        <EventPopover
          details={<PromissoryNoteCard promissoryNoteId={cardId} />}
        >
          {content}
        </EventPopover>
      );
    }

    if (
      (event.archetype === "CARD_PLAY_AGENT" ||
        event.archetype === "CARD_PLAY_HERO") &&
      cardId
    ) {
      return (
        <EventPopover details={<LeaderDetailsCard leaderId={cardId} />}>
          {content}
        </EventPopover>
      );
    }

    if (event.archetype === "CARD_PLAY_RELIC" && cardId) {
      return (
        <EventPopover details={<RelicCard relicId={cardId} />}>
          {content}
        </EventPopover>
      );
    }

    if (event.archetype === "CARD_PLAY_TECH_EXHAUST" && cardId) {
      return (
        <EventPopover details={<TechCard techId={cardId} />}>
          {content}
        </EventPopover>
      );
    }

    if (event.archetype === "CARD_PLAY_BREAKTHROUGH" && cardId) {
      return (
        <EventPopover details={<BreakthroughCard breakthroughId={cardId} />}>
          {content}
        </EventPopover>
      );
    }

    return content;
  }

  switch (event.archetype) {
    case "TACTICAL_ACTION": {
      const system = str(p, "activeSystem");
      const planets = str(p, "planetsTaken");
      const combat = str(p, "combat");
      const summary = str(p, "summary");
      const planetNames = planets ? resolvePlanetsList(planets) : [];
      const subEvents = parseSubEvents(p.subEvents);
      const headline = (
        <Headline
          title="Tactical action"
          meta={
            system ? (
              <span className={classes.sysChip}>{systemName(system)}</span>
            ) : null
          }
        />
      );

      // Structured sub-events take priority; the text summary is only the
      // fallback for older events that don't carry them.
      if (subEvents.length > 0) {
        return (
          <>
            {headline}
            <div className={classes.subEvents}>
              {subEvents.map((sub, index) => (
                <SubEventLine
                  key={`${sub.type}-${index}`}
                  sub={sub}
                  systemName={systemName}
                  actorFaction={event.faction}
                />
              ))}
            </div>
          </>
        );
      }

      const sub =
        planetNames.length > 0 || combat ? (
          <div className={classes.subline}>
            {planetNames.length > 0 && (
              <span>Took {planetNames.join(", ")}</span>
            )}
            {combat && (
              <span className={classes.combat}>
                <IconSwords size={11} stroke={2} />
                {combat.split("_").map(prettifyId).join(" vs ")}
              </span>
            )}
          </div>
        ) : null;
      const body = (
        <>
          {headline}
          {sub}
          <EventDescription>{summary}</EventDescription>
        </>
      );
      return body;
    }

    case "STATUS_SCORING": {
      const subEvents = parseSubEvents(p.subEvents);
      return (
        <>
          <Headline
            title="Status phase scoring"
            meta={<TypeBadge label="Status" hue="oklch(0.68 0.15 145)" />}
          />
          {subEvents.length > 0 && (
            <div className={classes.subEvents}>
              {subEvents.map((sub, index) => (
                <SubEventLine
                  key={`${sub.type}-${index}`}
                  sub={sub}
                  systemName={systemName}
                  actorFaction={event.faction}
                />
              ))}
            </div>
          )}
        </>
      );
    }

    case "PRODUCTION": {
      const tile = str(p, "tile");
      const units =
        p.units && typeof p.units === "object" && !Array.isArray(p.units)
          ? (p.units as Record<string, number>)
          : null;
      const cost = num(p, "cost");
      return (
        <>
          <Headline
            title="Produced"
            beforeTitle={
              <span className={classes.productionPlace}>
                <IconBuildingFactory2 size={13} stroke={2} />
              </span>
            }
            meta={
              tile ? (
                <span className={classes.sysChip}>{systemName(tile)}</span>
              ) : null
            }
          />
          {(units !== null || cost !== undefined) && (
            <div className={classes.subline}>
              <ProductionSummary units={units} cost={cost ?? null} />
            </div>
          )}
        </>
      );
    }

    case "MANUAL_COMMAND": {
      const command = str(p, "command");
      if (!command) return null;
      return (
        <div className={classes.titleLine}>
          <span className={classes.mono}>{command}</span>
        </div>
      );
    }

    case "TURN": {
      if (p.passed !== true) return null;
      return <Headline title="passed" />;
    }

    case "TECH_RESEARCHED": {
      const name = resolveTechName(str(p, "techId") ?? "");
      const payment = str(p, "paymentType");
      return (
        <>
          <Headline
            title={`Researched ${name}`}
            meta={
              <>
                <TypeBadge label="Tech" hue="oklch(0.66 0.15 150)" />
                {payment && (
                  <span className={classes.subline}>{prettifyId(payment)}</span>
                )}
              </>
            }
          />
          <EventDescription>{eventDescription(p)}</EventDescription>
        </>
      );
    }

    case "SC_PLAYED": {
      const name = str(p, "scName");
      return (
        <>
          <Headline title={`Played ${name ?? "strategy card"}`} />
          <EventDescription>{eventDescription(p)}</EventDescription>
        </>
      );
    }

    case "SC_PICKED": {
      const n = num(p, "scNumber");
      const name = strategyCardName(p, n);
      return (
        <>
          <Headline title={`Picked ${name}`} />
          <EventDescription>{eventDescription(p)}</EventDescription>
        </>
      );
    }

    case "OBJECTIVE_SCORED": {
      const category = str(p, "category") ?? "PUBLIC";
      const id = str(p, "objectiveId");
      const hue =
        category === "SECRET"
          ? "oklch(0.62 0.19 20)"
          : category === "CUSTODIAN"
            ? "oklch(0.7 0.14 90)"
            : "oklch(0.68 0.15 145)";
      const content = (
        <>
          <Headline
            title={id ? resolveObjectiveName(id) : "Scored objective"}
            beforeTitle={
              <span className={classes.trophy}>
                <IconTargetArrow size={14} stroke={2} />
              </span>
            }
            meta={<TypeBadge label={category} hue={hue} />}
          />
          <EventDescription>{eventDescription(p)}</EventDescription>
        </>
      );
      if (category === "SECRET" && id) {
        return (
          <EventPopover details={<SecretObjectiveCard secretId={id} />}>
            {content}
          </EventPopover>
        );
      }
      return content;
    }

    case "AGENDA_RESOLVED": {
      const agendaId = str(p, "agendaId") ?? "";
      const name =
        str(p, "agendaName") ??
        (agendaId && !/^\d+$/.test(agendaId)
          ? resolveAgendaName(agendaId)
          : "Agenda");
      const outcome = str(p, "outcome");
      return (
        <>
          <Headline
            title={name}
            meta={<TypeBadge label="Agenda" hue="oklch(0.68 0.16 60)" />}
          />
          <EventDescription>
            {outcome ? `Vote resolved: ${prettifyId(outcome)}` : undefined}
          </EventDescription>
        </>
      );
    }

    case "TRANSACTION": {
      const from = str(p, "from");
      const to = str(p, "to");
      const items = Array.isArray(p.items) ? (p.items as string[]) : [];
      const sides = transactionSides(items, from, to);
      return (
        <>
          <div className={classes.titleLine}>
            {from && <CircularFactionIcon faction={from} size={16} />}
            <span className={classes.transactionArrow}>
              <IconArrowsLeftRight size={13} stroke={2} />
            </span>
            {to && <CircularFactionIcon faction={to} size={16} />}
          </div>
          {sides.length > 0 ? (
            <TransactionItems sides={sides} />
          ) : (
            <EventDescription>{eventDescription(p)}</EventDescription>
          )}
        </>
      );
    }

    default:
      return (
        <>
          <Headline title={prettifyId(event.archetype)} />
          <EventDescription>{eventDescription(p)}</EventDescription>
        </>
      );
  }
}

function EventRow({
  event,
  now,
  systemName,
}: {
  event: GameEvent;
  now: number;
  systemName: SystemNameResolver;
}) {
  const body = <EventBody event={event} systemName={systemName} />;
  const isPassed = event.archetype === "TURN";
  const isTransaction = event.archetype === "TRANSACTION";
  return (
    <div
      className={`${classes.row} ${isPassed ? classes.passed : ""} ${isTransaction ? classes.transactionRow : ""}`}
    >
      <div className={classes.iconCell}>
        {isTransaction ? (
          <span className={classes.transactionEventIcon}>
            <IconArrowsLeftRight size={16} stroke={2} />
          </span>
        ) : (
          <ActorIcon faction={event.faction} />
        )}
      </div>
      <div className={classes.content}>{body}</div>
      <Tooltip
        label={formatAbsoluteTime(event.timestamp)}
        withArrow
        openDelay={300}
      >
        <span className={classes.time}>
          {formatRelativeTime(event.timestamp, now)}
        </span>
      </Tooltip>
    </div>
  );
}

// Inline section dividers for PHASE_STARTED / ROUND_STARTED (faction is null;
// like GAME_ENDED these bypass EventRow, so no actor icon / timestamp cell).
function SectionDividerRow({ label }: { label: string }) {
  return (
    <div className={classes.sectionDivider}>
      <span className={classes.sectionDividerLabel}>{label}</span>
      <span className={classes.sectionDividerRule} />
    </div>
  );
}

function sectionDividerLabel(event: GameEvent): string | null {
  if (event.archetype === "PHASE_STARTED") {
    const phase = str(event.payload ?? {}, "phase");
    return phase ? `${prettifyId(phase)} Phase` : null;
  }
  // ROUND_STARTED: the sticky round headers already announce the round at the
  // top of each group, so this renders as a minimal in-scroll divider.
  const round = num(event.payload ?? {}, "round");
  return round !== undefined ? `Round ${round}` : null;
}

function GameEndedRow({ event }: { event: GameEvent }) {
  const winners = Array.isArray(event.payload?.winner)
    ? (event.payload.winner as string[])
    : [];
  return (
    <div className={classes.gameEnded}>
      <span className={classes.trophy}>
        <IconTrophy size={20} stroke={2} />
      </span>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          flexWrap: "wrap",
        }}
      >
        {winners.map((w) => (
          <CircularFactionIcon key={w} faction={w} size={22} />
        ))}
        <span className={classes.gameEndedText}>
          {winners.length > 0
            ? `${winners.map(prettifyId).join(" & ")} ${winners.length > 1 ? "win" : "wins"}!`
            : "Game ended"}
        </span>
      </div>
    </div>
  );
}

export function GameEventPanel({ animated = true }: { animated?: boolean }) {
  const params = useParams<{ mapid: string }>();
  const gameId = params.mapid ?? "";
  const { data: tilePositions } = usePlayerData(gameId, {
    select: selectTilePositions,
  });
  const setMapStatePreview = useMapStatePreview();
  const { data, isLoading, isError } = useGameEvents(gameId);
  const [showAll, setShowAll] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const activePreviewRef = useRef<{
    snapshotSeq: number;
    replayEventSeq: number | null;
  }>();

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    activePreviewRef.current = undefined;
    setMapStatePreview(null);
    return () => {
      activePreviewRef.current = undefined;
      setMapStatePreview(null);
    };
  }, [gameId, animated, setMapStatePreview]);

  const showMapPreview = (
    eventSeq: number,
    frame: {
      preview: MapStatePreview;
      snapshotSeq: number;
      replaysChange: boolean;
    },
  ) => {
    const replayEventSeq = animated && frame.replaysChange ? eventSeq : null;
    const active = activePreviewRef.current;
    if (active?.snapshotSeq === frame.snapshotSeq && replayEventSeq === null) {
      activePreviewRef.current = {
        snapshotSeq: frame.snapshotSeq,
        replayEventSeq: null,
      };
      return;
    }
    if (
      active?.snapshotSeq === frame.snapshotSeq &&
      active.replayEventSeq === replayEventSeq
    )
      return;

    activePreviewRef.current = {
      snapshotSeq: frame.snapshotSeq,
      replayEventSeq,
    };
    setMapStatePreview(
      replayEventSeq === null
        ? { mapState: frame.preview.mapState }
        : frame.preview,
    );
  };

  // Drop TURN rows that aren't "passed" (rhythm markers only), keep the rest.
  const { visibleEvents, hasHidden } = useMemo(() => {
    const kept = (data ?? []).filter(
      (e) => e.archetype !== "TURN" || e.payload?.passed === true,
    );
    return {
      visibleEvents: showAll ? kept : kept.slice(-MAX_VISIBLE),
      hasHidden: !showAll && kept.length > MAX_VISIBLE,
    };
  }, [data, showAll]);

  // Snapshots are sparse: an event without one has the same map as the most
  // recent earlier event that does. Build this from the complete event list so
  // a snapshot still carries into the visible window when earlier rows are
  // hidden behind "Show earlier events".
  const historicalMapTimeline = useMemo(() => {
    const previews = new Map<
      number,
      {
        preview: MapStatePreview;
        snapshotSeq: number;
        replaysChange: boolean;
      }
    >();
    const changedEvents = new Set<number>();
    const mapStateHistory: string[] = [];
    let latestMapState: string | undefined;
    let latestSnapshotSeq: number | undefined;
    for (const event of [...(data ?? [])].sort((a, b) => a.seq - b.seq)) {
      if (event.mapState) {
        const previousMapState =
          event.archetype === "TACTICAL_ACTION" &&
          event.movementState &&
          event.faction
            ? (findMovementBaseline(
                mapStateHistory,
                event.movementState,
                event.faction,
              ) ?? latestMapState)
            : latestMapState;
        const mapChanged =
          previousMapState !== undefined && event.mapState !== previousMapState;
        const replaysChange =
          mapChanged && event.archetype !== "TRANSACTION";
        latestMapState = event.mapState;
        mapStateHistory.push(event.mapState);
        latestSnapshotSeq = event.seq;
        if (replaysChange) changedEvents.add(event.seq);
        const subEvents = replaysChange
          ? parseSubEvents(event.payload?.subEvents)
          : [];
        const retreats = subEvents.filter(
          (sub): sub is Extract<GameSubEvent, { type: "RETREAT" }> =>
            sub.type === "RETREAT",
        );
        const combats = subEvents.filter(
          (sub): sub is Extract<GameSubEvent, { type: "COMBAT" }> =>
            sub.type === "COMBAT",
        );
        previews.set(event.seq, {
          preview: replaysChange
            ? {
                mapState: latestMapState,
                previousMapState,
                movementState: event.movementState,
                retreats,
                combats,
                activeFaction: event.faction,
                tacticalPosition:
                  event.archetype === "TACTICAL_ACTION"
                    ? str(event.payload, "activeSystem")
                    : undefined,
              }
            : { mapState: latestMapState },
          snapshotSeq: latestSnapshotSeq,
          replaysChange,
        });
      } else if (latestMapState && latestSnapshotSeq !== undefined) {
        previews.set(event.seq, {
          preview: { mapState: latestMapState },
          snapshotSeq: latestSnapshotSeq,
          replaysChange: false,
        });
      }
    }
    return { previews, changedEvents };
  }, [data]);

  // Group by round, newest round first, newest event first within a round.
  const grouped = useMemo(() => {
    const byRound = new Map<number, GameEvent[]>();
    for (const e of visibleEvents) {
      const arr = byRound.get(e.round) ?? [];
      arr.push(e);
      byRound.set(e.round, arr);
    }
    return [...byRound.entries()]
      .sort((a, b) => b[0] - a[0])
      .map(([round, events]) => ({
        round,
        events: [...events].sort((a, b) => b.seq - a.seq),
      }));
  }, [visibleEvents]);

  const positionToSystemId = useMemo(() => {
    const map: Record<string, string> = {};
    for (const entry of tilePositions ?? []) {
      const [position, systemId] = entry.split(":");
      if (position && systemId) map[position] = systemId;
    }
    return map;
  }, [tilePositions]);

  const systemName = useMemo<SystemNameResolver>(
    () => (position) => resolveSystemName(position, positionToSystemId),
    [positionToSystemId],
  );

  if (isLoading) {
    return (
      <div
        className={classes.stateBox}
        style={{ display: "flex", gap: 8, alignItems: "center" }}
      >
        <Loader size="xs" color="gray" />
        <Text size="sm" c="dimmed">
          Loading events…
        </Text>
      </div>
    );
  }

  if (isError) {
    return (
      <Text className={classes.stateBox} size="sm" c="dimmed">
        Couldn't load the event log. It may not be available for this game yet.
      </Text>
    );
  }

  if (grouped.length === 0) {
    return (
      <Text className={classes.stateBox} size="sm" c="dimmed">
        No events recorded yet — events start appearing as the game is played.
      </Text>
    );
  }

  return (
    <div
      className={classes.root}
      onMouseLeave={() => {
        activePreviewRef.current = undefined;
        setMapStatePreview(null);
      }}
    >
      {grouped.map(({ round, events }) => (
        <div key={round}>
          <div className={classes.roundHeader}>
            <span className={classes.roundLabel}>Round {round}</span>
            <span className={classes.roundRule} />
          </div>
          {events.map((event) => {
            const historicalMapFrame = historicalMapTimeline.previews.get(
              event.seq,
            );
            let row: React.ReactNode;
            if (event.archetype === "GAME_ENDED") {
              row = <GameEndedRow event={event} />;
            } else if (
              event.archetype === "PHASE_STARTED" ||
              event.archetype === "ROUND_STARTED"
            ) {
              const label = sectionDividerLabel(event);
              row = label ? <SectionDividerRow label={label} /> : null;
            } else {
              row = (
                <EventRow event={event} now={now} systemName={systemName} />
              );
            }

            if (!row) return null;
            const hasMapTimeline = historicalMapTimeline.changedEvents.has(
              event.seq,
            );
            return (
              <div
                key={event.seq}
                className={hasMapTimeline ? classes.mapChangeEvent : undefined}
                onMouseEnter={() => {
                  if (!historicalMapFrame) return;
                  showMapPreview(event.seq, historicalMapFrame);
                }}
              >
                {hasMapTimeline && (
                  <span
                    className={classes.mapChangeIndicator}
                    title={
                      animated
                        ? "Hover to replay this map change"
                        : "Hover to show the map after this event"
                    }
                    aria-label={
                      animated ? "Animated map replay" : "Map state change"
                    }
                  >
                    {animated ? (
                      <IconPlayerPlayFilled size={9} />
                    ) : (
                      <IconMap2 size={10} stroke={2} />
                    )}
                  </span>
                )}
                {row}
              </div>
            );
          })}
        </div>
      ))}
      {hasHidden && (
        <button
          type="button"
          className={classes.showEarlier}
          onClick={() => setShowAll(true)}
        >
          Show earlier events
        </button>
      )}
    </div>
  );
}
