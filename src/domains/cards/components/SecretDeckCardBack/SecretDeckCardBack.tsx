import { cdnImage } from "@/entities/data/cdnImage";
import { SecretDeckDetailsCard } from "@/domains/cards/components/SecretDeckDetailsCard";
import { CardbackModal } from "@/shared/ui/CardbackModal";

type Props = {
  deck: string[];
  discard: string[];
};

export function SecretDeckCardBack({ deck, discard }: Props) {
  return (
    <CardbackModal
      imageSrc={cdnImage("/player_area/cardback_secret.jpg")}
      alt="secret objectives"
      title="Not Scored Secrets"
      count={deck.length}
    >
      <SecretDeckDetailsCard deck={deck} discard={discard} />
    </CardbackModal>
  );
}
