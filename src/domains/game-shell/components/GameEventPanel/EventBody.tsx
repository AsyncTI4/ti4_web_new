import type { ReactNode } from "react";
import type { GameEvent } from "@/entities/data/types";
import { ActionCardDetailsCard } from "@/domains/cards/components/ActionCardDetailsCard";
import { LeaderDetailsCard } from "@/domains/cards/components/LeaderDetailsCard";
import { PromissoryNoteCard } from "@/domains/cards/components/PromissoryNoteCard";
import { RelicCard } from "@/domains/player/components/Relic";
import { SecretObjectiveCard } from "@/domains/cards/components/SecretObjectiveCard";
import { TechCard } from "@/domains/cards/components/TechCard/TechCard";
import { BreakthroughCard } from "@/domains/cards/components/BreakthroughCard";
import { publicObjectives } from "@/entities/data/publicObjectives";
import {
  prettifyId,
  resolveAgendaName,
  resolveCardName,
  resolveObjectiveName,
  resolvePlanetsList,
  resolveTechName,
} from "./eventFormatting";
import {
  eventDescription,
  num,
  parseSubEvents,
  str,
  strategyCardName,
  stringArray,
  type EventPayload,
  type SystemNameResolver,
} from "./eventPayload";
import { transactionSides, type TransactionEntry } from "./transactions";
import { EventPopover, ProductionSummary } from "./EventParts";
import {
  AbilityChip,
  ActionCardChip,
  BreakthroughChip,
  CountChip,
  HexChip,
  LawChip,
  LeaderPortrait,
  ObjectiveChip,
  PlainChip,
  PnChip,
  RelicChip,
  ScPlate,
  SecretChip,
  TechChip,
  VpStamp,
} from "./EventChips";
import { SubEventList } from "./SubEventList";
import classes from "./GameEventPanel.module.css";

export type PlayerNameResolver = (faction: string) => string;

type BodyProps = {
  event: GameEvent;
  p: EventPayload;
  systemName: SystemNameResolver;
  playerName: PlayerNameResolver;
};

function Sentence({ children }: { children: ReactNode }) {
  return <p className={classes.sentence}>{children}</p>;
}

function Extras({ children }: { children: ReactNode }) {
  return <div className={classes.extras}>{children}</div>;
}

function Actor({ event, playerName }: Pick<BodyProps, "event" | "playerName">) {
  return <b>{event.faction ? playerName(event.faction) : "Someone"}</b>;
}

function Note({ p }: { p: EventPayload }) {
  const text = eventDescription(p);
  if (!text) return null;
  return <span className={classes.note}>{text}</span>;
}

type CardPlay = {
  verb: string;
  chip: (id: string, name: string) => ReactNode;
  details: (id: string) => ReactNode;
};

const CARD_PLAYS: Record<string, CardPlay> = {
  CARD_PLAY_ACTION_CARD: {
    verb: "played an action card",
    chip: (id, name) => <ActionCardChip id={id} name={name} />,
    details: (id) => <ActionCardDetailsCard actionCardId={id} />,
  },
  CARD_PLAY_PROMISSORY_NOTE: {
    verb: "played a promissory note",
    chip: (_id, name) => <PnChip name={name} />,
    details: (id) => <PromissoryNoteCard promissoryNoteId={id} />,
  },
  CARD_PLAY_AGENT: {
    verb: "exhausted their agent",
    chip: (id, name) => <LeaderPortrait id={id} name={name} />,
    details: (id) => <LeaderDetailsCard leaderId={id} />,
  },
  CARD_PLAY_HERO: {
    verb: "played their hero",
    chip: (id, name) => <LeaderPortrait id={id} name={name} />,
    details: (id) => <LeaderDetailsCard leaderId={id} />,
  },
  CARD_PLAY_RELIC: {
    verb: "exhausted a relic",
    chip: (_id, name) => <RelicChip name={name} />,
    details: (id) => <RelicCard relicId={id} />,
  },
  CARD_PLAY_TECH_EXHAUST: {
    verb: "exhausted a technology",
    chip: (id, name) => <TechChip id={id} name={name} />,
    details: (id) => <TechCard techId={id} />,
  },
  CARD_PLAY_BREAKTHROUGH: {
    verb: "used a breakthrough",
    chip: (_id, name) => <BreakthroughChip name={name} />,
    details: (id) => <BreakthroughCard breakthroughId={id} />,
  },
};

function CardPlayBody({ event, p, playerName }: BodyProps) {
  const play = CARD_PLAYS[event.archetype];
  const cardId = str(p, "cardId") ?? "";
  const name = str(p, "cardName") ?? resolveCardName(event.archetype, cardId);
  const chip = play.chip(cardId, name);
  return (
    <>
      <Sentence>
        <Actor event={event} playerName={playerName} /> {play.verb}.
      </Sentence>
      <Extras>
        {cardId ? (
          <EventPopover details={play.details(cardId)}>{chip}</EventPopover>
        ) : (
          chip
        )}
        <Note p={p} />
      </Extras>
    </>
  );
}

