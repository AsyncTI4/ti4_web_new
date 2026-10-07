import { Group } from "@mantine/core";
import { Cardback } from "@/shared/ui/Cardback";
import { cdnImage } from "@/entities/data/cdnImage";

type Props = {
  pnCount: number;
  acCount: number;
};

export function PlayerCardCounts({ pnCount, acCount }: Props) {
  return (
    <Group gap={4} align="flex-start" wrap="wrap">
      <Cardback
        src="/cardback/cardback_action.png"
        alt="action cards"
        count={acCount}
        size="sm"
      />
      <Cardback
        src={cdnImage("/player_area/pa_cardbacks_pn.png")}
        alt="promissory notes"
        count={pnCount}
        size="sm"
      />
    </Group>
  );
}
