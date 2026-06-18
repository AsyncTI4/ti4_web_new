import styles from "./UnitCard.module.css";
import { BaseCard } from "./BaseCard";
import { DenseUnitCell } from "./DenseUnitCell";
import { Unit } from "@/shared/ui/Unit";
import { getColorAlias } from "@/entities/lookup/colors";

type Props = {
  asyncId: string;
  color?: string;
  compact?: boolean;
  condensed?: boolean;
  lockedLabel?: string;
};

export function UnitCardUnavailable({
  asyncId,
  color,
  compact,
  condensed,
}: Props) {
  const colorAlias = getColorAlias(color);

  if (condensed) {
    return (
      <DenseUnitCell
        image={
          <Unit
            unitType={asyncId}
            colorAlias={colorAlias}
            className={styles.denseUnitImage}
            scaleSprite
          />
        }
        dimmed
      />
    );
  }

  return (
    <div style={{ minWidth: "50px" }}>
      <BaseCard compact={compact} locked enableAnimations={false}>
        <Unit
          unitType={asyncId}
          colorAlias={colorAlias}
          className={compact ? styles.unitImageCompact : styles.unitImage}
          scaleSprite
        />
      </BaseCard>
    </div>
  );
}
