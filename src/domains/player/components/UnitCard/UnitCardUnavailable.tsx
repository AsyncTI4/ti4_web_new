import styles from "./UnitCard.module.css";
import { BaseCard } from "./BaseCard";
import { DenseUnitCell } from "./DenseUnitCell";
import { Unit } from "@/shared/ui/Unit";
import { getColorAlias } from "@/entities/lookup/colors";

type Props = {
  asyncId: string;
  color?: string;
  condensed?: boolean;
};

export function UnitCardUnavailable({
  asyncId,
  color,
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
      <BaseCard locked enableAnimations={false}>
        <Unit
          unitType={asyncId}
          colorAlias={colorAlias}
          className={styles.unitImage}
          scaleSprite
        />
      </BaseCard>
    </div>
  );
}
