import { Image } from "@mantine/core";
import styles from "./UnitCard.module.css";
import { cdnImage } from "@/entities/data/cdnImage";
import { BaseCard } from "./BaseCard";
import { DenseUnitCell } from "./DenseUnitCell";
import { getColorAlias } from "@/entities/lookup/colors";
import { useFactionTokenImage } from "@/hooks/useFactionTokenImage";
import { lowPriorityImageProps } from "@/shared/ui/imageLoading";

type Props = {
  color?: string;
  faction?: string;
  reinforcements: number;
  totalCapacity: number;
  compact?: boolean;
  condensed?: boolean;
};

export function CommandTokenCard({
  color,
  faction,
  reinforcements,
  totalCapacity,
  compact,
  condensed,
}: Props) {
  const colorAlias = getColorAlias(color);
  const factionUrl = useFactionTokenImage(faction);

  if (condensed) {
    return (
      <DenseUnitCell
        image={
          <div className={styles.denseCommandTokenImage}>
            <Image
              {...lowPriorityImageProps}
              src={cdnImage(`/command_token/command_${colorAlias}.png`)}
              alt={`${faction || "command"} command token`}
            />
            {faction && (
              <Image
                {...lowPriorityImageProps}
                src={factionUrl}
                alt={`${faction} faction`}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -40%)",
                  height: "12px",
                  width: "12px",
                  zIndex: 1,
                }}
              />
            )}
          </div>
        }
        reinforcements={reinforcements}
        totalCapacity={totalCapacity}
      />
    );
  }

  return (
    <div>
      <BaseCard
        isUpgraded={false}
        isFaction={false}
        compact={compact}
        reinforcements={reinforcements}
        totalCapacity={totalCapacity}
        enableAnimations={false}
      >
        <div style={{ position: "relative" }}>
          <Image
            {...lowPriorityImageProps}
            src={cdnImage(`/command_token/command_${colorAlias}.png`)}
            alt={`${faction || "command"} command token`}
            className={compact ? styles.unitImageCompact : styles.unitImage}
          />
          {faction && (
            <Image
              {...lowPriorityImageProps}
              src={factionUrl}
              alt={`${faction} faction`}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -30%)",
                height: "16px",
                width: "16px",
                zIndex: 1,
              }}
            />
          )}
        </div>
      </BaseCard>
    </div>
  );
}
