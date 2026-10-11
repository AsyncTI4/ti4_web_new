import type { CSSProperties } from "react";
import { DetailsCard } from "@/shared/ui/DetailsCard";
import { FactionIcon } from "@/shared/ui/FactionIcon";
import { getBreakthroughData } from "@/entities/lookup/breakthroughs";

type Props = {
  breakthroughId: string;
};

const SYNERGY_SIGNAL: Record<string, string> = {
  PROPULSION: "var(--ds-sig-prop)",
  BIOTIC: "var(--ds-sig-bio)",
  CYBERNETIC: "var(--ds-sig-cyber)",
  WARFARE: "var(--ds-sig-war)",
};

const SYNERGY_LABEL: Record<string, string> = {
  PROPULSION: "Propulsion",
  BIOTIC: "Biotic",
  CYBERNETIC: "Cybernetic",
  WARFARE: "Warfare",
};

function synergyStyle(synergy: string[] | undefined) {
  const [first, second] = synergy ?? [];
  const s1 = SYNERGY_SIGNAL[first ?? ""];
  if (!s1) return undefined;
  return { "--s1": s1, "--s2": SYNERGY_SIGNAL[second ?? ""] ?? s1 } as CSSProperties;
}

export function BreakthroughCard({ breakthroughId }: Props) {
  const data = getBreakthroughData(breakthroughId);
  if (!data) return null;

  const synergyTypes = (data.synergy ?? []).filter((type) => SYNERGY_LABEL[type]);
  const synergy = synergyTypes.length
    ? synergyTypes.map((type) => SYNERGY_LABEL[type]).join(" + ")
    : null;

  return (
    <DetailsCard width={340} color="teal">
      <DetailsCard.Title
        title={data.name}
        type="Breakthrough"
        meta={[synergy]}
        icon={
          <DetailsCard.Icon
            shape="capsule"
            style={synergyStyle(data.synergy)}
            icon={
              data.faction ? (
                <FactionIcon faction={data.faction} w={18} h={18} />
              ) : null
            }
          />
        }
      />
      <DetailsCard.Section
        title="Effect"
        content={data.text?.replace(/\n/g, "\n\n") || "No description available."}
      />
    </DetailsCard>
  );
}
