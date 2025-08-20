import { Box, Text, SimpleGrid } from "@mantine/core";
import { LawCard } from "./LawCard";
import { LawInPlay } from "../../../data/types";
import styles from "./LawsInPlay.module.css";

type Props = {
  laws: LawInPlay[];
};

function LawsInPlay({ laws }: Props) {
  return (
    <Box>
      <SimpleGrid cols={1} spacing="xs">
        <SimpleGrid cols={1} spacing="xs">
        <Text className={styles.sectionTitle}>Laws in Play</Text>
          {laws.map((law, index) => (
            <LawCard key={index} law={law} />
          ))}
        </SimpleGrid>
      </SimpleGrid>
    </Box>
  );
}

export default LawsInPlay;
