import { cdnImage } from "@/entities/data/cdnImage";
import { RelicDeckDetailsCard } from "@/domains/player/components/RelicDeckDetailsCard";
import { CardbackPopover } from "@/shared/ui/CardbackPopover";
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
