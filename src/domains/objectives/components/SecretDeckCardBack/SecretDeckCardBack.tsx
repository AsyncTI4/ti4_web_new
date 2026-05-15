import { cdnImage } from "@/entities/data/cdnImage";
import { SecretDeckDetailsCard } from "@/domains/player/components/SecretDeckDetailsCard";
import { PlayerData } from "@/entities/data/types";
import { CardbackModal } from "@/shared/ui/CardbackModal";
import styles from "./SecretDeckCardBack.module.css";

type Props = {
  deck: string[];
  discard: string[];
  playerData: PlayerData[];
};

export function SecretDeckCardBack({ deck, discard, playerData }: Props) {
  return (
    <CardbackModal
      imageSrc={cdnImage("/player_area/cardback_secret.jpg")}
      alt="secret objectives"
      title="Not Scored Secrets"
      count={deck?.length ?? 0}
      cardClassName={styles.card}
    >
      <SecretDeckDetailsCard
        deck={deck}
        discard={discard}
        playerData={playerData}
      />
    </CardbackModal>
  );
}
