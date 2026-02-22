import { ExplorationCardDetailsModal } from "../shared/ExplorationCardDetailsModal";

type Props = {
  type: string;
  deck: string[];
  discard: string[];
};

export function ExplorationDetailsCard({ deck, discard, type }: Props) {
  return (
    <ExplorationCardDetailsModal
      deck={deck}
      discard={discard}
      deckLabel={type ? `${type} Deck` : undefined}
      discardLabel={type ? `${type} Discard` : undefined}
    />
  );
}
