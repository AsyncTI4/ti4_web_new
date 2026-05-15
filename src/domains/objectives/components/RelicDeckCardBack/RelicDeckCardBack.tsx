import { cdnImage } from "@/entities/data/cdnImage";
import { RelicDeckDetailsCard } from "@/domains/player/components/RelicDeckDetailsCard";
import { CardbackModal } from "@/shared/ui/CardbackModal";
import styles from "./RelicDeckCardBack.module.css";

type Props = {
  deck: string[];
  discard: string[];
};

export function RelicDeckCardBack({ deck, discard }: Props) {
  return (
    <CardbackModal
      imageSrc={cdnImage("/player_area/cardback_relic.jpg")}
      alt="relics"
      title="Relics"
      count={deck?.length ?? 0}
      cardClassName={styles.card}
    >
      <RelicDeckDetailsCard deck={deck} discard={discard} />
    </CardbackModal>
  );
}
