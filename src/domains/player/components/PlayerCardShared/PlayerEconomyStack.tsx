import { Stack } from "@mantine/core";
import { TradeGoods } from "../TradeGoods/TradeGoods";
import { Commodities } from "../Commodities/Commodities";

type Props = {
  tg?: number | null;
  commodities?: number | null;
  commoditiesTotal?: number | null;
};

export function PlayerEconomyStack({ tg, commodities, commoditiesTotal }: Props) {
  return (
    <Stack gap={4}>
      <TradeGoods tg={tg ?? 0} />
      <Commodities
        commodities={commodities ?? 0}
        commoditiesTotal={commoditiesTotal ?? 0}
      />
    </Stack>
  );
}
