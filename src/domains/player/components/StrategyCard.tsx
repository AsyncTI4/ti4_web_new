import { Box, Text } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import cx from "clsx";
import { useDisclosure } from "@/hooks/useDisclosure";
import { SmoothPopover } from "@/shared/ui/SmoothPopover";
import { Chip } from "@/shared/ui/primitives/Chip";
import {
  SC_COLORS,
  SC_NAMES,
  SC_NUMBER_COLORS,
} from "@/entities/data/strategyCardColors";
import { getStrategyCardByInitiative } from "@/entities/lookup/strategyCards";
import { useGameData } from "@/hooks/useGameContext";
import { StrategyCardDetailsCard } from "./StrategyCardDetailsCard";
import type { ColorKey } from "./gradientClasses";
import classes from "./StrategyCard.module.css";

type StrategyCardColor = Extract<
  ColorKey,
  "red" | "orange" | "yellow" | "green" | "teal" | "cyan" | "blue" | "purple"
>;

type Props = {
  initiative: number;
  isExhausted?: boolean;
};

const STRATEGY_CARD_COLORS = new Set<StrategyCardColor>([
  "red",
  "orange",
  "yellow",
  "green",
  "teal",
  "cyan",
  "blue",
  "purple",
]);

function getStrategyCardColor(initiative: number): StrategyCardColor {
  const color = SC_COLORS[initiative];
  return STRATEGY_CARD_COLORS.has(color as StrategyCardColor)
    ? (color as StrategyCardColor)
    : "red";
}

export function StrategyCard({ initiative, isExhausted = false }: Props) {
  const { opened, setOpened, toggle } = useDisclosure(false);
  const gameData = useGameData();
  const strategyCard = getStrategyCardByInitiative(
    initiative,
    gameData?.strategyCardIdMap
  );
  const color = getStrategyCardColor(initiative);
  const numberColor = color === "yellow" ? "yellow.8" : SC_NUMBER_COLORS[color];

  return (
    <SmoothPopover opened={opened} onChange={setOpened} position="bottom">
      <SmoothPopover.Target>
        <Chip accent={color} className={classes.card} onClick={toggle}>
          <Box
            className={cx(
              classes.number,
              isExhausted && classes.numberExhausted
            )}
          >
            <Text ff="heading" c={numberColor} className={classes.numberText}>
              {initiative}
            </Text>
            {isExhausted && (
              <span className={classes.exhaustedIcon}>
                <IconX
                  size={22}
                  stroke={3}
                  color="var(--mantine-color-red-6)"
                />
              </span>
            )}
          </Box>
          <Text ff="heading" className={classes.name}>
            {strategyCard?.name || SC_NAMES[initiative]}
          </Text>
        </Chip>
      </SmoothPopover.Target>
      <SmoothPopover.Dropdown p={0}>
        <StrategyCardDetailsCard initiative={initiative} color={color} />
      </SmoothPopover.Dropdown>
    </SmoothPopover>
  );
}
