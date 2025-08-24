import { Flex, Text } from "@mantine/core";
import { SmallControlToken } from "../../Map/ControlToken";
import { getColorAlias } from "../../../lookup/colors";
import styles from "./DebtTokens.module.css";
import { useFactionColors } from "@/hooks/useFactionColors";
import { Shimmer } from "../Shimmer";
import { getGradientClasses } from "../gradientClasses";
import { Chip } from "@/components/shared/primitives/Chip";

type Props = {
  debts: Record<string, number>;
};
export function DebtTokens({ debts }: Props) {
  const debtEntries = Object.entries(debts).filter(([, amount]) => amount > 0);
  if (debtEntries.length === 0) return null;
  const factionColorMap = useFactionColors();

  return (
    <Chip accent="red" enableHover={false}>
      <Shimmer
        color="red"
        px={4}
        py={4}
        className={getGradientClasses("red").border}
      >
        <Flex gap={0} wrap={"wrap"} justify={"center"} align={"center"} className={styles.container}>
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
      </Shimmer>
    </Chip>
  );
}