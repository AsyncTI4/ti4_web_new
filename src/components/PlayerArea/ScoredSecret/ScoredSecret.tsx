import { Box, Text, Image } from "@mantine/core";
import { Shimmer } from "../Shimmer";
import { secretObjectives } from "../../../data/secretObjectives";
import { getGradientClasses } from "../gradientClasses";
import styles from "./ScoredSecret.module.css";

type Props = {
  secretId: string;
  score: number;
  onClick?: () => void;
};

export function ScoredSecret({ secretId, score, onClick }: Props) {
  const secretData = secretObjectives.find(
    (secret) => secret.alias === secretId
  );
  const secretName = secretData?.name || secretId;
  const redClasses = getGradientClasses("red");

  return (
    <Box className={styles.secretCard} onClick={onClick}>
      <Shimmer color="red" py={2} px={6} className={redClasses.border}>
        <Box
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            minWidth: 0,
          }}
        >
          <Image
            src="/so_icon.png"
            className={redClasses.iconFilter}
            style={{
              width: "20px",
              height: "20px",
              flexShrink: 0,
            }}
          />
          <Text
            size="xs"
            fw={700}
            c="white"
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              minWidth: 0,
              flex: 1,
            }}
          >
            {secretName}{" "}
            <Text
              span
              size="xs"
              fw={600}
              c="gray.4"
              style={{
                opacity: 0.7,
              }}
            >
              ({score})
            </Text>
          </Text>
        </Box>
      </Shimmer>
    </Box>
  );
}
