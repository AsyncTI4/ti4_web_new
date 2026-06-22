import { getRelicData } from "@/entities/lookup/relics";
import { RelicCard } from "./RelicCard";
import styles from "./Relic.module.css";
import { ChipWithPopover } from "@/shared/ui/primitives/ChipWithPopover";
import { cdnImage } from "@/entities/data/cdnImage";
import cx from "clsx";

type Props = {
  relicId: string;
  isExhausted?: boolean;
};

export function Relic({ relicId, isExhausted = false }: Props) {
  const relicData = getRelicData(relicId);

  if (!relicData) {
    console.warn(`Relic with ID "${relicId}" not found`);
    return null;
  }

  const isFake = relicData.isFakeRelic ?? false;
  const accentColor = isFake ? "grey" : isExhausted ? "bloodOrange" : "yellow";

  return (
    <ChipWithPopover
      className={cx(
        styles.relicCard,
        isFake && styles.fake,
        isExhausted && styles.exhausted,
      )}
      accent={accentColor}
      leftIconSrc={
        isFake ? cdnImage("/tokens/token_frontier.webp") : "/relicicon.webp"
      }
      leftIconSize={18}
      leftIconClassName={cx(
        styles.icon,
        !isFake && styles.relicIconShadow,
        isExhausted && styles.exhaustedIcon,
        isExhausted && styles.exhaustedIconX,
      )}
      title={relicData.shortName || relicData.name}
      dropdownContent={<RelicCard relicId={relicId} />}
    />
  );
}
