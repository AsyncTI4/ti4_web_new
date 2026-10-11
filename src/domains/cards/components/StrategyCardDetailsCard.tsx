import { DetailsCard, type DetailsCardColor } from "@/shared/ui/DetailsCard";
import { SC_COLORS } from "@/entities/data/strategyCardColors";
import { getStrategyCardByInitiative } from "@/entities/lookup/strategyCards";
import { useGameData } from "@/state/useGameContext";
import styles from "./cardText.module.css";

type Props = {
  initiative: number;
  color?:
    | "red"
    | "orange"
    | "yellow"
    | "green"
    | "teal"
    | "cyan"
    | "blue"
    | "purple";
  /** Fill the container instead of the fixed popover width. */
  fluid?: boolean;
};

function AbilityLines({ lines, emptyText }: { lines: string[]; emptyText: string }) {
  if (lines.length === 0) {
    return <p className={styles.empty}>{emptyText}</p>;
  }

  return (
    <div className={styles.lines}>
      {lines.map((line, idx) => (
        <p key={idx}>{line}</p>
      ))}
    </div>
  );
}

export function StrategyCardDetailsCard({ initiative, color, fluid }: Props) {
  const gameData = useGameData();
  const sc = getStrategyCardByInitiative(
    initiative,
    gameData?.strategyCardIdMap
  );
  if (!sc) return null;

  const accent = (color ?? SC_COLORS[initiative] ?? "none") as DetailsCardColor;

  return (
    <DetailsCard width={fluid ? undefined : 340} color={accent}>
      <DetailsCard.Title
        title={sc.name}
        type="Strategy card"
        meta={[`Initiative ${sc.initiative}`]}
        icon={<DetailsCard.Icon shape="sc" icon={sc.initiative} />}
      />
      <DetailsCard.Section
        title="Primary"
        content={
          <AbilityLines lines={sc.primaryTexts} emptyText="No primary ability" />
        }
      />
      <DetailsCard.Section
        title="Secondary"
        content={
          <AbilityLines
            lines={sc.secondaryTexts}
            emptyText="No secondary ability"
          />
        }
      />
    </DetailsCard>
  );
}
