import { Box, Text } from "@/ds";
import { LawCard } from "./LawCard";
import { LawInPlay } from "@/entities/data/types";
import styles from "./LawsInPlay.module.css";

type Props = {
  laws: LawInPlay[];
};

/** Laws in play as a column of sealed rows. */
function LawsInPlay({ laws }: Props) {
  if (laws.length === 0) {
    return <Text className={styles.emptyText}>No laws in play</Text>;
  }

  return (
    <Box className={styles.list}>
      {laws.map((law, index) => (
        <LawCard key={`${law.id}-${index}`} law={law} />
      ))}
    </Box>
  );
}

export default LawsInPlay;
