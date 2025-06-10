import { Box, Group, Text } from "@mantine/core";
import { StrategyCard } from "../../PlayerArea/StrategyCard";
import { StrategyCard as StrategyCardType } from "../../../data/types";
import { SC_COLORS, SC_NAMES } from "../../../data/strategyCardColors";
import styles from "./UnpickedSCs.module.css";

type Props = {
  strategyCards: StrategyCardType[];
};

function UnpickedSCs({ strategyCards }: Props) {
  // Filter for unpicked strategy cards and map to component format
  const unpickedCards = strategyCards
    .filter((card) => !card.picked)
    .map((card) => ({
      number: card.initiative,
      name: SC_NAMES[card.initiative] || card.name.toUpperCase(),
      color: SC_COLORS[card.initiative] as
        | "blue"
        | "purple"
        | "yellow"
        | "red"
        | "green"
        | "orange"
        | "gray"
        | "teal"
        | undefined,
      tradeGoods: card.tradeGoods,
    }));

  if (unpickedCards.length === 0) return null;

  return (
    <Box>
      <Text className={styles.sectionTitle}>Unpicked SCs</Text>
      <Group gap="md" wrap="wrap">
        {unpickedCards.map((card, index) => (
          <StrategyCard
            key={index}
            number={card.number}
            name={card.name}
            color={card.color}
            tradeGoods={card.tradeGoods}
          />
        ))}
      </Group>
    </Box>
  );
}

export default UnpickedSCs;
