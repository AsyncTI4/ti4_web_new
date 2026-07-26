import { StoresGauge } from "../StoresGauge/StoresGauge";

type Props = {
  tg: number;
};

export function TradeGoods({ tg }: Props) {
  return (
    <StoresGauge
      iconSrc="/tg.png"
      accentRgb="var(--gd-yellow)"
      value={tg}
      label={`${tg} trade goods`}
    />
  );
}
