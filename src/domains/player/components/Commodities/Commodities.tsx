import { StoresGauge } from "../StoresGauge/StoresGauge";

type Props = {
  commodities: number;
  commoditiesTotal: number;
};

export function Commodities({ commodities, commoditiesTotal }: Props) {
  return (
    <StoresGauge
      iconSrc="/comms.png"
      accentRgb="var(--gd-gray)"
      value={commodities}
      capacity={commoditiesTotal}
      label={`${commodities} of ${commoditiesTotal} commodities`}
    />
  );
}
