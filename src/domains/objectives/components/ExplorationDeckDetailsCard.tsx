import { ExplorationCardDetailsModal } from "./ExplorationCardDetailsModal";

type Props = {
  type: string;
  deck: string[];
  discard: string[];
};

export function ExplorationDeckDetailsCard({ deck, discard }: Props) {
  return (
    <ExplorationCardDetailsModal deck={deck} discard={discard} />
  );
}
