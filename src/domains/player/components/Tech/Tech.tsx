import type { CSSProperties } from "react";
import { TECH_COLOR_IMAGES, UNIT_UPGRADE_IMAGE } from "@/entities/data/uiImages";
import styles from "./Tech.module.css";
import { searchKey } from "@/domains/search/searchKeys";
import { getFactionImage } from "@/entities/lookup/factions";
import { TechCard } from "@/domains/cards/components/TechCard/TechCard";
import { SmoothPopover } from "@/shared/ui/SmoothPopover";
import { useDisclosure } from "@/hooks/useDisclosure";
import {
  getTechData,
  getTechLetter,
  getTechTier,
  TECH_TYPE_COLOR,
  type TechColor,
} from "@/entities/lookup/tech";
import {
  ObjectGlyph,
  ObjectLabel,
  ObjectShell,
} from "@/domains/player/components/silhouettes/ObjectShell";

type Props = {
  techId: string;
  isExhausted?: boolean;
  synergy?: string[];
  breakthroughUnlocked?: boolean;
  /** A faction tech the player has not researched yet. */
  unresearched?: boolean;
};

const getTechColor = (techType: string): TechColor | "gray" =>
  TECH_TYPE_COLOR[techType] ?? "gray";

/**
 * The second accent colour for a breakthrough synergy: when the player's
 * breakthrough is unlocked and links this tech's colour to another, the edge
 * splits between the two.
 */
function getSynergyPartner(
  synergy: string[] | undefined,
  techColor: string,
): TechColor | undefined {
  if (!synergy) return undefined;
  const colors = synergy
    .map((s) => TECH_TYPE_COLOR[s])
    .filter((c): c is TechColor => Boolean(c));
  if (!colors.includes(techColor as TechColor)) return undefined;
  return colors.find((c) => c !== techColor);
}

function getTechIconSrc(
  faction: string | undefined,
  techType: string,
  color: TechColor | "gray",
  techLetter: string | undefined,
): string | undefined {
  if (faction) return getFactionImage(faction);
  if (techLetter) return undefined;
  if (techType === "UNITUPGRADE") return UNIT_UPGRADE_IMAGE;
  if (color === "gray") return undefined;
  return TECH_COLOR_IMAGES[color];
}

/** Circuit module: accent edge, trace into the glyph, chamfer wedge, tier pips. */
export function Tech({
  techId,
  isExhausted = false,
  synergy,
  breakthroughUnlocked = false,
  unresearched = false,
}: Props) {
  const { opened, setOpened, toggle } = useDisclosure(false);
  const techData = getTechData(techId);

  if (!techData) return null;

  const color = getTechColor(techData.types[0]);
  const tier = getTechTier(techData.requirements);
  const isFactionTech = !!techData.faction;
  const partner = breakthroughUnlocked
    ? getSynergyPartner(synergy, color)
    : undefined;
  const techLetter = getTechLetter(techData.name);
  const iconSrc = getTechIconSrc(techData.faction, techData.types[0], color, techLetter);
  const state = unresearched ? "locked" : isExhausted ? "exhausted" : undefined;
  const style = {
    "--k": `var(--gd-${color})`,
    ...(partner ? { "--k2": `var(--gd-${partner})` } : {}),
  } as CSSProperties;

  return (
    <SmoothPopover opened={opened} onChange={setOpened}>
      <SmoothPopover.Target>
        <ObjectShell
          className={styles.tech}
          state={state}
          label={unresearched ? `${techData.name} (not researched)` : techData.name}
          onClick={toggle}
          style={style}
          searchKey={searchKey("tech", techId)}
        >
          {techLetter && !iconSrc ? (
            <span className={styles.letter} aria-hidden="true">
              {techLetter}
            </span>
          ) : (
            <ObjectGlyph src={iconSrc} size={isFactionTech ? 16 : 15} />
          )}
          <ObjectLabel>{techData.name}</ObjectLabel>
          {tier > 0 && (
            <span className={styles.pips} aria-hidden="true">
              {Array.from({ length: tier }, (_, i) => (
                <i key={i} />
              ))}
            </span>
          )}
        </ObjectShell>
      </SmoothPopover.Target>
      <SmoothPopover.Dropdown p={0}>
        <TechCard techId={techId} />
      </SmoothPopover.Dropdown>
    </SmoothPopover>
  );
}
