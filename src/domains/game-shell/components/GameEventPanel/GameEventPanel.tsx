import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Loader, Text, Tooltip } from "@mantine/core";
import {
  IconArrowsLeftRight,
  IconSwords,
  IconTargetArrow,
  IconTrophy,
} from "@tabler/icons-react";
import { CircularFactionIcon } from "@/shared/ui/CircularFactionIcon";
import { SmoothPopover } from "@/shared/ui/SmoothPopover";
import { useGameEvents } from "@/hooks/useGameEvents";
import type { GameEvent, GameSubEvent } from "@/entities/data/types";
import { SC_COLORS, SC_NUMBER_COLORS } from "@/entities/data/strategyCardColors";
import { getStrategyCardByInitiative } from "@/entities/lookup/strategyCards";
import { ActionCardDetailsCard } from "@/domains/player/components/ActionCardDetailsCard";
import { LeaderDetailsCard } from "@/domains/player/components/LeaderDetailsCard";
import { TechCard } from "@/domains/player/components/Tech";
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
  summarizeVotes,
} from "./eventFormatting";
import classes from "./GameEventPanel.module.css";

const MAX_VISIBLE = 150;

// Colored type-badge config per card archetype (distinct hues).
const CARD_BADGES: Record<string, { label: string; hue: string }> = {
  CARD_PLAY_ACTION_CARD: { label: "AC Played", hue: "oklch(0.62 0.19 250)" },
  CARD_PLAY_PROMISSORY_NOTE: { label: "PN", hue: "oklch(0.65 0.16 300)" },
  CARD_PLAY_AGENT: { label: "Agent", hue: "oklch(0.68 0.15 190)" },
  CARD_PLAY_HERO: { label: "Hero", hue: "oklch(0.68 0.19 30)" },
  CARD_PLAY_RELIC: { label: "Relic", hue: "oklch(0.7 0.14 90)" },
  CARD_PLAY_TECH_EXHAUST: { label: "Tech", hue: "oklch(0.66 0.15 150)" },
  CARD_PLAY_BREAKTHROUGH: { label: "BT", hue: "oklch(0.64 0.17 330)" },
  CARD_PLAY_ABILITY: { label: "Ability", hue: "oklch(0.6 0.02 260)" },
};

// SC_NUMBER_COLORS values look like "violet.9"; convert to a Mantine CSS var.
function scNumberBg(n: number): string {
  const token = SC_NUMBER_COLORS[SC_COLORS[n]];
  if (!token) return "var(--mantine-color-gray-7)";
  return `var(--mantine-color-${token.replace(".", "-")})`;
}

