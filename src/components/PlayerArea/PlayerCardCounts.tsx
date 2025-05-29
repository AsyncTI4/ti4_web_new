import { Group } from "@mantine/core";
import { Cardback } from "./Cardback";

type Props = {
  tg: number;
  commodities: number;
  commoditiesTotal: number;
};

export function PlayerCardCounts({ tg, commodities, commoditiesTotal }: Props) {
  return (
    <Group gap={6} justify="center">
      {[
        {
          src: "/cardback/cardback_so.png",
          alt: "secret objectives",
          count: 0, // Mock data as requested
        },
        {
          src: "/cardback/cardback_action.png",
          alt: "action cards",
          count: 4, // Mock data as requested
        },
        {
          src: "/cardback/cardback_pn.png",
          alt: "promissory notes",
          count: 7, // Mock data as requested
        },
        {
          src: "/cardback/cardback_tg.png",
          alt: "trade goods",
          count: tg,
        },
        {
          src: "/cardback/cardback_comms.png",
          alt: "commodities",
          count: `${commodities}/${commoditiesTotal}`,
        },
      ].map((cardback, index) => (
        <Cardback
          key={index}
          src={cardback.src}
          alt={cardback.alt}
          count={cardback.count}
        />
      ))}
    </Group>
  );
}
