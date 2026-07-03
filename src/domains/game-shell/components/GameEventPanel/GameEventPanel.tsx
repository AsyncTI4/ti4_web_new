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
import { useGameEvents } from "@/hooks/useGameEvents";
import type { GameEvent } from "@/entities/data/types";
import { SC_COLORS, SC_NUMBER_COLORS } from "@/entities/data/strategyCardColors";
import {
  formatAbsoluteTime,
  formatRelativeTime,
  prettifyId,
  resolveAgendaName,
  resolveCardName,
  resolveObjectiveName,
  resolvePlanetsList,
  resolveSystemName,
  resolveTechName,
  summarizeVotes,
} from "./eventFormatting";
import classes from "./GameEventPanel.module.css";

const MAX_VISIBLE = 150;

// Colored type-badge config per card archetype (distinct hues).
const CARD_BADGES: Record<string, { label: string; hue: string }> = {
  CARD_PLAY_ACTION_CARD: { label: "AC", hue: "oklch(0.62 0.19 250)" },
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

// ---------------------------------------------------------------------------
// Row body per archetype. Returns null for events we deliberately drop.
// ---------------------------------------------------------------------------
function EventBody({ event }: { event: GameEvent }) {
  const p = event.payload ?? {};

  if (event.archetype in CARD_BADGES) {
    const { label, hue } = CARD_BADGES[event.archetype];
    const cardName =
      str(p, "cardName") ?? resolveCardName(event.archetype, str(p, "cardId") ?? "");
    return (
      <>
        <div className={classes.headline}>
          <TypeBadge label={label} hue={hue} />
          <span className={classes.primary}>{cardName}</span>
        </div>
        <EventDescription>{eventDescription(p)}</EventDescription>
      </>
    );
  }

  switch (event.archetype) {
    case "TACTICAL_ACTION": {
      const system = str(p, "activeSystem");
      const planets = str(p, "planetsTaken");
      const combat = str(p, "combat");
      const summary = str(p, "summary");
      const planetNames = planets ? resolvePlanetsList(planets) : [];
      const headline = (
        <div className={classes.headline}>
          <span className={classes.primary}>Tactical action</span>
          {system && (
            <span className={classes.sysChip}>{resolveSystemName(system)}</span>
          )}
        </div>
      );
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
      return (
        <>
          <div className={classes.headline}>
            {n !== undefined && (
              <span
                className={classes.scNum}
                style={{
                  background: "rgba(148,163,184,0.18)",
                  color: "var(--mantine-color-gray-3)",
                }}
              >
                {n}
              </span>
            )}
            <span className={classes.subline}>picked strategy card</span>
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
          <EventDescription>{eventDescription(p)}</EventDescription>
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
          {events.map((event) =>
            event.archetype === "GAME_ENDED" ? (
              <GameEndedRow key={event.seq} event={event} />
            ) : (
              <EventRow key={event.seq} event={event} now={now} />
            )
          )}
        </div>
      ))}
    </div>
  );
}
