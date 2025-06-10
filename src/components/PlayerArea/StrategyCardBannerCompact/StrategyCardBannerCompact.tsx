import { Box, Group, Text } from "@mantine/core";
import { SpeakerToken } from "../SpeakerToken";
import classes from "./StrategyCardBannerCompact.module.css";

interface Props {
  number: number;
  text: string;
  color: string;
  isSpeaker: boolean;
  isExhausted?: boolean;
}

// Strategy card color mapping to Mantine colors for number display
const SC_NUMBER_COLORS = {
  red: "red.9",
  orange: "orange.9",
  yellow: "yellow.9",
  green: "green.9",
  teal: "teal.9",
  cyan: "cyan.9",
  blue: "blue.9",
  purple: "violet.9",
} as const;

// Strategy card color mapping to CSS classes
const SC_COLOR_CLASSES = {
  red: classes.red,
  orange: classes.orange,
  yellow: classes.yellow,
  green: classes.green,
  teal: classes.teal,
  cyan: classes.cyan,
  blue: classes.blue,
  purple: classes.purple,
} as const;

export function StrategyCardBannerCompact({
  number,
  text,
  color,
  isSpeaker,
  isExhausted = false,
}: Props) {
  const numberColor =
    SC_NUMBER_COLORS[color as keyof typeof SC_NUMBER_COLORS] || "red.9";
  const colorClass =
    SC_COLOR_CLASSES[color as keyof typeof SC_COLOR_CLASSES] || classes.red;

  return (
    <Group className={classes.container} gap="lg">
      {/* Speaker Token */}
      <SpeakerToken isVisible={isSpeaker} />

      <Box
        className={`${classes.cardContainer} ${colorClass}`}
        style={{ opacity: isExhausted ? 0.5 : 1 }}
      >
        {/* Strategy card number circle */}
        <Box className={classes.numberCircle}>
          <Text ff="heading" c={numberColor} className={classes.numberText}>
            {number}
          </Text>
        </Box>

        {/* Strategy card text - abbreviated */}
        <Text ff="heading" className={classes.cardText}>
          {text}
        </Text>
      </Box>
    </Group>
  );
}
