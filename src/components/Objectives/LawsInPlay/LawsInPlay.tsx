import { Box, Text, SimpleGrid } from "@mantine/core";
import { LawCard } from "./LawCard";
import { LawInPlay } from "../../../data/types";
import styles from "./LawsInPlay.module.css";

type Props = {
  laws: LawInPlay[];
  factionToColor?: Record<string, string>;
};

function LawsInPlay({ laws, factionToColor }: Props) {
  return (
    <Box>
      <Text className={styles.sectionTitle}>Laws in Play</Text>
      <SimpleGrid cols={2} spacing="xs">
        {laws.map((law, index) => (
          <LawCard key={index} law={law} factionToColor={factionToColor} />
        ))}
      </SimpleGrid>
    </Box>
  );
}

export default LawsInPlay;
