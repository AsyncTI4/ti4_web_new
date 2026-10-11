import { Image } from "@/ds";
import { cdnImage } from "@/entities/data/cdnImage";
import { getPlanetData } from "@/entities/lookup/planets";
import { DetailsCard } from "@/shared/ui/DetailsCard";
import { PlanetActionCardsSection } from "./PlanetActionCardsSection";

type Props = {
  planetId: string;
  abilityName: string;
  abilityText: string;
  actionCards?: string[];
};

export function PlanetAbilityDetailsCard({
  planetId,
  abilityName,
  abilityText,
  actionCards,
}: Props) {
  const planetData = getPlanetData(planetId);

  if (!planetData) return null;

  return (
    <DetailsCard width={340} color="gold">
      <DetailsCard.Title
        title={abilityName}
        type="Planet ability"
        meta={[planetData.shortName ?? planetData.name]}
        icon={
          <DetailsCard.Icon
            shape="round"
            icon={
              <Image
                src={cdnImage("/planet_cards/pc_legendary_rdy.png")}
                alt=""
              />
            }
          />
        }
      />
      <DetailsCard.Section title="Ability" content={abilityText} />
      <PlanetActionCardsSection actionCards={actionCards} />
    </DetailsCard>
  );
}
