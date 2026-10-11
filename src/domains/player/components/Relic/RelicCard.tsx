import { Image } from "@/ds";
import { getRelicData } from "@/entities/lookup/relics";
import { DetailsCard } from "@/shared/ui/DetailsCard";
import { cdnImage } from "@/entities/data/cdnImage";

type Props = {
  relicId: string;
};

export function RelicCard({ relicId }: Props) {
  const relicData = getRelicData(relicId);

  if (!relicData) return null;

  const isFake = relicData.isFakeRelic ?? false;
  const iconSrc = isFake ? cdnImage("/tokens/token_frontier.webp") : "/relicicon.webp";

  return (
    <DetailsCard width={320} color={isFake ? "none" : "gold"}>
      <DetailsCard.Title
        title={relicData.name}
        subtitle={isFake ? "Frontier Explore" : "Relic"}
        icon={
          <DetailsCard.Icon
            shape="relic"
            icon={<Image src={iconSrc} w={30} h={30} />}
          />
        }
      />
      <DetailsCard.Section
        title="Effect"
        content={relicData.text?.replace(/\n/g, "\n\n") || "No description available."}
      />
      {relicData.flavourText && (
        <DetailsCard.Flavor quiet={isFake}>{relicData.flavourText}</DetailsCard.Flavor>
      )}
    </DetailsCard>
  );
}
