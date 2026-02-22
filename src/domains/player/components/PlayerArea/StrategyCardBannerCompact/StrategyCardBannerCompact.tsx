import { Box, Group, Text } from "@mantine/core";
import { useDisclosure } from "@/hooks/useDisclosure";
import cx from "clsx";
import { IconX } from "@tabler/icons-react";
import { Chip } from "@/shared/ui/primitives/Chip";
import classes from "./StrategyCardBannerCompact.module.css";
import { SmoothPopover } from "@/shared/ui/SmoothPopover";
import { StrategyCardDetailsCard } from "../StrategyCardDetailsCard";
import { getStrategyCardByInitiative } from "@/entities/lookup/strategyCards";
import { useGameData } from "@/hooks/useGameContext";
import { ColorKey } from "../gradientClasses";

interface Props {
  number: number;
  text: string;
  color: string;
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
  isExhausted = false,
}: Props) {
  const { opened, setOpened, toggle } = useDisclosure(false);
  const gameData = useGameData();
  const sc = getStrategyCardByInitiative(number, gameData?.strategyCardIdMap);
  const displayText = sc?.name || text;
  const numberColor =
    SC_NUMBER_COLORS[color as keyof typeof SC_NUMBER_COLORS] || "red.9";
  const colorClass =
    SC_COLOR_CLASSES[color as keyof typeof SC_COLOR_CLASSES] || classes.red;

  return (
    <SmoothPopover opened={opened} onChange={setOpened} position="bottom">
      <SmoothPopover.Target>
        <Group className={classes.container} gap="lg">
          <Chip
            accent={color as ColorKey}
            className={`${classes.cardContainer} ${colorClass}`}
            onClick={toggle}
          >
            <Box
              className={cx(
                classes.numberCircle,
                isExhausted && classes.exhaustedNumberCircle
              )}
            >
              <Text ff="heading" c={numberColor} className={classes.numberText}>
                {number}
              </Text>
              {isExhausted && (
                <span className={classes.exhaustedX}>
                  <IconX
                    size={22}
                    stroke={3}
                    color="var(--mantine-color-red-6)"
                  />
                </span>
              )}
            </Box>
            <Text ff="heading" className={classes.cardText}>
              {displayText}
            </Text>
          </Chip>
        </Group>
      </SmoothPopover.Target>
      <SmoothPopover.Dropdown p={0}>
        <StrategyCardDetailsCard initiative={number} color={color as any} />
      </SmoothPopover.Dropdown>
    </SmoothPopover>
  );
}
