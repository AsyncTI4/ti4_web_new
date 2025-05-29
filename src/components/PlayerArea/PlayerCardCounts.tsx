import { Group } from "@mantine/core";
import { Cardback } from "./Cardback";
import { cdnImage } from "../../data/cdnImage";

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
          src: cdnImage("/player_area/pa_cardbacks_so.png"),
          alt: "secret objectives",
          count: 0, // Mock data as requested
        },
        {
          src: "/cardback/cardback_action.png",
          alt: "action cards",
          count: 4, // Mock data as requested
        },
        {
          src: cdnImage("/player_area/pa_cardbacks_pn.png"),
          alt: "promissory notes",
          count: 7, // Mock data as requested
        },
        {
          src: cdnImage("/player_area/pa_cardbacks_tradegoods.png"),
          alt: "trade goods",
          count: tg,
        },
        {
          src: cdnImage("/player_area/pa_cardbacks_commodities.png"),
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
