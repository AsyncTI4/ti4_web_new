import { Group, Stack } from "@mantine/core";
import { Cardback } from "../Cardback";
import { cdnImage } from "../../../data/cdnImage";

type Props = {
  tg: number;
  commodities: number;
  commoditiesTotal: number;
  pnCount: number;
  acCount: number;
};

export function PlayerCardCounts({
  tg,
  commodities,
  commoditiesTotal,
  pnCount,
  acCount,
}: Props) {
  return (
    <Stack gap={4} >
      <Group gap={4} justify="center">
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
            size="md"
          />
        ))}
      </Group>
      <Group gap={4} justify="center">
        {[
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
            size="md"
          />
        ))}
      </Group>
    </Stack>
  );
}
