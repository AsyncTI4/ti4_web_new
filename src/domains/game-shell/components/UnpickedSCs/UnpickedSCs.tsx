import { Box, Group, SimpleGrid, Text } from "@mantine/core";
import { StrategyCard } from "@/domains/player/components/StrategyCard";
import { StrategyCard as StrategyCardType } from "@/entities/data/types";
import { useHideScoreOrder } from "@/hooks/useGameContext";
import styles from "./UnpickedSCs.module.css";

type Props = {
  strategyCards: StrategyCardType[];
};

function UnpickedSCs({ strategyCards }: Props) {
  // Which cards are still unpicked is private under fog - it gives the picks away by elimination,
  // and the trade goods accumulating on them are the tell. Playing a card is announced, so a
  // fogged viewer gets the played cards instead, which are public either way.
  const showPlayed = useHideScoreOrder();
  const cards = strategyCards.filter((card) =>
    showPlayed ? card.played : !card.picked
  );

  if (cards.length === 0) return null;

  return (
    <Box>
      <Text className={styles.sectionTitle}>
        {showPlayed ? "Played SCs" : "Unpicked SCs"}
      </Text>
      <Group gap="md" wrap="wrap">
        <SimpleGrid cols={1} spacing="xs">
          {cards.map((card, index) => (
            <StrategyCard
              key={index}
              initiative={card.initiative}
              tradeGoods={card.tradeGoods}
            />
          ))}
        </SimpleGrid>
      </Group>
    </Box>
  );
}

export default UnpickedSCs;
