import type { CSSProperties, KeyboardEvent } from "react";
import cx from "clsx";
import { useDisclosure } from "@/hooks/useDisclosure";
import { SmoothPopover } from "@/shared/ui/SmoothPopover";
import { isMobileDevice } from "@/utils/isTouchDevice";
import { SC_COLORS, SC_NAMES } from "@/entities/data/strategyCardColors";
import { getStrategyCardByInitiative } from "@/entities/lookup/strategyCards";
import { useGameData } from "@/state/useGameContext";
import { StrategyCardDetailsCard } from "@/domains/cards/components/StrategyCardDetailsCard";
import { StrategyCardSheet } from "@/domains/cards/components/StrategyCardSheet";
import type { ColorKey } from "@/shared/ui/gradientClasses";
import classes from "./StrategyCard.module.css";

type StrategyCardColor = Extract<
  ColorKey,
  "red" | "orange" | "yellow" | "green" | "teal" | "cyan" | "blue" | "purple"
>;

type Props = {
  initiative: number;
  tradeGoods?: number;
  isExhausted?: boolean;
  /** "sm" seats the plate in a 34px header rail. */
  size?: "sm" | "md";
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

/**
 * Strategy card: a chamfered plate in the card's own colour with a stamped
 * dark disc for initiative. Played cards are hatched without covering the
 * number; unpicked cards show the trade goods parked on them.
 */
export function StrategyCard({
  initiative,
  tradeGoods = 0,
  isExhausted = false,
  size = "md",
}: Props) {
  const { opened, setOpened, toggle } = useDisclosure(false);
  const gameData = useGameData();
  const strategyCard = getStrategyCardByInitiative(
    initiative,
    gameData?.strategyCardIdMap,
  );
  const color = getStrategyCardColor(initiative);
  const isMobile = isMobileDevice();
  const name = strategyCard?.name || SC_NAMES[initiative];
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    toggle();
  };

  const plate = (
    <div
      role="button"
      tabIndex={0}
      title={isExhausted ? `${name} (played)` : name}
      className={cx(classes.plate, size === "sm" && classes.sm)}
      data-s={isExhausted ? "played" : undefined}
      style={{ "--scc": `var(--gd-${color})` } as CSSProperties}
      onClick={toggle}
      onKeyDown={handleKeyDown}
    >
      <span className={classes.disc}>{initiative}</span>
      <span className={classes.name}>{name}</span>
      {tradeGoods > 0 && (
        <span className={classes.tgv}>
          <img src="/tg.png" alt="" />
          {tradeGoods}
        </span>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <>
        {plate}
        <StrategyCardSheet
          initiative={initiative}
          color={color}
          opened={opened}
          onClose={() => setOpened(false)}
        />
      </>
    );
  }

  return (
    <SmoothPopover opened={opened} onChange={setOpened} position="bottom">
      <SmoothPopover.Target>{plate}</SmoothPopover.Target>
      <SmoothPopover.Dropdown p={0}>
        <StrategyCardDetailsCard initiative={initiative} color={color} />
      </SmoothPopover.Dropdown>
    </SmoothPopover>
  );
}
