import { Box, Flex, Group, Stack, Text } from "@mantine/core";
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
    <Flex gap={4} wrap={"wrap"} justify={"center"} align={"center"} className={styles.container}>
      {debtEntries.map(([colorName, amount]) => {
        const factionName = factionColorMap?.[colorName]?.faction;
        const colorAlias = getColorAlias(colorName);
        return (
          <Flex
            key={colorName}
          >
            <SmallControlToken
              colorAlias={colorAlias}
              faction={factionName}
            />
            <Text fs={"italic"} fz={"sm"} fc={"gray"}>
              x{amount}
            </Text>
          </Flex>
        );
      })}
    </Flex>
  );
}
