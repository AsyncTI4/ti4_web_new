import { Image } from "@/ds";
import { DetailsCard } from "@/shared/ui/DetailsCard";
import { FactionIcon } from "@/shared/ui/FactionIcon";
import styles from "./TechCard.module.css";
import {
  getTechData,
  getTechLetter,
  TECH_PREREQ_ICON,
  TECH_TYPE_COLOR,
} from "@/entities/lookup/tech";
import { getGenericUnitDataByRequiredTechId } from "@/entities/lookup/units";
import { getColorAlias } from "@/entities/lookup/colors";
import { cdnImage } from "@/entities/data/cdnImage";

type Props = {
  techId: string;
};

const TECH_TYPE_LABEL: Record<string, string> = {
  PROPULSION: "Propulsion",
  BIOTIC: "Biotic",
  WARFARE: "Warfare",
  CYBERNETIC: "Cybernetic",
  UNITUPGRADE: "Unit upgrade",
  NONE: "Special",
  GENERICTF: "Special",
};

type TechData = NonNullable<ReturnType<typeof getTechData>>;

function unitUpgradeImage(techId: string, techData: TechData) {
  if (!techData.types.includes("UNITUPGRADE")) return undefined;
  const unitData = getGenericUnitDataByRequiredTechId(
    techData.baseUpgrade || techId
  );
  if (!unitData?.asyncId) return undefined;
  const src = cdnImage(`/units/${getColorAlias(undefined)}_${unitData.asyncId}.png`);
  return <Image src={src} alt="" />;
}

function TileGlyph({ techId, techData }: { techId: string; techData: TechData }) {
  const unitImage = unitUpgradeImage(techId, techData);
  if (unitImage) return unitImage;

  const letter = getTechLetter(techData.name);
  if (letter) return <span className={styles.letter}>{letter}</span>;

  const color = TECH_TYPE_COLOR[techData.types[0]];
  if (color) return <Image src={`/${color}.png`} alt="" />;
  return null;
}

function Prerequisites({ requirements }: { requirements?: string }) {
  const icons = (requirements ?? "")
    .split("")
    .map((c) => TECH_PREREQ_ICON[c])
    .filter((src): src is string => Boolean(src));

  if (icons.length === 0) return <>No prerequisites</>;

  return (
    <span className={styles.prereqs} aria-label={`Prerequisites ${requirements}`}>
      {icons.map((src, i) => (
        <img key={`${src}-${i}`} src={src} alt="" />
      ))}
    </span>
  );
}

export function TechCard({ techId }: Props) {
  const techData = getTechData(techId);

  if (!techData) return null;

  const techType = techData.types[0];
  const color = TECH_TYPE_COLOR[techType];

  return (
    <DetailsCard width={340} color={color ?? "none"}>
      <DetailsCard.Title
        title={techData.name}
        type={TECH_TYPE_LABEL[techType] ?? techType}
        meta={[
          techData.faction ? "Faction tech" : null,
          <Prerequisites key="prereqs" requirements={techData.requirements} />,
        ]}
        icon={
          <DetailsCard.Icon
            shape="tech"
            icon={<TileGlyph techId={techId} techData={techData} />}
          />
        }
        aside={
          techData.faction ? (
            <FactionIcon faction={techData.faction} w={22} h={22} />
          ) : undefined
        }
      />
      <DetailsCard.Section
        content={
          techData.text?.replace(/\n/g, "\n\n") || "No description available."
        }
      />
    </DetailsCard>
  );
}
