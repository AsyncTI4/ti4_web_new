import { cdnImage } from "@/data/cdnImage";
import { RelicDeckDetailsCard } from "../../PlayerArea/RelicDeckDetailsCard";
import { CardbackPopover } from "@/components/shared/CardbackPopover";
import styles from "./RelicDeckCardBack.module.css";

type Props = {
  deck: string[];
  discard: string[];
};

export function RelicDeckCardBack({ deck, discard }: Props) {
  return (
    <CardbackPopover
      imageSrc={cdnImage("/player_area/cardback_relic.jpg")}
      alt="relics"
      count={deck?.length ?? 0}
      cardClassName={styles.card}
      dropdownClassName={styles.popoverDropdown}
      dropdown={<RelicDeckDetailsCard deck={deck} discard={discard} />}
    />
  );
}
