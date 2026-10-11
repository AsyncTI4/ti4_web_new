import { Box, Text } from "@mantine/core";
import cx from "clsx";
import { useDisclosure } from "@/hooks/useDisclosure";
import { SmoothPopover } from "@/shared/ui/SmoothPopover";
import { AppModal } from "@/shared/ui/AppModal";
import { visualViewportModalStyles } from "@/shared/ui/visualViewportModal";
import { useVisualViewport } from "@/hooks/useVisualViewport";
import { isMobileDevice } from "@/utils/isTouchDevice";
import { Chip } from "@/shared/ui/primitives/Chip";
import {
  SC_COLORS,
  SC_NAMES,
} from "@/entities/data/strategyCardColors";
import { getStrategyCardByInitiative } from "@/entities/lookup/strategyCards";
import { useGameData } from "@/state/useGameContext";
import { StrategyCardDetailsCard } from "@/domains/cards/components/StrategyCardDetailsCard";
import type { ColorKey } from "@/shared/ui/gradientClasses";
import classes from "./StrategyCard.module.css";
import { cdnImage } from "@/entities/data/cdnImage";

type StrategyCardColor = Extract<
  ColorKey,
  "red" | "orange" | "yellow" | "green" | "teal" | "cyan" | "blue" | "purple"
>;

/** The details card's width wherever the screen has room for it. */
const DETAILS_WIDTH = 320;
const MOBILE_SCREEN_GAP = 10;

type Props = {
  initiative: number;
  tradeGoods?: number;
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

export function StrategyCard({
  initiative,
  tradeGoods = 0,
  isExhausted = false,
}: Props) {
  const { opened, setOpened, toggle } = useDisclosure(false);
  const gameData = useGameData();
  const strategyCard = getStrategyCardByInitiative(
    initiative,
    gameData?.strategyCardIdMap
  );
  const color = getStrategyCardColor(initiative);
  const isMobile = isMobileDevice();

  const chip = (
    <Chip
      accent={color}
      className={cx(classes.card, isExhausted && classes.exhausted)}
      onClick={toggle}
    >
      <Box
        className={cx(
          classes.number,
          isExhausted && classes.numberExhausted
        )}
      >
        <Text ff="heading" className={classes.numberText}>
          {initiative}
        </Text>
      </Box>
      <Text ff="heading" className={classes.name}>
        {strategyCard?.name || SC_NAMES[initiative]}
      </Text>
      {tradeGoods > 0 && (
        <span className={classes.tradeGoodsContainer}>
          <img
            src={cdnImage("/player_area/pa_cardbacks_tradegoods.png")}
            className={classes.tradeGoodsImage}
            alt=""
          />
          <span className={classes.tradeGoodsCount}>{tradeGoods}</span>
        </span>
      )}
    </Chip>
  );

  if (isMobile) {
    return (
      <>
        {chip}
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
      <SmoothPopover.Target>{chip}</SmoothPopover.Target>
      <SmoothPopover.Dropdown p={0}>
        <StrategyCardDetailsCard initiative={initiative} color={color} />
      </SmoothPopover.Dropdown>
    </SmoothPopover>
  );
}

type SheetProps = {
  initiative: number;
  color: StrategyCardColor;
  opened: boolean;
  onClose: () => void;
};

/**
 * The card's text on a phone. A popover is placed against the layout
 * viewport, so on a pinched board it lands off screen and scales with the
 * pinch; this sheet is pinned to what is actually on screen instead.
 */
function StrategyCardSheet({ initiative, color, opened, onClose }: SheetProps) {
  const viewport = useVisualViewport(opened);

  return (
    <AppModal
      opened={opened}
      onClose={onClose}
      padding={0}
      withCloseButton={false}
      classNames={{ content: classes.sheetContent }}
      styles={visualViewportModalStyles(viewport, {
        gap: MOBILE_SCREEN_GAP,
        maxWidth: DETAILS_WIDTH,
      })}
      transitionProps={{ transition: "fade", duration: 160 }}
    >
      <StrategyCardDetailsCard initiative={initiative} color={color} fluid />
    </AppModal>
  );
}
