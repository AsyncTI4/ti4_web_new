import { Box, Group, SimpleGrid, Text } from "@mantine/core";
import { StrategyCard } from "@/domains/player/components/StrategyCard";
import { StrategyCard as StrategyCardType } from "@/entities/data/types";
import styles from "./UnpickedSCs.module.css";

type Props = {
  strategyCards: StrategyCardType[];
};

function UnpickedSCs({ strategyCards }: Props) {
  const unpickedCards = strategyCards.filter((card) => !card.picked);

  if (unpickedCards.length === 0) return null;

  return (
    <Box>
      <Text className={styles.sectionTitle}>Unpicked SCs</Text>
      <Group gap="md" wrap="wrap">
        <SimpleGrid cols={1} spacing="xs">
          {unpickedCards.map((card, index) => (
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
