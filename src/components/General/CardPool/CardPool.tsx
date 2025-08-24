import { Box, Text, SimpleGrid } from "@mantine/core";
import { Cardback } from "../../PlayerArea/Cardback";
import { cdnImage } from "../../../data/cdnImage";
import { CardPoolData, PlayerData } from "../../../data/types";
import styles from "./CardPool.module.css";
import { ExplorationCardBack } from "../../Objectives/ExplorationCardBack";
import { SecretDeckCardBack } from "../../Objectives/SecretDeckCardBack";
import { RelicDeckCardBack } from "../../Objectives/RelicDeckCardBack";

type Props = {
  cardPool?: CardPoolData;
  playerData?: PlayerData[];
};

function CardPool({ cardPool, playerData }: Props) {
  if (!cardPool) {
    return (
      <Box>
        <Text className={styles.sectionTitle}>Card Pool</Text>
        <Text size="sm" c="dimmed">
          No card pool data available
        </Text>
      </Box>
    );
  }

  return (
    <Box>
      <Text className={styles.sectionTitle}>Card Pool</Text>

      <SimpleGrid cols={4} spacing="lg">
        {[
          {
            src: cdnImage("/player_area/cardback_action.jpg"),
            alt: "action cards",
            count: (
              <Text className={styles.cardCount}>
                {cardPool.actionCardDeckSize}
              </Text>
            ),
          },
          {
            src: cdnImage("/player_area/cardback_agenda.png"),
            alt: "agenda cards",
            count: (
              <Text className={styles.cardCount}>
                {cardPool.agendaDeckSize}
              </Text>
            ),
          },
        ].map((cardback, index) => (
          <Cardback
            key={index}
            src={cardback.src}
            alt={cardback.alt}
            count={cardback.count}
            size="lg"
          />
        ))}
        <SecretDeckCardBack
          deck={cardPool.secretObjectiveDeck || []}
          discard={cardPool.secretObjectiveDiscard || []}
          playerData={playerData || []}
        />
        <RelicDeckCardBack
          deck={cardPool.relicDeck || []}
          discard={cardPool.relicDiscard || []}
        />
        {[
          <ExplorationCardBack
            type="Cultural"
            deck={cardPool.culturalExploreDeck}
            discard={cardPool.culturalExploreDiscard}
          ></ExplorationCardBack>,
          <ExplorationCardBack
            type="Industrial"
            deck={cardPool.industrialExploreDeck}
            discard={cardPool.industrialExploreDiscard}
          ></ExplorationCardBack>,
          <ExplorationCardBack
            type="Hazardous"
            deck={cardPool.hazardousExploreDeck}
            discard={cardPool.hazardousExploreDiscard}
          ></ExplorationCardBack>,
          <ExplorationCardBack
            type="Frontier"
            deck={cardPool.frontierExploreDeck}
            discard={cardPool.frontierExploreDiscard}
          ></ExplorationCardBack>,
        ]}
      </SimpleGrid>
    </Box>
  );
}

export default CardPool;