function AbilityBody({ event, p, playerName }: BodyProps) {
  const cardId = str(p, "cardId") ?? "";
  const name =
    str(p, "cardName") ?? resolveCardName("CARD_PLAY_ABILITY", cardId);
  return (
    <>
      <Sentence>
        <Actor event={event} playerName={playerName} /> used an ability.
      </Sentence>
      <Extras>
        <AbilityChip name={name} />
        <Note p={p} />
      </Extras>
    </>
  );
}

function TacticalActionBody({ event, p, systemName, playerName }: BodyProps) {
  const position = str(p, "activeSystem");
  const planets = str(p, "planetsTaken");
  const planetNames = planets ? resolvePlanetsList(planets) : [];
  const subEvents = parseSubEvents(p.subEvents);
  const combat = str(p, "combat");

  return (
    <>
      <Sentence>
        <Actor event={event} playerName={playerName} />{" "}
        {position ? (
          <>
            activated <b>{systemName(position)}</b>.
          </>
        ) : (
          "took a tactical action."
        )}
      </Sentence>
      <Extras>
        {position && position.length <= 4 && <HexChip>{position}</HexChip>}
        {planetNames.map((planet) => (
          <PlainChip key={planet}>Took {planet}</PlainChip>
        ))}
        {subEvents.length === 0 && combat && (
          <span className={classes.combat}>
            Combat · {combat.split("_").map(prettifyId).join(" vs ")}
          </span>
        )}
        {subEvents.length > 0 && (
          <SubEventList
            subEvents={subEvents}
            systemName={systemName}
            actorFaction={event.faction}
          />
        )}
        {subEvents.length === 0 && <Note p={{ summary: p.summary }} />}
      </Extras>
    </>
  );
}

function StatusScoringBody({ event, p, systemName }: BodyProps) {
  const subEvents = parseSubEvents(p.subEvents);
  return (
    <>
      <Sentence>
        <b>Status phase</b> scoring.
      </Sentence>
      {subEvents.length > 0 && (
        <Extras>
          <SubEventList
            subEvents={subEvents}
            systemName={systemName}
            actorFaction={event.faction}
          />
        </Extras>
      )}
    </>
  );
}

function ProductionBody({ event, p, systemName, playerName }: BodyProps) {
  const units =
    p.units && typeof p.units === "object" && !Array.isArray(p.units)
      ? (p.units as Record<string, number>)
      : null;
  const cost = num(p, "cost");
  const tile = str(p, "tile");
  return (
    <>
      <Sentence>
        <Actor event={event} playerName={playerName} /> produced
        {tile ? (
          <>
            {" "}
            at <b>{systemName(tile)}</b>
          </>
        ) : null}
        .
      </Sentence>
      <Extras>
        {tile && tile.length <= 4 && <HexChip>{tile}</HexChip>}
        <span className={classes.note}>
          <ProductionSummary units={units} cost={cost ?? null} />
        </span>
      </Extras>
    </>
  );
}

function ManualCommandBody({ event, p, playerName }: BodyProps) {
  const command = str(p, "command");
  return (
    <>
      <Sentence>
        <Actor event={event} playerName={playerName} /> ran a command.
      </Sentence>
      {command && (
        <Extras>
          <span className={classes.mono}>{command}</span>
        </Extras>
      )}
    </>
  );
}

function TurnBody({ event, p, playerName }: BodyProps) {
  return (
    <Sentence>
      <Actor event={event} playerName={playerName} />{" "}
      {p.passed === true ? "passed." : "ended their turn."}
    </Sentence>
  );
}

function TechResearchedBody({ event, p, playerName }: BodyProps) {
  const techId = str(p, "techId") ?? "";
  const payment = str(p, "paymentType");
  return (
    <>
      <Sentence>
        <Actor event={event} playerName={playerName} /> researched a technology.
      </Sentence>
      <Extras>
        <EventPopover details={<TechCard techId={techId} />}>
          <TechChip id={techId} name={resolveTechName(techId)} />
        </EventPopover>
        {payment && <span className={classes.note}>{prettifyId(payment)}</span>}
      </Extras>
    </>
  );
}

const publicPoints = new Map(publicObjectives.map((o) => [o.alias, o.points]));

function ObjectiveScoredBody({ event, p, playerName }: BodyProps) {
  const category = str(p, "category") ?? "PUBLIC";
  const id = str(p, "objectiveId");
  const name = id ? resolveObjectiveName(id) : "an objective";
  const points = (id && publicPoints.get(id)) || 1;
  const isSecret = category === "SECRET";
  const chip = isSecret ? (
    <SecretChip name={name} />
  ) : (
    <ObjectiveChip name={name} stage={points >= 2 ? 2 : 1} />
  );

  return (
    <>
      <Sentence>
        <Actor event={event} playerName={playerName} /> scored{" "}
        {isSecret
          ? "a secret objective"
          : `a ${category.toLowerCase()} objective`}
        .
      </Sentence>
      <Extras>
        {isSecret && id ? (
          <EventPopover details={<SecretObjectiveCard secretId={id} />}>
            {chip}
          </EventPopover>
        ) : (
          chip
        )}
        <VpStamp>+{points} VP</VpStamp>
      </Extras>
    </>
  );
}