function TypeBadge({ label, hue }: { label: string; hue: string }) {
  return (
    <span className={classes.badge} style={{ "--badge-hue": hue } as React.CSSProperties}>
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

function str(payload: Record<string, unknown>, key: string): string | undefined {
  const v = payload[key];
  return typeof v === "string" && v.length > 0 ? v : undefined;
}
function num(payload: Record<string, unknown>, key: string): number | undefined {
  const v = payload[key];
  return typeof v === "number" ? v : undefined;
}

function eventDescription(payload: Record<string, unknown>): string | undefined {
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

function cardEventTitle(archetype: string, cardName: string): string {
  if (archetype === "CARD_PLAY_AGENT" || archetype === "CARD_PLAY_TECH_EXHAUST") {
    return `Exhausted ${cardName}`;
  }
  return cardName;
}

function strategyCardName(payload: Record<string, unknown>, initiative?: number): string {
  const explicitName = str(payload, "scName") ?? str(payload, "strategyCardName");
  if (explicitName) return explicitName;

  if (initiative === undefined) return "strategy card";
  return getStrategyCardByInitiative(initiative)?.name ?? "strategy card";
}

function pluralize(count: number, singular: string, plural = `${singular}s`): string {
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

function formatTransactionItem(item: TransactionItem): string {
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
      const { count } = genericCount(detail);
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
      return detail.replace(/fin777/g, " ");
    default:
      return prettifyId(detail || type);
  }
}

function transactionSides(rawItems: string[], from?: string, to?: string): TransactionSide[] {
  const parsed = rawItems
    .map(parseTransactionItem)
    .filter((item): item is TransactionItem => item !== null);
  if (parsed.length === 0) return [];

  const bySender = new Map<string, string[]>();
  for (const item of parsed) {
    const formatted = formatTransactionItem(item);
    const existing = bySender.get(item.sender) ?? [];
    existing.push(formatted);
    bySender.set(item.sender, existing);
  }

  const orderedSenders = [from, to]
    .filter((sender): sender is string => !!sender && bySender.has(sender));
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
          <div className={classes.transactionSender}>{prettifyId(side.sender)}</div>
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
      typeof (e as { type?: unknown }).type === "string"
  );
}

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

function ProductionSummary({
  units,
  cost,
}: {
  units: Record<string, number> | null;
  cost: number | null;
}) {
  const breakdown = units && Object.keys(units).length > 0 ? unitBreakdown(units) : null;
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

function SubEventLine({ sub }: { sub: GameSubEvent }) {
  switch (sub.type) {
    case "COMBAT":
      return (
        <div className={classes.subEventLine}>
          <span className={classes.combat}>
            <IconSwords size={11} stroke={2} />
            {sub.kind === "space"
              ? `Space combat${sub.tile ? ` in ${resolveSystemName(sub.tile)}` : ""}`
              : `Ground combat${sub.planet ? ` on ${resolvePlanetName(sub.planet)}` : ""}`}
          </span>
          {sub.vsFaction && (
            <>
              <span className={classes.subMuted}>vs</span>
              <SubFaction faction={sub.vsFaction} />
            </>
          )}
        </div>
      );

    case "CONTROL_ESTABLISHED":
      return (
        <div className={classes.subEventLine}>
          <span>Took control of {resolvePlanetName(sub.planet)}</span>
        </div>
      );

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
        sub.leaderId
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

    case "PRODUCTION":
      return (
        <div className={classes.subEventLine}>
          <span>
            Produced{sub.tile ? ` in ${resolveSystemName(sub.tile)}` : ""}
          </span>
          <ProductionSummary units={sub.units} cost={sub.cost} />
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
function EventBody({ event }: { event: GameEvent }) {
  const p = event.payload ?? {};

  if (event.archetype in CARD_BADGES) {
    const { label, hue } = CARD_BADGES[event.archetype];
    const cardId = str(p, "cardId") ?? "";
    const cardName =
      str(p, "cardName") ?? resolveCardName(event.archetype, cardId);
    const content = (
      <>
        <div className={classes.headline}>
          <TypeBadge label={label} hue={hue} />
          <span className={classes.primary}>
            {cardEventTitle(event.archetype, cardName)}
          </span>
        </div>
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

    if (event.archetype === "CARD_PLAY_AGENT" && cardId) {
      return (
        <EventPopover details={<LeaderDetailsCard leaderId={cardId} />}>
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
        <div className={classes.headline}>
          <span className={classes.primary}>Finished tactical action</span>
          {system && (
            <span className={classes.sysChip}>{resolveSystemName(system)}</span>
          )}
        </div>
      );

      // Structured sub-events take priority; the text summary is only the
      // fallback for older events that don't carry them.
      if (subEvents.length > 0) {
        return (
          <>
            {headline}
            <div className={classes.subEvents}>
              {subEvents.map((sub, index) => (
                <SubEventLine key={`${sub.type}-${index}`} sub={sub} />
              ))}
            </div>
          </>
        );
      }

      const sub =
        planetNames.length > 0 || combat ? (
          <div className={classes.subline}>
            {planetNames.length > 0 && <span>Took {planetNames.join(", ")}</span>}
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

    case "PRODUCTION": {
      const tile = str(p, "tile");
      const units =
        p.units && typeof p.units === "object" && !Array.isArray(p.units)
          ? (p.units as Record<string, number>)
          : null;
      const cost = num(p, "cost");
      return (
        <>
          <div className={classes.headline}>
            <span className={classes.primary}>Produced</span>
            {tile && (
              <span className={classes.sysChip}>{resolveSystemName(tile)}</span>
            )}
          </div>
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
        <div className={classes.headline}>
          <span className={classes.mono}>{command}</span>
        </div>
      );
    }

    case "TURN": {
      if (p.passed !== true) return null;
      return (
        <div className={classes.headline}>
          <span className={classes.primary}>passed</span>
        </div>
      );
    }

    case "TECH_RESEARCHED": {
      const name = resolveTechName(str(p, "techId") ?? "");
      const payment = str(p, "paymentType");
      return (
        <>
          <div className={classes.headline}>
            <TypeBadge label="Tech" hue="oklch(0.66 0.15 150)" />
            <span className={classes.primary}>Researched {name}</span>
            {payment && <span className={classes.subline}>{prettifyId(payment)}</span>}
          </div>
          <EventDescription>{eventDescription(p)}</EventDescription>
        </>
      );
    }

    case "SC_PLAYED": {
      const n = num(p, "scNumber");
      const name = str(p, "scName");
      return (
        <>
          <div className={classes.headline}>
            {n !== undefined && (
              <span
                className={classes.scNum}
                style={{ background: scNumberBg(n) }}
              >
                {n}
              </span>
            )}
            <span className={classes.primary}>Played {name ?? "strategy card"}</span>
          </div>
          <EventDescription>{eventDescription(p)}</EventDescription>
        </>
      );
    }

    case "SC_PICKED": {
      const n = num(p, "scNumber");
      const name = strategyCardName(p, n);
      return (
        <>
          <div className={classes.headline}>
            <span className={classes.primary}>Picked {name}</span>
          </div>
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
      return (
        <>
          <div className={classes.headline}>
            <span className={classes.trophy}>
              <IconTargetArrow size={14} stroke={2} />
            </span>
            <TypeBadge label={category} hue={hue} />
            <span className={classes.primary}>
              {id ? resolveObjectiveName(id) : "Scored objective"}
            </span>
          </div>
          <EventDescription>{eventDescription(p)}</EventDescription>
        </>
      );
    }

    case "AGENDA_RESOLVED": {
      const name = resolveAgendaName(str(p, "agendaId") ?? "");
      const outcome = str(p, "outcome");
      const votesRaw = p.votes;
      const summary =
        votesRaw && typeof votesRaw === "object"
          ? summarizeVotes(votesRaw as Record<string, string>)
          : "";
      return (
        <>
          <div className={classes.headline}>
            <TypeBadge label="Agenda" hue="oklch(0.68 0.16 60)" />
            <span className={classes.primary}>{name}</span>
          </div>
          <div className={classes.subline}>
            {outcome && <span>→ {prettifyId(outcome)}</span>}
            {summary && <span>· {summary}</span>}
          </div>
          <EventDescription>{eventDescription(p)}</EventDescription>
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
          <div className={classes.headline}>
            {from && <CircularFactionIcon faction={from} size={16} />}
            <span className={classes.transactionArrow}>
              <IconArrowsLeftRight size={13} stroke={2} />
            </span>
            {to && <CircularFactionIcon faction={to} size={16} />}
            <span className={classes.subline}>
              {items.length} item{items.length === 1 ? "" : "s"}
            </span>
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
          <div className={classes.headline}>
            <span className={classes.primary}>{prettifyId(event.archetype)}</span>
          </div>
          <EventDescription>{eventDescription(p)}</EventDescription>
        </>
      );
  }
}

function EventRow({ event, now }: { event: GameEvent; now: number }) {
  const body = <EventBody event={event} />;
  const isPassed = event.archetype === "TURN";
  return (
    <div className={`${classes.row} ${isPassed ? classes.passed : ""}`}>
      <div className={classes.iconCell}>
        <ActorIcon faction={event.faction} />
      </div>
      <div className={classes.content}>{body}</div>
      <Tooltip label={formatAbsoluteTime(event.timestamp)} withArrow openDelay={300}>
        <span className={classes.time}>{formatRelativeTime(event.timestamp, now)}</span>
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
      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
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

export function GameEventPanel() {
  const params = useParams<{ mapid: string }>();
  const gameId = params.mapid ?? "";
  const { data, isLoading, isError } = useGameEvents(gameId);
  const [showAll, setShowAll] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(id);
  }, []);

  // Drop TURN rows that aren't "passed" (rhythm markers only), keep the rest.
  const { visibleEvents, hasHidden } = useMemo(() => {
    const kept = (data ?? []).filter(
      (e) => e.archetype !== "TURN" || e.payload?.passed === true
    );
    return {
      visibleEvents: showAll ? kept : kept.slice(-MAX_VISIBLE),
      hasHidden: !showAll && kept.length > MAX_VISIBLE,
    };
  }, [data, showAll]);

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

  if (isLoading) {
    return (
      <div className={classes.stateBox} style={{ display: "flex", gap: 8, alignItems: "center" }}>
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
    <div className={classes.root}>
      {hasHidden && (
        <button
          type="button"
          className={classes.showEarlier}
          onClick={() => setShowAll(true)}
        >
          Show earlier events
        </button>
      )}
      {grouped.map(({ round, events }) => (
        <div key={round}>
          <div className={classes.roundHeader}>
            <span className={classes.roundLabel}>Round {round}</span>
            <span className={classes.roundRule} />
          </div>
          {events.map((event) => {
            if (event.archetype === "GAME_ENDED") {
              return <GameEndedRow key={event.seq} event={event} />;
            }
            if (
              event.archetype === "PHASE_STARTED" ||
              event.archetype === "ROUND_STARTED"
            ) {
              const label = sectionDividerLabel(event);
              return label ? (
                <SectionDividerRow key={event.seq} label={label} />
              ) : null;
            }
            return <EventRow key={event.seq} event={event} now={now} />;
          })}
        </div>
      ))}
    </div>
  );
}
