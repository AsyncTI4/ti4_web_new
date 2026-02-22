import { Group, Text } from "@mantine/core";
import { SmallControlToken } from "@/domains/map/components/Map/ControlToken";
import { getColorAlias } from "@/entities/lookup/colors";
import { useFactionColors } from "@/hooks/useFactionColors";
import { Panel } from "@/shared/ui/primitives/Panel";
import classes from "./DebtTokens.module.css";

type Props = {
  debts: Record<string, number>;
};

export function DebtTokens({ debts }: Props) {
  const debtEntries = Object.entries(debts).filter(([, amount]) => amount > 0);
  if (debtEntries.length === 0) return null;

  const factionColorMap = useFactionColors();

  return (
    <Panel accent="orange" className={classes.container}>
      <Group gap={8}>
        {debtEntries.map(([colorName, amount]) => {
          const factionName = factionColorMap?.[colorName]?.faction;
          const colorAlias = getColorAlias(colorName);
          return (
            <Group key={colorName} gap={2} className={classes.row}>
              <SmallControlToken colorAlias={colorAlias} faction={factionName} />
              <Text className={classes.amount}>×{amount}</Text>
            </Group>
          );
        })}
      </Group>
    </Panel>
  );
}
