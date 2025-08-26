import classes from "./DebtTokens.module.css";
import { SmallControlToken } from "../../Map/ControlToken";
import { getColorAlias } from "../../../lookup/colors";
import { useFactionColors } from "@/hooks/useFactionColors";
import { getGradientClasses } from "../gradientClasses";

type Props = {
  debts: Record<string, number>;
};
export function DebtTokens({ debts }: Props) {
  const debtEntries = Object.entries(debts).filter(([, amount]) => amount > 0);
  if (debtEntries.length === 0) return null;
  const factionColorMap = useFactionColors();
  const gradientClasses = getGradientClasses("orange");

  return (
    <div
      className={`${classes.container} ${gradientClasses.playerAreaCard} ${gradientClasses.backgroundStrong} ${gradientClasses.shadow}`}
    >
      {debtEntries.map(([colorName, amount]) => {
        const factionName = factionColorMap?.[colorName]?.faction;
        const colorAlias = getColorAlias(colorName);
        return (
          <div key={colorName} className={classes.row}>
            <SmallControlToken colorAlias={colorAlias} faction={factionName} />
            <span className={classes.amount}>x{amount}</span>
          </div>
        );
      })}
    </div>
  );
}
