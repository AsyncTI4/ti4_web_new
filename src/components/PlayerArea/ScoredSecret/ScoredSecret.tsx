import { Box, Text, Image } from "@mantine/core";
import { Shimmer } from "../Shimmer";
import { getSecretObjectiveData } from "../../../lookup/secretObjectives";
import { getGradientClasses } from "../gradientClasses";
import styles from "./ScoredSecret.module.css";

type Props = {
  secretId: string;
  score: number;
  onClick?: () => void;
};

export function ScoredSecret({ secretId, score, onClick }: Props) {
  const secretData = getSecretObjectiveData(secretId);
  const secretName = secretData?.name || secretId;
  const redClasses = getGradientClasses("red");

  return (
    <Box className={styles.secretCard} onClick={onClick}>
      <Shimmer color="red" py={2} px={6} className={redClasses.border}>
        <Box className={styles.contentContainer}>
          <Image
            src="/so_icon.png"
            className={`${redClasses.iconFilter} ${styles.icon}`}
          />
          <Text size="xs" fw={700} c="white" className={styles.textContainer}>
            <Text
              span
              size="xs"
              fw={600}
              c="gray.4"
              className={styles.scoreText}
            >
              ({score}){" "}
            </Text>
            {secretName}
          </Text>
        </Box>
      </Shimmer>
    </Box>
  );
}
