import styles from "./StasisInfantryCard.module.css";
import { Unit } from "@/shared/ui/Unit";
import { getColorAlias } from "@/entities/lookup/colors";
import { BaseCard } from "../UnitCard/BaseCard";
import { DenseUnitCell } from "../UnitCard/DenseUnitCell";

type Props = {
  reviveCount: number;
  color?: string;
  condensed?: boolean;
};

export function StasisInfantryCard({ reviveCount, color, condensed }: Props) {
  const colorAlias = getColorAlias(color);

  if (reviveCount <= 0) return null;

  const image = (
    <Unit
      unitType="gf"
      colorAlias={colorAlias}
      className={condensed ? styles.denseUnitImage : styles.unitImage}
      scaleSprite
    />
  );

  if (condensed) {
    return (
      <DenseUnitCell image={image} reinforcements={reviveCount} label="revive" />
    );
  }

  return (
    <div style={{ minWidth: "44px" }}>
      <BaseCard reinforcements={reviveCount} label="revive" enableAnimations={false}>
        {image}
      </BaseCard>
    </div>
  );
}
