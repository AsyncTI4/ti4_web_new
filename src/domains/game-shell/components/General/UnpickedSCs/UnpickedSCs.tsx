import { Box, Group, SimpleGrid, Text } from "@mantine/core";
import { StrategyCardBannerCompact } from "@/domains/player/components/PlayerArea/StrategyCardBannerCompact";
import { StrategyCard as StrategyCardType } from "@/entities/data/types";
import { SC_COLORS, SC_NAMES } from "@/entities/data/strategyCardColors";
import { getStrategyCardByInitiative } from "@/entities/lookup/strategyCards";
import { useGameData } from "@/hooks/useGameContext";
import styles from "./UnpickedSCs.module.css";

type Props = {
  strategyCards: StrategyCardType[];
};

function UnpickedSCs({ strategyCards }: Props) {
  const gameData = useGameData();

  // Filter for unpicked strategy cards and map to component format
  const unpickedCards = strategyCards
    .filter((card) => !card.picked)
    .map((card) => {
      const sc = getStrategyCardByInitiative(
        card.initiative,
        gameData?.strategyCardIdMap
      );
      const displayName = sc?.name || SC_NAMES[card.initiative] || card.name.toUpperCase();

      return {
        number: card.initiative,
        name: displayName,
        color: SC_COLORS[card.initiative] || "red",
      };
    });

  if (unpickedCards.length === 0) return null;

  return (
    <Box>
      <Text className={styles.sectionTitle}>Unpicked SCs</Text>
      <Group gap="md" wrap="wrap">
        <SimpleGrid cols={1} spacing="xs">
          {unpickedCards.map((card, index) => (
            <StrategyCardBannerCompact
              key={index}
              number={card.number}
              text={card.name}
              color={card.color}
            />
          ))}
        </SimpleGrid>
      </Group>
    </Box>
  );
}

export default UnpickedSCs;
