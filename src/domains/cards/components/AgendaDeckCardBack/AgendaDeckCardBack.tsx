import { cdnImage } from "@/entities/data/cdnImage";
import { agendas } from "@/entities/data/agendas";
import { processCardData, createCardSections } from "@/domains/cards/model/cardDataProcessor";
import { CardDetailsModal } from "@/domains/cards/components/CardDetailsModal/CardDetailsModal";
import { CardbackModal } from "@/shared/ui/CardbackModal";

const agendasByAlias = new Map(agendas.map((agenda) => [agenda.alias, agenda]));

/** Unknown aliases (homebrew sets not in our data) still list, under their alias. */
function toAgendaCard(alias: string) {
  const agenda = agendasByAlias.get(alias);
  if (!agenda) return { name: alias, text: "", id: alias };
  const text = [
    [agenda.type, agenda.target].filter(Boolean).join(" · "),
    agenda.text2 ? `For: ${agenda.text1}` : agenda.text1,
    agenda.text2 ? `Against: ${agenda.text2}` : "",
  ]
    .filter(Boolean)
    .join("\n");
  return { name: agenda.name, text, id: agenda.alias };
}

type Props = {
  deck: string[];
  discard: string[];
  /**
   * Twilight's Fall: the deck holds the edicts. Every Edict Phase the bot shuffles
   * all of them, minus laws in play, and the Tyrant picks one of the top three,
   * so there is no discard.
   */
  edicts?: boolean;
  /** Ids of the laws in play, which can't be drawn as edicts. */
  lawsInPlay?: string[];
};

/** The agenda deck; click it for the agendas still in it and the discard pile. */
export function AgendaDeckCardBack({ deck, discard, edicts, lawsInPlay = [] }: Props) {
  if (edicts) {
    const inPlay = new Set(lawsInPlay);
    const drawable = deck.filter((id) => !inPlay.has(id));
    return (
      <CardbackModal
        imageSrc={cdnImage("/player_area/cardback_edict.jpg")}
        alt="edicts"
        title="Edicts"
        count={drawable.length}
      >
        <CardDetailsModal
          sections={[
            {
              title: "Can be drawn",
              count: drawable.length,
              items: processCardData(drawable, toAgendaCard, "alphanumeric"),
            },
          ]}
          showCounts={false}
          tone="var(--ds-sig-law)"
        />
      </CardbackModal>
    );
  }

  const sections = createCardSections(
    processCardData(deck, toAgendaCard, "alphanumeric"),
    processCardData(discard, toAgendaCard, "alphanumeric"),
    deck,
    discard,
  );

  return (
    <CardbackModal
      imageSrc={cdnImage("/player_area/cardback_agenda.png")}
      alt="agenda cards"
      title="Agenda Cards"
      count={deck.length}
    >
      <CardDetailsModal sections={sections} showCounts={false} tone="var(--ds-sig-law)" />
    </CardbackModal>
  );
}
