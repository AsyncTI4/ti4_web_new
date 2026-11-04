import { Box, Text } from "@/ds";
import { Cardback } from "@/shared/ui/Cardback";
import { cdnImage } from "@/entities/data/cdnImage";
import { CardPoolData } from "@/entities/data/types";
import styles from "./CardPool.module.css";
import { ExplorationCardBack } from "@/domains/cards/components/ExplorationCardBack";
import { SecretDeckCardBack } from "@/domains/cards/components/SecretDeckCardBack";
import { ActionDeckCardBack } from "@/domains/cards/components/ActionDeckCardBack";
import { RelicDeckCardBack } from "@/domains/cards/components/RelicDeckCardBack";
import { AgendaDeckCardBack } from "@/domains/cards/components/AgendaDeckCardBack";
import { SpliceDeckCardBack, type SpliceDeckKind } from "@/domains/cards/components/SpliceDeckCardBack";
import { useIsTwilightsFallMode } from "@/hooks/useIsTwilightsFallMode";

type Props = {
  cardPool?: CardPoolData;
  /** Action cards held across all players' hands. */
  actionCardsInHands?: number;
};

/**
 * The bot sends an empty action card deck on purpose (it would reveal hands),
 * so the count is derived from public numbers: full deck − discard − hands.
 * Purged or set-aside cards are not in the payload, so it can run a little high.
 */
function actionDeckCount(cardPool: CardPoolData, inHands?: number): number | string {
  if (cardPool.actionCardDeck?.length) return cardPool.actionCardDeck.length;
  if (!cardPool.actionCardFullDeckSize || inHands === undefined) {
    return cardPool.actionCardDeckSize ?? "–";
  }
  const discard = cardPool.actionCardDiscard?.length ?? cardPool.actionCardDiscardSize ?? 0;
  const purged = cardPool.actionCardPurgedSize ?? 0;
  return Math.max(0, cardPool.actionCardFullDeckSize - discard - purged - inHands);
}

/** The Twilight's Fall splice decks the bot sent, in the bot's map order. */
function spliceDecks(cardPool: CardPoolData) {
  const decks: Array<{ kind: SpliceDeckKind; deck?: string[] }> = [
    { kind: "ability", deck: cardPool.abilitySpliceDeck },
    { kind: "unit", deck: cardPool.unitSpliceDeck },
    { kind: "genome", deck: cardPool.genomeSpliceDeck },
    { kind: "paradigm", deck: cardPool.paradigmSpliceDeck },
  ];
  return decks.filter((d): d is { kind: SpliceDeckKind; deck: string[] } => !!d.deck);
}

/** Deck card backs with the cards left in each; click a deck for its list. */
function CardPool({ cardPool, actionCardsInHands }: Props) {
  const isTwilightsFallMode = useIsTwilightsFallMode();
  if (!cardPool) {
    return <Text className={styles.empty}>No card pool data available</Text>;
  }

  return (
    <Box className={styles.pool}>
      <ActionDeckCardBack
        count={actionDeckCount(cardPool, actionCardsInHands)}
        discard={cardPool.actionCardDiscard || []}
        fullDeckSize={cardPool.actionCardFullDeckSize}
      />
      {cardPool.agendaDeck ? (
        <AgendaDeckCardBack deck={cardPool.agendaDeck} discard={cardPool.agendaDiscard || []} />
      ) : (
        <Cardback
          src={cdnImage("/player_area/cardback_agenda.png")}
          alt="agenda cards"
          label="Agenda Cards"
          count={cardPool.agendaDeckSize ?? "–"}
        />
      )}
      <SecretDeckCardBack
        deck={cardPool.secretObjectiveDeck || []}
        discard={cardPool.secretObjectiveDiscard || []}
      />
      <RelicDeckCardBack
        deck={cardPool.relicDeck || []}
        discard={cardPool.relicDiscard || []}
      />
      <ExplorationCardBack
        type="Cultural"
        deck={cardPool.culturalExploreDeck}
        discard={cardPool.culturalExploreDiscard}
      />
      <ExplorationCardBack
        type="Industrial"
        deck={cardPool.industrialExploreDeck}
        discard={cardPool.industrialExploreDiscard}
      />
      <ExplorationCardBack
        type="Hazardous"
        deck={cardPool.hazardousExploreDeck}
        discard={cardPool.hazardousExploreDiscard}
      />
      <ExplorationCardBack
        type="Frontier"
        deck={cardPool.frontierExploreDeck}
        discard={cardPool.frontierExploreDiscard}
      />
      {isTwilightsFallMode &&
        spliceDecks(cardPool).map(({ kind, deck }) => (
          <SpliceDeckCardBack key={kind} kind={kind} deck={deck} />
        ))}
    </Box>
  );
}

export default CardPool;
