import { Box, Text, Image } from "@mantine/core";
import { Shimmer } from "../Shimmer";
import { getSecretObjectiveData } from "../../../lookup/secretObjectives";
import { getGradientClasses } from "../gradientClasses";
import styles from "./ScoredSecret.module.css";
import hierarchy from "../../shared/primitives/Hierarchy.module.css";

type Props = {
  secretId: string;
  cardId?: number;
  onClick?: () => void;
  variant?: "scored" | "unscored";
};

export function ScoredSecret({
  secretId,
  cardId,
  onClick,
  variant = "scored",
}: Props) {
  const secretData = getSecretObjectiveData(secretId);
  const secretName = secretData?.name || secretId;
  const redClasses = getGradientClasses("red");
  const grayClasses = getGradientClasses("gray");

  const isScored = variant === "scored";
  const colorClasses = isScored ? redClasses : grayClasses;
  const shimmerColor = isScored ? "red" : "gray";

  return (
    <Box
      className={`${styles.secretCard} ${!isScored ? styles.gray : ""} ${hierarchy.chip} ${hierarchy.chipOutline} ${hierarchy.chipGlowHover} ${hierarchy.hoverOutline} ${isScored ? hierarchy.hoverOutlineRed : hierarchy.hoverOutlineGray}`}
      onClick={onClick}
    >
      <Shimmer
        color={shimmerColor}
        py={2}
        px={6}
        className={colorClasses.border}
      >
        <Box className={styles.contentContainer}>
          <Image
            src="/so_icon.png"
            className={`${colorClasses.iconFilter} ${styles.icon}`}
          />
          <Text size="xs" fw={700} c="white" className={styles.textContainer}>
            {cardId && (
              <Text
                span
                size="xs"
                fw={600}
                c="gray.4"
                className={styles.scoreText}
              >
                ({cardId}){" "}
              </Text>
            )}
            {secretName}
          </Text>
        </Box>
      </Shimmer>
    </Box>
  );
}
