import type { SecretSection } from "@/domains/cards/model/secretObjectiveProcessor";
import { DeckEntry, DeckGroup, DeckList } from "../CardDetailsModal/CardDetailsModal";

type Props = {
  sections: SecretSection[];
};

/** Secrets file by the phase they score in; each phase keeps its signal colour. */
const PHASE_TONE: Record<SecretSection["phaseColor"], string> = {
  red: "var(--ds-sig-secret)",
  blue: "var(--ds-sig-stage2)",
  orange: "var(--ds-sig-stage1)",
};

export function SecretModal({ sections }: Props) {
  const visibleSections = sections.filter((section) => section.items.length > 0);

  return (
    <DeckList>
      {visibleSections.map((section) => (
        <DeckGroup
          key={section.title}
          title={section.title}
          count={section.count}
          tone={PHASE_TONE[section.phaseColor]}
        >
          {section.items.map((item) => (
            <DeckEntry
              key={item.name}
              name={item.name}
              count={item.count}
              text={item.text}
              percentage={item.percentage}
              showCount
            />
          ))}
        </DeckGroup>
      ))}
    </DeckList>
  );
}
