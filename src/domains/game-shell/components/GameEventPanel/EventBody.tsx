import {
  IconArrowsLeftRight,
  IconBuildingFactory2,
  IconSwords,
  IconTargetArrow,
} from "@tabler/icons-react";
import { CircularFactionIcon } from "@/shared/ui/CircularFactionIcon";
import type { GameEvent } from "@/entities/data/types";
import { ActionCardDetailsCard } from "@/domains/cards/components/ActionCardDetailsCard";
import { LeaderDetailsCard } from "@/domains/cards/components/LeaderDetailsCard";
import { PromissoryNoteCard } from "@/domains/cards/components/PromissoryNoteCard";
import { RelicCard } from "@/domains/player/components/Relic";
import { SecretObjectiveCard } from "@/domains/cards/components/SecretObjectiveCard";
import { TechCard } from "@/domains/cards/components/TechCard/TechCard";
import { BreakthroughCard } from "@/domains/cards/components/BreakthroughCard";
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
import { transactionSides, type TransactionSide } from "./transactions";
import {
  EventDescription,
  EventPopover,
  Headline,
  ProductionSummary,
  TypeBadge,
} from "./EventParts";
import { SubEventList } from "./SubEventList";
import classes from "./GameEventPanel.module.css";

type CardArchetype = {
  label: string;
  hue: string;
  exhausts?: boolean;
  details?: (cardId: string) => React.ReactNode;
};

const CARD_ARCHETYPES: Record<string, CardArchetype> = {
  CARD_PLAY_ACTION_CARD: {
    label: "AC Played",
    hue: "oklch(0.66 0.18 45)",
    details: (id) => <ActionCardDetailsCard actionCardId={id} />,
  },
  CARD_PLAY_PROMISSORY_NOTE: {
    label: "Played Promissory Note",
    hue: "oklch(0.65 0.16 300)",
    details: (id) => <PromissoryNoteCard promissoryNoteId={id} />,
  },
  CARD_PLAY_AGENT: {
    label: "Agent",
    hue: "oklch(0.68 0.15 190)",
    exhausts: true,
    details: (id) => <LeaderDetailsCard leaderId={id} />,
  },
  CARD_PLAY_HERO: {
    label: "Hero",
    hue: "oklch(0.64 0.18 330)",
    details: (id) => <LeaderDetailsCard leaderId={id} />,
  },
  CARD_PLAY_RELIC: {
    label: "Relic Exhausted",
    hue: "oklch(0.7 0.14 90)",
    exhausts: true,
    details: (id) => <RelicCard relicId={id} />,
  },
  CARD_PLAY_TECH_EXHAUST: {
    label: "Tech",
    hue: "oklch(0.66 0.15 150)",
    exhausts: true,
    details: (id) => <TechCard techId={id} />,
  },
  CARD_PLAY_BREAKTHROUGH: {
    label: "Breakthrough",
    hue: "oklch(0.64 0.17 330)",
    details: (id) => <BreakthroughCard breakthroughId={id} />,
  },
  CARD_PLAY_ABILITY: { label: "Ability", hue: "oklch(0.6 0.02 260)" },
};

const OBJECTIVE_HUES: Record<string, string> = {
  SECRET: "oklch(0.62 0.19 20)",
  CUSTODIAN: "oklch(0.7 0.14 90)",
};
const DEFAULT_OBJECTIVE_HUE = "oklch(0.68 0.15 145)";

type BodyProps = {
  event: GameEvent;
  p: EventPayload;
  systemName: SystemNameResolver;
};

function systemChip(
  position: string | undefined,
  systemName: SystemNameResolver,
): React.ReactNode {
  if (!position) return null;
  return <span className={classes.sysChip}>{systemName(position)}</span>;
}

function TitledDescription({ title, p }: { title: string; p: EventPayload }) {
  return (
    <>
      <Headline title={title} />
      <EventDescription>{eventDescription(p)}</EventDescription>
    </>
  );
}

function CardPlayBody({ event, p, card }: BodyProps & { card: CardArchetype }) {
  const cardId = str(p, "cardId") ?? "";
  const cardName =
    str(p, "cardName") ?? resolveCardName(event.archetype, cardId);
  const content = (
    <>
      <Headline
        meta={<TypeBadge label={card.label} hue={card.hue} />}
        title={card.exhausts ? `Exhausted ${cardName}` : cardName}
      />
      <EventDescription>{eventDescription(p)}</EventDescription>
    </>
  );
  if (!card.details || !cardId) return content;
  return <EventPopover details={card.details(cardId)}>{content}</EventPopover>;
}

