import { cdnImage } from "@/entities/data/cdnImage";
import type { LeaderData, Unit } from "@/entities/data/types";
import { getTechData } from "@/entities/lookup/tech";
import { getUnitData } from "@/entities/lookup/units";
import { getLeaderById } from "@/entities/lookup/leaders";
import { processCardData, createCardSections } from "@/domains/cards/model/cardDataProcessor";
import { CardDetailsModal } from "@/domains/cards/components/CardDetailsModal/CardDetailsModal";
import { CardbackModal } from "@/shared/ui/CardbackModal";

export type SpliceDeckKind = "ability" | "unit" | "genome" | "paradigm";

type DeckCard = { name: string; text: string; id: string };

function unitText(unit: Unit): string {
  const dice = (count?: number) => ((count ?? 1) > 1 ? ` ×${count}` : "");
  const stats = [
    unit.cost != null ? `Cost ${unit.cost}` : null,
    unit.combatHitsOn ? `Combat ${unit.combatHitsOn}${dice(unit.combatDieCount)}` : null,
    unit.moveValue ? `Move ${unit.moveValue}` : null,
    unit.capacityValue ? `Capacity ${unit.capacityValue}` : null,
    unit.productionValue ? `Production ${unit.productionValue}` : null,
    unit.afbHitsOn ? `Anti-fighter barrage ${unit.afbHitsOn}${dice(unit.afbDieCount)}` : null,
    unit.bombardHitsOn ? `Bombardment ${unit.bombardHitsOn}${dice(unit.bombardDieCount)}` : null,
    unit.spaceCannonHitsOn
      ? `Space cannon ${unit.spaceCannonHitsOn}${dice(unit.spaceCannonDieCount)}`
      : null,
    unit.sustainDamage ? "Sustain Damage" : null,
    unit.planetaryShield ? "Planetary Shield" : null,
  ]
    .filter(Boolean)
    .join(" · ");
  return [stats, unit.ability].filter(Boolean).join("\n");
}

/** Genomes and paradigms are leader cards under their Twilight's Fall names. */
function leaderCard(leader: LeaderData | undefined): DeckCard | undefined {
  if (!leader) return undefined;
  const window = leader.tfAbilityWindow || leader.abilityWindow;
  const text = leader.tfAbilityText || leader.abilityText;
  return {
    name: leader.tfName || leader.name,
    text: [window, text].filter(Boolean).join(" "),
    id: leader.id,
  };
}

const DECKS: Record<
  SpliceDeckKind,
  { image: string; title: string; lookup: (id: string) => DeckCard | undefined }
> = {
  ability: {
    image: "/player_area/cardback_tf_ability.jpg",
    title: "Ability Splice Deck",
    lookup: (id) => {
      const tech = getTechData(id);
      return tech && { name: tech.name, text: tech.text, id: tech.alias };
    },
  },
  unit: {
    image: "/player_area/cardback_unit_upgrade.jpg",
    title: "Unit Upgrade Splice Deck",
    lookup: (id) => {
      const unit = getUnitData(id);
      return unit && { name: unit.name, text: unitText(unit), id: unit.id };
    },
  },
  genome: {
    image: "/player_area/cardback_genome.jpg",
    title: "Genome Splice Deck",
    lookup: (id) => leaderCard(getLeaderById(id)),
  },
  paradigm: {
    image: "/player_area/cardback_paradigm.jpg",
    title: "Paradigm Deck",
    lookup: (id) => leaderCard(getLeaderById(id)),
  },
};

type Props = {
  kind: SpliceDeckKind;
  deck: string[];
};

/** Board order, so each unit's upgrades sit where players expect them. */
const UNIT_TYPE_ORDER = [
  "infantry",
  "mech",
  "fighter",
  "pds",
  "spacedock",
  "destroyer",
  "cruiser",
  "carrier",
  "dreadnought",
  "flagship",
  "warsun",
];

const UNIT_TYPE_LABEL: Record<string, string> = {
  pds: "PDS",
  spacedock: "Space Dock",
  warsun: "War Sun",
};

function unitTypeLabel(baseType: string): string {
  return UNIT_TYPE_LABEL[baseType] ?? baseType.charAt(0).toUpperCase() + baseType.slice(1);
}

/** The unit upgrade deck split by the unit each card upgrades; unknown ids go last. */
function unitSections(deck: string[], lookup: (id: string) => DeckCard | undefined) {
  const byType = new Map<string, string[]>();
  for (const id of deck) {
    const type = getUnitData(id)?.baseType ?? "other";
    byType.set(type, [...(byType.get(type) ?? []), id]);
  }
  const rank = (type: string) => {
    if (type === "other") return Infinity;
    const index = UNIT_TYPE_ORDER.indexOf(type);
    return index === -1 ? UNIT_TYPE_ORDER.length : index;
  };
  return [...byType.entries()]
    .sort(([a], [b]) => rank(a) - rank(b) || a.localeCompare(b))
    .map(([type, ids]) => ({
      title: type === "other" ? "Other" : unitTypeLabel(type),
      count: ids.length,
      items: processCardData(ids, lookup, "alphanumeric"),
    }));
}

/** One of the Twilight's Fall splice decks; click it for the cards still in it. */
export function SpliceDeckCardBack({ kind, deck }: Props) {
  const { image, title, lookup } = DECKS[kind];
  const sections =
    kind === "unit"
      ? unitSections(deck, lookup)
      : createCardSections(processCardData(deck, lookup, "alphanumeric"), [], deck, []);

  return (
    <CardbackModal imageSrc={cdnImage(image)} alt={title} title={title} count={deck.length}>
      <CardDetailsModal sections={sections} showCounts={false} tone="var(--ds-sig-ability)" />
    </CardbackModal>
  );
}
