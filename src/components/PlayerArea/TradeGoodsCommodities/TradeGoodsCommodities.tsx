import { Flex, Group, Stack } from "@mantine/core";
import { Cardback } from "../Cardback";
import { cdnImage } from "../../../data/cdnImage";

type Props = {
  tg: number;
  commodities: number;
  commoditiesTotal: number;
};

export function TradeGoodsCommodities({
  tg,
  commodities,
  commoditiesTotal,
}: Props) {
  return (
    <Flex justify={"center"} wrap={"wrap"} gap={4} >
      <Stack gap={4} justify="center">
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
            size="xs"
          />
        ))}
      </Stack>
    </Flex>
  );
}
