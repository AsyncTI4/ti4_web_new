import { Ability } from "./Ability";
import { Tech } from "./Tech";
import { Breakthrough } from "./Breakthrough/Breakthrough";
import { PromissoryNote } from "./PromissoryNote";
import { getBreakthroughSynergy } from "./Tech/TechGridShared";
import type { BreakthroughData } from "@/entities/data/types";
import rail from "./PlayerCardHeader/HeaderRail.module.css";

type Props = {
  abilities?: string[];
  notResearchedFactionTechs?: string[];
  customPromissoryNotes?: string[];
  breakthrough?: BreakthroughData;
  showFactionAbilities?: boolean;
  showBreakthrough?: boolean;
  /**
   * Container class for each chip group. Defaults to the header rail's seam
   * grammar; the expanded card passes its own bay class so the same groups can
   * seat into a lattice instead of a one-line rail.
   */
  groupClassName?: string;
  /**
   * When set, each bay opens with its name in this class. The band's rail
   * stays unlabelled — position identifies its compartments — but the card's
   * lattice reflows with width, so the bays carry their own names.
   */
  groupLabelClassName?: string;
};

/*
 * Renders straight into the header rail — no wrapper of its own, so abilities,
 * promissory notes and faction techs are siblings of the breakthrough and
 * neighbour groups and get divided by the same hairline seam. The spacing lives
 * in HeaderRail.module.css; nothing here sets its own.
 */
export function PlayerCardAbilitiesFactionTechsMobile({
  abilities = [],
  notResearchedFactionTechs = [],
  customPromissoryNotes = [],
  breakthrough,
  showFactionAbilities = true,
  showBreakthrough = true,
  groupClassName,
  groupLabelClassName,
}: Props) {
  const { synergy, breakthroughUnlocked } = getBreakthroughSynergy(breakthrough);
  const groupClass = groupClassName ?? rail.railGroup;
  const bayLabel = (label: string) =>
    groupLabelClassName ? (
      <span className={groupLabelClassName}>{label}</span>
    ) : null;

  return (
    <>
      {showBreakthrough && breakthrough?.breakthroughId && (
        <div className={groupClass}>
          {bayLabel("Breakthrough")}
          <Breakthrough
            breakthroughId={breakthrough.breakthroughId}
            exhausted={breakthrough.exhausted}
            tradeGoodsStored={breakthrough.tradeGoodsStored}
            unlocked={breakthrough.unlocked ?? false}
            strong={false}
          />
        </div>
      )}
      {showFactionAbilities && notResearchedFactionTechs.length > 0 && (
        <div className={groupClass}>
          {bayLabel("Faction Techs")}
          {notResearchedFactionTechs.map((techId) => (
            <Tech
              techId={techId}
              key={techId}
              synergy={synergy}
              breakthroughUnlocked={breakthroughUnlocked}
            />
          ))}
        </div>
      )}
      {showFactionAbilities && customPromissoryNotes.length > 0 && (
        <div className={groupClass}>
          {bayLabel("Promissory Notes")}
          {customPromissoryNotes.map((pnId) => (
            <PromissoryNote promissoryNoteId={pnId} key={pnId} />
          ))}
        </div>
      )}
      {showFactionAbilities && abilities.length > 0 && (
        <div className={groupClass}>
          {bayLabel("Abilities")}
          {abilities.map((abilityId, index) => (
            <Ability id={abilityId} key={index} strong={false} />
          ))}
        </div>
      )}
    </>
  );
}
