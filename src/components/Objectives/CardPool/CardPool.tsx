import { Box, Text, Group } from "@mantine/core";
import { Cardback } from "../../PlayerArea/Cardback";
import { cdnImage } from "../../../data/cdnImage";
import { CardPoolData } from "../../../data/types";
import styles from "./CardPool.module.css";

type Props = {
  cardPool?: CardPoolData;
};

function CardPool({ cardPool }: Props) {
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

      {/* All Card Types in One Wrapping Row */}
      <Group gap={6}>
        {[
          {
            src: cdnImage("/player_area/cardback_secret.jpg"),
            alt: "secret objectives",
            count: (
              <Text className={styles.cardCount}>
                {cardPool.secretObjectiveDeckSize}
              </Text>
            ),
          },
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
          {
            src: cdnImage("/player_area/cardback_relic.jpg"),
            alt: "relics",
            count: (
              <Text className={styles.cardCount}>{cardPool.relicDeckSize}</Text>
            ),
          },
          {
            src: cdnImage("/player_area/cardback_cultural.jpg"),
            alt: "cultural explore",
            count: (
              <Text className={styles.cardCount}>
                {cardPool.culturalExploreDeckSize}
              </Text>
            ),
          },
          {
            src: cdnImage("/player_area/cardback_industrial.jpg"),
            alt: "industrial explore",
            count: (
              <Text className={styles.cardCount}>
                {cardPool.industrialExploreDeckSize}
              </Text>
            ),
          },
          {
            src: cdnImage("/player_area/cardback_hazardous.jpg"),
            alt: "hazardous explore",
            count: (
              <Text className={styles.cardCount}>
                {cardPool.hazardousExploreDeckSize}
              </Text>
            ),
          },
          {
            src: cdnImage("/player_area/cardback_frontier.jpg"),
            alt: "frontier explore",
            count: (
              <Text className={styles.cardCount}>
                {cardPool.frontierExploreDeckSize}
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
      </Group>
    </Box>
  );
}

export default CardPool;
