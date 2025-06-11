import { Box, Group, Text } from "@mantine/core";
import { SmallControlToken } from "../../Map/ControlToken";
import { getColorAlias } from "../../../lookup/colors";
import styles from "./DebtTokens.module.css";

type Props = {
  debts: Record<string, number>;
  colorToFaction?: Record<string, string>;
  factionToColor?: Record<string, string>;
};

export function DebtTokens({ debts, colorToFaction }: Props) {
  const debtEntries = Object.entries(debts).filter(([, amount]) => amount > 0);
  if (debtEntries.length === 0) return null;

  return (
    <Box className={styles.container}>
      <Text size="xs" fw={600} c="orange.4" className={styles.debtLabel}>
        Debt
      </Text>

      <div className={styles.tokensContainer}>
        {debtEntries.map(([colorName, amount]) => {
          // Convert color to faction name and get color alias
          const factionName = colorToFaction?.[colorName];
          const colorAlias = getColorAlias(colorName);

          return (
            <Group
              key={colorName}
              pos="relative"
              style={{ height: 24, width: amount * 10 }}
            >
              {/* Stack tokens for this faction */}
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
