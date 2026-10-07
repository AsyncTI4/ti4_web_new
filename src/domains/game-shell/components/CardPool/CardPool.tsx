import { Box, Text, SimpleGrid } from "@mantine/core";
import { Cardback } from "@/shared/ui/Cardback";
import { cdnImage } from "@/entities/data/cdnImage";
import { CardPoolData } from "@/entities/data/types";
import styles from "./CardPool.module.css";
import { GeneralSectionTitle } from "@/shared/ui/GeneralSectionTitle/GeneralSectionTitle";
import { ExplorationCardBack } from "@/domains/cards/components/ExplorationCardBack";
import { SecretDeckCardBack } from "@/domains/cards/components/SecretDeckCardBack";
import { RelicDeckCardBack } from "@/domains/cards/components/RelicDeckCardBack";

type Props = {
  cardPool?: CardPoolData;
};

function CardPool({ cardPool }: Props) {
  if (!cardPool) {
    return (
      <Box>
        <GeneralSectionTitle>Card Pool</GeneralSectionTitle>
        <Text size="sm" c="dimmed">
          No card pool data available
        </Text>
      </Box>
    );
  }

  return (
    <Box>
      <GeneralSectionTitle>Card Pool</GeneralSectionTitle>

      <SimpleGrid cols={4} spacing="lg">
        <Cardback
          src={cdnImage("/player_area/cardback_action.jpg")}
          alt="action cards"
          count={
            <Text className={styles.cardCount}>
              {cardPool.actionCardDeckSize}
            </Text>
          }
          size="lg"
        />
        <Cardback
          src={cdnImage("/player_area/cardback_agenda.png")}
          alt="agenda cards"
          count={
            <Text className={styles.cardCount}>{cardPool.agendaDeckSize}</Text>
          }
          size="lg"
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
      </SimpleGrid>
    </Box>
  );
}

export default CardPool;
