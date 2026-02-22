import type { ReactNode } from "react";
import { Stack, type StackProps } from "@mantine/core";
import { TradeGoods } from "../TradeGoods/TradeGoods";
import { Commodities } from "../Commodities/Commodities";
import { DebtTokens } from "../DebtTokens";
import type { PlayerData } from "@/data/types";

type Props = {
  tg?: number | null;
  commodities?: number | null;
  commoditiesTotal?: number | null;
  debtTokens?: PlayerData["debtTokens"];
  children?: ReactNode;
  stackProps?: StackProps;
};

export function PlayerEconomyStack({
  tg = 0,
  commodities = 0,
  commoditiesTotal = 0,
  debtTokens,
  children,
  stackProps,
}: Props) {
  return (
    <Stack gap={stackProps?.gap ?? 4} {...stackProps}>
      <TradeGoods tg={tg} />
      <Commodities
        commodities={commodities}
        commoditiesTotal={commoditiesTotal}
      />
      {children}
      {debtTokens && <DebtTokens debts={debtTokens} />}
    </Stack>
  );
}
