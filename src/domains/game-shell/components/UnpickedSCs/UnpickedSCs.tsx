import { Box, Text } from "@/ds";
import { StrategyCard } from "@/domains/player/components/StrategyCard";
import { StrategyCard as StrategyCardType } from "@/entities/data/types";
import styles from "./UnpickedSCs.module.css";

type Props = {
  strategyCards: StrategyCardType[];
};

/** Strategy cards still on the table, each with the trade goods parked on it. */
function UnpickedSCs({ strategyCards }: Props) {
  const unpickedCards = strategyCards.filter((card) => !card.picked);

  if (unpickedCards.length === 0) {
    return <Text className={styles.empty}>All strategy cards picked</Text>;
  }

  return (
    <Box className={styles.row}>
      {unpickedCards.map((card) => (
        <StrategyCard
          key={card.initiative}
          initiative={card.initiative}
          tradeGoods={card.tradeGoods}
        />
      ))}
    </Box>
  );
}

export default UnpickedSCs;