function agendaTitle(p: EventPayload): string {
  const explicit = str(p, "agendaName");
  if (explicit) return explicit;
  const agendaId = str(p, "agendaId");
  if (!agendaId || /^\d+$/.test(agendaId)) return "Agenda";
  return resolveAgendaName(agendaId);
}

function AgendaResolvedBody({ p }: BodyProps) {
  const outcome = str(p, "outcome");
  const title = agendaTitle(p);
  return (
    <>
      <Sentence>
        <b>{title}</b> resolved.
      </Sentence>
      <Extras>
        <LawChip
          name={title}
          outcome={outcome ? prettifyId(outcome) : undefined}
        />
      </Extras>
    </>
  );
}

function TradeItem({ item }: { item: TransactionEntry }) {
  switch (item.kind) {
    case "tg":
      return (
        <CountChip src="/tg.png" count={item.count ?? 0} title={item.label} />
      );
    case "comm":
      return (
        <CountChip
          src="/comms.png"
          count={item.count ?? 0}
          title={item.label}
        />
      );
    case "ac":
      return <ActionCardChip id="" name={item.label} />;
    case "pn":
      return <PnChip name={item.label} />;
    case "so":
      return <SecretChip name={item.label} />;
    case "tech":
      return <TechChip id="" name={item.label} />;
    case "relic":
      return <RelicChip name={item.label} />;
    default:
      return <PlainChip>{item.label}</PlainChip>;
  }
}

function TransactionBody({ p, playerName }: BodyProps) {
  const from = str(p, "from");
  const to = str(p, "to");
  const sides = transactionSides(stringArray(p, "items"), from, to);
  const [left, right] = [
    sides.find((s) => s.sender === from) ?? sides[0],
    sides.find((s) => s.sender === to) ?? sides[1],
  ];

  return (
    <>
      <Sentence>
        <b>{from ? playerName(from) : "Someone"}</b> and{" "}
        <b>{to ? playerName(to) : "someone"}</b> traded.
      </Sentence>
      <Extras>
        {sides.length > 0 ? (
          <div className={classes.xfer}>
            <div>
              {left?.items.map((item, i) => (
                <TradeItem key={i} item={item} />
              ))}
            </div>
            <span className={classes.xferArrow} aria-hidden="true">
              ⇄
            </span>
            <div>
              {right?.items.map((item, i) => (
                <TradeItem key={i} item={item} />
              ))}
            </div>
          </div>
        ) : (
          <Note p={p} />
        )}
      </Extras>
    </>
  );
}

function ScBody({ event, p, playerName }: BodyProps) {
  const initiative = num(p, "scNumber") ?? num(p, "sc");
  const picked = event.archetype === "SC_PICKED";
  const name = picked
    ? strategyCardName(p, initiative)
    : (str(p, "scName") ?? strategyCardName(p, initiative));
  return (
    <>
      <Sentence>
        <Actor event={event} playerName={playerName} />{" "}
        {picked ? "picked" : "played"} <b>{name}</b>.
      </Sentence>
      <Extras>
        <ScPlate initiative={initiative} name={name} played={!picked} />
        <Note p={p} />
      </Extras>
    </>
  );
}

function FallbackBody({ event, p, playerName }: BodyProps) {
  return (
    <>
      <Sentence>
        {event.faction && (
          <>
            <Actor event={event} playerName={playerName} /> ·{" "}
          </>
        )}
        {prettifyId(event.archetype)}
      </Sentence>
      {eventDescription(p) && (
        <Extras>
          <Note p={p} />
        </Extras>
      )}
    </>
  );
}

const ARCHETYPE_BODIES: Record<string, (props: BodyProps) => ReactNode> = {
  TACTICAL_ACTION: TacticalActionBody,
  STATUS_SCORING: StatusScoringBody,
  PRODUCTION: ProductionBody,
  MANUAL_COMMAND: ManualCommandBody,
  TURN: TurnBody,
  TECH_RESEARCHED: TechResearchedBody,
  SC_PLAYED: ScBody,
  SC_PICKED: ScBody,
  OBJECTIVE_SCORED: ObjectiveScoredBody,
  AGENDA_RESOLVED: AgendaResolvedBody,
  TRANSACTION: TransactionBody,
  CARD_PLAY_ABILITY: AbilityBody,
};

/** One event as a sentence with bold nouns, then its objects in silhouette. */
export function EventBody({
  event,
  systemName,
  playerName,
}: {
  event: GameEvent;
  systemName: SystemNameResolver;
  playerName: PlayerNameResolver;
}) {
  const props = { event, p: event.payload ?? {}, systemName, playerName };
  if (CARD_PLAYS[event.archetype]) return <CardPlayBody {...props} />;
  const Body = ARCHETYPE_BODIES[event.archetype] ?? FallbackBody;
  return <Body {...props} />;
}