function TacticalActionBody({ event, p, systemName }: BodyProps) {
  const planets = str(p, "planetsTaken");
  const combat = str(p, "combat");
  const planetNames = planets ? resolvePlanetsList(planets) : [];
  const subEvents = parseSubEvents(p.subEvents);
  const headline = (
    <Headline
      title="Tactical action"
      meta={systemChip(str(p, "activeSystem"), systemName)}
    />
  );

  if (subEvents.length > 0) {
    return (
      <>
        {headline}
        <SubEventList
          subEvents={subEvents}
          systemName={systemName}
          actorFaction={event.faction}
        />
      </>
    );
  }

  return (
    <>
      {headline}
      {(planetNames.length > 0 || combat) && (
        <div className={classes.subline}>
          {planetNames.length > 0 && <span>Took {planetNames.join(", ")}</span>}
          {combat && (
            <span className={classes.combat}>
              <IconSwords size={11} stroke={2} />
              {combat.split("_").map(prettifyId).join(" vs ")}
            </span>
          )}
        </div>
      )}
      <EventDescription>{str(p, "summary")}</EventDescription>
    </>
  );
}

function StatusScoringBody({ event, p, systemName }: BodyProps) {
  const subEvents = parseSubEvents(p.subEvents);
  return (
    <>
      <Headline
        title="Status phase scoring"
        meta={<TypeBadge label="Status" hue="oklch(0.68 0.15 145)" />}
      />
      {subEvents.length > 0 && (
        <SubEventList
          subEvents={subEvents}
          systemName={systemName}
          actorFaction={event.faction}
        />
      )}
    </>
  );
}

function ProductionBody({ p, systemName }: BodyProps) {
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
        meta={systemChip(str(p, "tile"), systemName)}
      />
      {(units !== null || cost !== undefined) && (
        <div className={classes.subline}>
          <ProductionSummary units={units} cost={cost ?? null} />
        </div>
      )}
    </>
  );
}

function ManualCommandBody({ p }: BodyProps) {
  const command = str(p, "command");
  if (!command) return null;
  return (
    <div className={classes.titleLine}>
      <span className={classes.mono}>{command}</span>
    </div>
  );
}

function TurnBody({ p }: BodyProps) {
  if (p.passed !== true) return null;
  return <Headline title="passed" />;
}

function TechResearchedBody({ p }: BodyProps) {
  const payment = str(p, "paymentType");
  return (
    <>
      <Headline
        title={`Researched ${resolveTechName(str(p, "techId") ?? "")}`}
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

function ObjectiveScoredBody({ p }: BodyProps) {
  const category = str(p, "category") ?? "PUBLIC";
  const id = str(p, "objectiveId");
  const content = (
    <>
      <Headline
        title={id ? resolveObjectiveName(id) : "Scored objective"}
        beforeTitle={
          <span className={classes.trophy}>
            <IconTargetArrow size={14} stroke={2} />
          </span>
        }
        meta={
          <TypeBadge
            label={category}
            hue={OBJECTIVE_HUES[category] ?? DEFAULT_OBJECTIVE_HUE}
          />
        }
      />
      <EventDescription>{eventDescription(p)}</EventDescription>
    </>
  );
  if (category !== "SECRET" || !id) return content;
  return (
    <EventPopover details={<SecretObjectiveCard secretId={id} />}>
      {content}
    </EventPopover>
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
  return (
    <>
      <Headline
        title={agendaTitle(p)}
        meta={<TypeBadge label="Agenda" hue="oklch(0.68 0.16 60)" />}
      />
      <EventDescription>
        {outcome ? `Vote resolved: ${prettifyId(outcome)}` : undefined}
      </EventDescription>
    </>
  );
}

function TransactionItems({ sides }: { sides: TransactionSide[] }) {
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

function TransactionBody({ p }: BodyProps) {
  const from = str(p, "from");
  const to = str(p, "to");
  const sides = transactionSides(stringArray(p, "items"), from, to);
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

const ARCHETYPE_BODIES: Record<string, (props: BodyProps) => React.ReactNode> =
  {
    TACTICAL_ACTION: TacticalActionBody,
    STATUS_SCORING: StatusScoringBody,
    PRODUCTION: ProductionBody,
    MANUAL_COMMAND: ManualCommandBody,
    TURN: TurnBody,
    TECH_RESEARCHED: TechResearchedBody,
    SC_PLAYED: ({ p }) => (
      <TitledDescription
        title={`Played ${str(p, "scName") ?? "strategy card"}`}
        p={p}
      />
    ),
    SC_PICKED: ({ p }) => (
      <TitledDescription
        title={`Picked ${strategyCardName(p, num(p, "scNumber"))}`}
        p={p}
      />
    ),
    OBJECTIVE_SCORED: ObjectiveScoredBody,
    AGENDA_RESOLVED: AgendaResolvedBody,
    TRANSACTION: TransactionBody,
  };

export function EventBody({
  event,
  systemName,
}: {
  event: GameEvent;
  systemName: SystemNameResolver;
}) {
  const props = { event, p: event.payload ?? {}, systemName };

  const card = CARD_ARCHETYPES[event.archetype];
  if (card) return <CardPlayBody {...props} card={card} />;

  const Body = ARCHETYPE_BODIES[event.archetype];
  if (Body) return <Body {...props} />;

  return <TitledDescription title={prettifyId(event.archetype)} p={props.p} />;
}
