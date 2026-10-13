import { Box, Text } from "@/ds";
import { Cardback } from "@/shared/ui/Cardback";
import { cdnImage } from "@/entities/data/cdnImage";
import { CardPoolData } from "@/entities/data/types";
import styles from "./CardPool.module.css";
import { ExplorationCardBack } from "@/domains/cards/components/ExplorationCardBack";
import { SecretDeckCardBack } from "@/domains/cards/components/SecretDeckCardBack";
import { RelicDeckCardBack } from "@/domains/cards/components/RelicDeckCardBack";

type Props = {
  cardPool?: CardPoolData;
};

/** Deck card backs with the cards left in each; click a deck for its list. */
function CardPool({ cardPool }: Props) {
  if (!cardPool) {
    return <Text className={styles.empty}>No card pool data available</Text>;
  }

  return (
    <Box className={styles.pool}>
      <Cardback
        src={cdnImage("/player_area/cardback_action.jpg")}
        alt="action cards"
        count={cardPool.actionCardDeckSize ?? "–"}
      />
      <Cardback
        src={cdnImage("/player_area/cardback_agenda.png")}
        alt="agenda cards"
        count={cardPool.agendaDeckSize ?? "–"}
      />
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
    </Box>
  );
}

export default CardPool;
