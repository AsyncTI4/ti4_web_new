import { Box, Group, Text } from "@mantine/core";
import { SmallControlToken } from "../../Map/ControlToken";
import { getColorAlias } from "../../../lookup/colors";
import styles from "./DebtTokens.module.css";
import { useMemo } from "react";
import { useFactionColors } from "@/hooks/useFactionColors";

type Props = {
  debts: Record<string, number>;
};

export function DebtTokens({ debts }: Props) {
  const debtEntries = Object.entries(debts).filter(([, amount]) => amount > 0);
  if (debtEntries.length === 0) return null;

  const factionColorMap = useFactionColors();
  const colorToFaction = useMemo(() => {
    const map: Record<string, string> = {};
    Object.values(factionColorMap).forEach((entry) => {
      if (entry && entry.color && entry.faction) {
        map[entry.color] = entry.faction;
      }
    });
    return map;
  }, [factionColorMap]);

  return (
    <Box className={styles.container}>
      <Text size="xs" fw={600} c="orange.4" className={styles.debtLabel}>
        Debt
      </Text>

      <div className={styles.tokensContainer}>
        {debtEntries.map(([colorName, amount]) => {
          // Convert color to faction name and get color alias
          const factionName = colorToFaction[colorName];
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
