import { cdnImage } from "@/entities/data/cdnImage";
import { ExplorationCardDetailsModal } from "../ExplorationCardDetailsModal";
import { CardbackModal } from "@/shared/ui/CardbackModal";

/** Planet-trait colours, matching the trait icons on the board. */
const TRAIT_TONE: Record<string, string> = {
  CULTURAL: "var(--ds-sig-prop)",
  HAZARDOUS: "var(--ds-sig-war)",
  INDUSTRIAL: "var(--ds-sig-bio)",
};

type Props = {
  type: string;
  deck: string[];
  discard: string[];
};

export function ExplorationCardBack({ type, deck, discard }: Props) {
  return (
    <CardbackModal
      cardKey={type}
      imageSrc={cdnImage(`/player_area/cardback_${type.toLowerCase()}.jpg`)}
      alt={`${type} explore`}
      title={`${type.charAt(0).toUpperCase()}${type.slice(1).toLowerCase()} exploration`}
      count={deck?.length ?? 0}
    >
      <ExplorationCardDetailsModal
        deck={deck}
        discard={discard}
        tone={TRAIT_TONE[type.toUpperCase()]}
      />
    </CardbackModal>
  );
}
