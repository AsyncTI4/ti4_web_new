import { Collapse } from "@/ds";
import { useState, type CSSProperties, type ReactNode } from "react";
import { ScoredSecret } from "@/domains/player/components/ScoredSecret";
import { PromissoryNote } from "@/domains/player/components/PromissoryNote";
import { SmoothPopover } from "@/shared/ui/SmoothPopover";
import { ActionCardDetailsCard } from "@/domains/cards/components/ActionCardDetailsCard";
import { SecretObjectiveCard } from "@/domains/cards/components/SecretObjectiveCard";
import { PromissoryNoteCard } from "@/domains/cards/components/PromissoryNoteCard";
import { getActionCard } from "@/entities/lookup/actionCards";
import { PlayerHandData } from "@/shared/types/playerHand";
import { actionCardTiming } from "../actionCardTiming";
import classes from "./SecretHand.module.css";

type Props = {
  handData?: PlayerHandData;
  isLoading?: boolean;
  error?: Error | null;
  /**
   * Opens a card's text in place under its chip instead of in a popover.
   * For phones, where a popover can land outside the visible screen.
   */
  inlineDetails?: boolean;
};

type HandTab = "actions" | "secrets" | "notes";

const TABS: { key: HandTab; label: string; tone: string }[] = [
  { key: "actions", label: "Actions", tone: "var(--gd-red)" },
  { key: "secrets", label: "Secrets", tone: "var(--gd-red)" },
  { key: "notes", label: "Notes", tone: "var(--gd-cyan)" },
];

function idsFor(hand: PlayerHandData, tab: HandTab): string[] {
  if (tab === "actions") return hand.actionCards;
  if (tab === "secrets") return hand.secretObjectives;
  return hand.promissoryNotes;
}

/** Action card with a rounded heel, its real card back, and its timing tag. */
function ActionCardRow({ id, onClick }: { id: string; onClick: () => void }) {
  const card = getActionCard(id);
  const timing = actionCardTiming(id);
  return (
    <button type="button" className={classes.acard} onClick={onClick}>
      <i className={classes.back} aria-hidden="true" />
      <span className={classes.acardText}>
        <b>
          {card?.name ?? id}
          {timing && <span className={classes.when}>{timing}</span>}
        </b>
        {card?.text && <p>{card.text}</p>}
      </span>
    </button>
  );
}

const RENDERERS: Record<
  HandTab,
  {
    chip: (id: string, onClick: () => void) => ReactNode;
    details: (id: string) => ReactNode;
  }
> = {
  actions: {
    chip: (id, onClick) => <ActionCardRow id={id} onClick={onClick} />,
    details: (id) => <ActionCardDetailsCard actionCardId={id} />,
  },
  secrets: {
    chip: (id, onClick) => (
      <ScoredSecret
        secretId={id}
        variant="unscored"
        onClick={onClick}
        showDetails={false}
      />
    ),
    details: (id) => <SecretObjectiveCard secretId={id} />,
  },
  notes: {
    chip: (id, onClick) => (
      <PromissoryNote
        promissoryNoteId={id}
        onClick={onClick}
        showDetails={false}
      />
    ),
    details: (id) => <PromissoryNoteCard promissoryNoteId={id} />,
  },
};

const EMPTY_COPY: Record<HandTab, string> = {
  actions: "No action cards in hand",
  secrets: "No unscored secret objectives",
  notes: "No promissory notes",
};

/** The hand drawer: actions, secrets and notes on three tabs. */
export function SecretHand({
  handData,
  isLoading,
  error,
  inlineDetails = false,
}: Props) {
  const [tab, setTab] = useState<HandTab>("actions");
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  if (isLoading) return <p className={classes.state}>Loading hand…</p>;
  if (error) return <p className={classes.state}>Failed to load hand data</p>;
  if (!handData) return <p className={classes.state}>No cards in hand</p>;

  const ids = idsFor(handData, tab);

  return (
    <div className={classes.container}>
      <div className={classes.tabs} role="tablist" aria-label="Your cards">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={tab === t.key}
            className={classes.tab}
            style={{ "--hk": t.tone } as CSSProperties}
            onClick={() => {
              setTab(t.key);
              setSelectedCard(null);
            }}
          >
            {t.label}
            <b>{idsFor(handData, t.key).length}</b>
          </button>
        ))}
      </div>
      <div className={classes.content} role="tabpanel">
        {ids.length === 0 && <p className={classes.state}>{EMPTY_COPY[tab]}</p>}
        <HandList
          tab={tab}
          ids={ids}
          selectedCard={selectedCard}
          onSelect={setSelectedCard}
          inlineDetails={inlineDetails}
        />
      </div>
    </div>
  );
}

function HandList({
  tab,
  ids,
  selectedCard,
  onSelect,
  inlineDetails,
}: {
  tab: HandTab;
  ids: string[];
  selectedCard: string | null;
  onSelect: (cardKey: string | null) => void;
  inlineDetails: boolean;
}) {
  const { chip, details } = RENDERERS[tab];
  return (
    <div className={classes.list}>
      {ids.map((id, index) => {
        const cardKey = `${tab}-${id}-${index}`;
        const isOpen = selectedCard === cardKey;
        if (inlineDetails) {
          return (
            <div key={cardKey}>
              {chip(id, () => onSelect(isOpen ? null : cardKey))}
              <Collapse in={isOpen}>
                <div className={classes.inlineDetails}>{details(id)}</div>
              </Collapse>
            </div>
          );
        }
        return (
          <SmoothPopover
            key={cardKey}
            opened={isOpen}
            onChange={(opened) => onSelect(opened ? cardKey : null)}
          >
            <SmoothPopover.Target>
              <div>{chip(id, () => onSelect(cardKey))}</div>
            </SmoothPopover.Target>
            <SmoothPopover.Dropdown p={0}>{details(id)}</SmoothPopover.Dropdown>
          </SmoothPopover>
        );
      })}
    </div>
  );
}
