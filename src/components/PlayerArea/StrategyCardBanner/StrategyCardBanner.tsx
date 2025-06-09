import { Box, Group, Text } from "@mantine/core";
import { SpeakerToken } from "../SpeakerToken";
import { Shimmer } from "../Shimmer/Shimmer";
import { SC_NUMBER_COLORS } from "../../../data/strategyCardColors";
import styles from "./StrategyCardBanner.module.css";

interface Props {
  number: number;
  text: string;
  color: string;
  isSpeaker: boolean;
}

export function StrategyCardBanner({ number, text, color, isSpeaker }: Props) {
  const numberColor =
    SC_NUMBER_COLORS[color as keyof typeof SC_NUMBER_COLORS] || "red.9";

  return (
    <Group className={styles.container}>
      {/* Speaker Token */}
      <SpeakerToken isVisible={isSpeaker} />

      <Shimmer
        color={color as any}
        className={`${styles.strategyCardBanner} ${styles[color as keyof typeof styles]}`}
      >
        {/* Additional subtle inner glow overlay */}
        <Box
          className={`${styles.innerGlow} ${styles[color as keyof typeof styles]}`}
        />

        <Box
          className={`${styles.iconFilter} ${styles.iconWithBorder} ${styles[color as keyof typeof styles]}`}
        >
          <Text ff="heading" c={numberColor} className={styles.numberText}>
            {number}
          </Text>
        </Box>
        <Text ff="heading" className={styles.cardText}>
          {text}
        </Text>
      </Shimmer>
    </Group>
  );
}
