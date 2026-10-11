import { Image } from "@/ds";
import InfluenceIcon from "@/shared/ui/InfluenceIcon";
import { cdnImage } from "@/entities/data/cdnImage";
import { getFactionImage } from "@/entities/lookup/factions";
import { PlanetTraitIcon } from "@/shared/ui/PlanetTraitIcon";
import { TechSkipIcon, TechType } from "@/shared/ui/TechSkipIcon";
import { PlanetActionCardsSection } from "../PlanetAbilityDetailsCard/PlanetActionCardsSection";
import { getPlanetData } from "@/entities/lookup/planets";
import { getAttachmentData } from "@/entities/lookup/attachments";
import { getAttachmentModifiers } from "@/entities/game/planets";
import { DetailsCard, type DetailsCardColor } from "@/shared/ui/DetailsCard";
import { TilePlanet } from "@/entities/game/types";
import classes from "./PlanetDetailsCard.module.css";

type Props = {
  planetId: string;
  planetTile?: TilePlanet;
};

type PlanetData = NonNullable<ReturnType<typeof getPlanetData>>;
type Trait = "cultural" | "hazardous" | "industrial";

const PLANET_TYPE_LABEL: Record<string, string> = {
  CULTURAL: "Cultural",
  HAZARDOUS: "Hazardous",
  INDUSTRIAL: "Industrial",
  FACTION: "Faction homeworld",
  MR: "Mecatol Rex",
};

const TRAIT_COLOR: Record<string, DetailsCardColor> = {
  CULTURAL: "blue",
  HAZARDOUS: "red",
  INDUSTRIAL: "green",
  MR: "gold",
};

const TRAITS = ["cultural", "hazardous", "industrial"];

function signed(value: number) {
  return `${value > 0 ? "+" : ""}${value}`;
}

function PlanetGlyph({ planet }: { planet: PlanetData }) {
  if (planet.planetType === "FACTION" && planet.factionHomeworld) {
    return <Image src={getFactionImage(planet.factionHomeworld)} alt="" />;
  }
  const trait = planet.planetType?.toLowerCase();
  if (!trait || !TRAITS.includes(trait)) return null;
  return <PlanetTraitIcon trait={trait as Trait} size={26} />;
}

function Bonus({ value }: { value: number }) {
  if (value === 0) return null;
  return <em>{signed(value)}</em>;
}

function AttachmentRow({ attachmentId }: { attachmentId: string }) {
  const data = getAttachmentData(attachmentId);
  if (!data) return null;
  const skips = data.techSpeciality?.length
    ? data.techSpeciality.join(", ").toLowerCase()
    : null;

  return (
    <div className={classes.attachment}>
      <img src={cdnImage(`/attachment_token/${data.imagePath}`)} alt="" />
      <span className={classes.attachmentName}>{data.name || attachmentId}</span>
      <span className={classes.attachmentMods}>
        {data.resourcesModifier ? (
          <span>
            <Image src="/pa_resources.png" alt="Resources" w={12} h={12} />+
            {data.resourcesModifier}
          </span>
        ) : null}
        {data.influenceModifier ? (
          <span>
            <InfluenceIcon size={12} />+{data.influenceModifier}
          </span>
        ) : null}
        {skips && <span>{skips} skip</span>}
      </span>
    </div>
  );
}

export function PlanetDetailsCard({ planetId, planetTile }: Props) {
  const planetData = getPlanetData(planetId);
  if (!planetData) return null;

  const attachments = planetTile?.attachments ?? [];
  const modifiers = getAttachmentModifiers(attachments);
  const techSpecialties = [
    ...(planetData.techSpecialties || []),
    ...modifiers.techSpecialties,
  ];
  const planetType = planetData.planetType ?? "";
  const glyph = <PlanetGlyph planet={planetData} />;

  const facts = [
    {
      key: "res",
      icon: <Image src="/pa_resources.png" alt="" w={18} h={18} />,
      value: planetData.resources,
      bonus: <Bonus value={modifiers.resources} />,
      label: planetData.resources === 1 ? "resource" : "resources",
    },
    {
      key: "inf",
      icon: <InfluenceIcon size={18} />,
      value: planetData.influence,
      bonus: <Bonus value={modifiers.influence} />,
      label: "influence",
    },
    ...(techSpecialties.length > 0
      ? [
          {
            key: "skip",
            icon: (
              <span className={classes.skips}>
                {techSpecialties.map((specialty, index) => (
                  <TechSkipIcon
                    key={`${specialty}-${index}`}
                    techType={specialty.toLowerCase() as TechType}
                    size={16}
                  />
                ))}
              </span>
            ),
            label: "skip",
          },
        ]
      : []),
  ];

  return (
    <DetailsCard width={340} color={TRAIT_COLOR[planetType] ?? "none"}>
      <DetailsCard.Title
        title={planetData.name}
        type={PLANET_TYPE_LABEL[planetType] ?? (planetType || "Planet")}
        meta={[planetTile?.controlledBy]}
        icon={<DetailsCard.Icon shape="planet" icon={glyph} />}
      />
      <DetailsCard.Facts facts={facts} />
      {planetData.legendaryAbilityText && (
        <DetailsCard.Section
          title={
            <span className={classes.legendary}>
              <Image
                src={cdnImage("/planet_cards/pc_legendary_rdy.png")}
                alt=""
                w={14}
                h={14}
              />
              {planetData.legendaryAbilityName ?? "Legendary ability"}
            </span>
          }
          content={planetData.legendaryAbilityText}
        />
      )}
      {attachments.length > 0 && (
        <DetailsCard.Section
          title="Attachments"
          content={
            <div className={classes.attachments}>
              {attachments.map((attachmentId, index) => (
                <AttachmentRow key={`${attachmentId}-${index}`} attachmentId={attachmentId} />
              ))}
            </div>
          }
        />
      )}
      <PlanetActionCardsSection actionCards={planetTile?.actionCards} />
      {planetData.flavourText && (
        <DetailsCard.Flavor quiet>
          {planetData.flavourText.replace(/^\*+|\*+$/g, "").trim()}
        </DetailsCard.Flavor>
      )}
    </DetailsCard>
  );
}
