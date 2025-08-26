import { Box, Flex, Group, Stack } from "@mantine/core";
import { Cardback } from "../Cardback";
import { cdnImage } from "../../../data/cdnImage";
import { TradeGoods } from "../TradeGoods/TradeGoods";
import { Commodities } from "../Commodities/Commodities";
import { DebtTokens } from "../DebtTokens";

type Props = {
  pnCount: number;
  acCount: number;
  tg?: number;
  commodities?: number;
  commoditiesTotal?: number;
  debtTokens?: Record<string, number>;
};

export function PlayerCardCounts({
  pnCount,
  acCount,
  tg,
  commodities,
  commoditiesTotal,
  debtTokens,
}: Props) {
  const hasResources =
    tg !== undefined || commodities !== undefined || debtTokens !== undefined;
  return (
    <Group gap={4} align="flex-start" wrap="wrap">
      {[
        {
          src: "/cardback/cardback_action.png",
          alt: "action cards",
          count: acCount,
        },
        {
          src: cdnImage("/player_area/pa_cardbacks_pn.png"),
          alt: "promissory notes",
          count: pnCount,
        },
      ].map((cardback, index) => (
        <Cardback
          key={index}
          src={cardback.src}
          alt={cardback.alt}
          count={cardback.count}
          addBorder={true}
          size="sm"
        />
      ))}
      {hasResources && (
        <Stack gap={4}>
          {tg !== undefined && <TradeGoods tg={tg} />}
          {commodities !== undefined && (
            <Commodities
              commodities={commodities}
              commoditiesTotal={commoditiesTotal || 0}
            />
          )}
        </Stack>
      )}
      {debtTokens && Object.keys(debtTokens).length > 0 && (
        <Box>
          <DebtTokens debts={debtTokens} />
        </Box>
      )}
    </Group>
  );
}
