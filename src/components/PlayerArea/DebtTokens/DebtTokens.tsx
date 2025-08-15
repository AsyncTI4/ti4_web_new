import { Box, Group, Text } from "@mantine/core";
import { SmallControlToken } from "../../Map/ControlToken";
import { getColorAlias } from "../../../lookup/colors";
import styles from "./DebtTokens.module.css";
import { useFactionColors } from "@/hooks/useFactionColors";

type Props = {
  debts: Record<string, number>;
};

export function DebtTokens({ debts }: Props) {
  const debtEntries = Object.entries(debts).filter(([, amount]) => amount > 0);
  if (debtEntries.length === 0) return null;
  const factionColorMap = useFactionColors();

  return (
    <Box className={styles.container}>
      <Text size="xs" fw={600} c="orange.4" className={styles.debtLabel}>
        Debt
      </Text>

      <div className={styles.tokensContainer}>
        {debtEntries.map(([colorName, amount]) => {
          const factionName = factionColorMap?.[colorName]?.faction;
          const colorAlias = getColorAlias(colorName);
          return (
            <Group
              key={colorName}
              pos="relative"
              style={{ height: 24, width: amount * 10 }}
            >
              {Array(amount)
                .fill(null)
                .map((_, index) => (
                  <Box
                    key={`${colorName}-${index}`}
                    className={styles.tokenWrapper}
                    style={{
                      left: index * 10,
                      position: "absolute",
                    }}
                  >
                    <SmallControlToken
                      colorAlias={colorAlias}
                      faction={factionName}
                    />
                  </Box>
                ))}
            </Group>
          );
        })}
      </div>
    </Box>
  );
}
