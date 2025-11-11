import styles from "./UnitCard.module.css";
import { BaseCard } from "./BaseCard";
import { Unit } from "@/components/shared/Unit";
import { getColorAlias } from "@/lookup/colors";

type Props = {
  asyncId: string;
  color?: string;
  compact?: boolean;
  lockedLabel?: string;
};

export function UnitCardUnavailable({ asyncId, color, compact }: Props) {
  const colorAlias = getColorAlias(color);
  return (
    <div style={{ minWidth: "50px" }}>
      <BaseCard compact={compact} locked enableAnimations={false}>
        <Unit
          unitType={asyncId}
          colorAlias={colorAlias}
          className={compact ? styles.unitImageCompact : styles.unitImage}
        />
      </BaseCard>
    </div>
  );
}
