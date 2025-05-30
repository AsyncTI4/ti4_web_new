import { Group } from "@mantine/core";
import { Cardback } from "./Cardback";
import { cdnImage } from "../../data/cdnImage";

type Props = {
  tg: number;
  commodities: number;
  commoditiesTotal: number;
  soCount: number;
  pnCount: number;
  acCount: number;
};

export function PlayerCardCounts({
  tg,
  commodities,
  commoditiesTotal,
  soCount,
  pnCount,
  acCount,
}: Props) {
  return (
    <Group gap={6} justify="center">
      {[
        {
          src: cdnImage("/player_area/pa_cardbacks_so.png"),
          alt: "secret objectives",
          count: soCount,
        },
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
