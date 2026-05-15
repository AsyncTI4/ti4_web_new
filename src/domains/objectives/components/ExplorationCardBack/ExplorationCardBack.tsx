import { cdnImage } from "@/entities/data/cdnImage";
import { ExplorationDeckDetailsCard } from "../ExplorationDeckDetailsCard";
import { CardbackModal } from "@/shared/ui/CardbackModal";
import styles from "./ExplorationCardBack.module.css";

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
      title={`${type} Exploration`}
      count={deck?.length ?? 0}
      cardClassName={styles.card}
    >
      <ExplorationDeckDetailsCard type={type} deck={deck} discard={discard} />
    </CardbackModal>
  );
}
