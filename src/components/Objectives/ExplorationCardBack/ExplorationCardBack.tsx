import { cdnImage } from "@/data/cdnImage";
import { ExplorationDeckDetailsCard } from "../ExplorationDeckDetailsCard";
import { CardbackPopover } from "@/components/shared/CardbackPopover";
import styles from "./ExplorationCardBack.module.css";

type Props = {
  type: string;
  deck: string[];
  discard: string[];
};

export function ExplorationCardBack({ type, deck, discard }: Props) {
  return (
    <CardbackPopover
      cardKey={type}
      imageSrc={cdnImage(`/player_area/cardback_${type.toLowerCase()}.jpg`)}
      alt={`${type} explore`}
      count={deck?.length ?? 0}
      cardClassName={styles.card}
      dropdownClassName={styles.popoverDropdown}
      dropdown={
        <ExplorationDeckDetailsCard type={type} deck={deck} discard={discard} />
      }
    />
  );
}
