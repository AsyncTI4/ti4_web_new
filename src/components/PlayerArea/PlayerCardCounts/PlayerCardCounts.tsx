import { Flex, Group } from "@mantine/core";
import { Cardback } from "../Cardback";
import { cdnImage } from "../../../data/cdnImage";

type Props = {
  pnCount: number;
  acCount: number;
};

export function PlayerCardCounts({
  pnCount,
  acCount,
}: Props) {
  return (
    <Flex justify={"center"} wrap={"wrap"} gap={4} >
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
            addBorder={true}
            size="sm"
          />
        ))}
      </Group>
    </Flex>
  );
}