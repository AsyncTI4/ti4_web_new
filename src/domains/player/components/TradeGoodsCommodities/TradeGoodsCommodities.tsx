import { Box, Text, Stack, Group, Flex } from "@mantine/core";
import { getGradientClasses } from "../gradientClasses";
import styles from "./TradeGoodsCommodities.module.css";
import { Shimmer } from "../Shimmer";
import { Chip } from "@/shared/ui/primitives/Chip";

type Props = {
  tg: number;
  commodities: number;
  commoditiesTotal: number;
};

export function TradeGoodsCommodities({
  tg,
  commodities,
  commoditiesTotal,
}: Props) {
  return (
    <Stack gap={4} align="stretch" className={styles.chipStack} ff={"text"}>
      {/* Trade Goods Chip */}
      <Chip
        accent="yellow"
        className={styles.tgChip}
        enableHover={false}
        ff={"monospace"}
      >
        <Shimmer
          color="yellow"
          px={4}
          py={4}
          className={getGradientClasses("yellow").border}
        >
          <Box className={`${styles.chipContent} ${styles.tgContent}`}>
            <Text className={styles.countText}>{tg}</Text>
          </Box>
        </Shimmer>
      </Chip>

      {/* Commodities Chip */}
      <Chip accent="gray" className={styles.commsChip}>
        <Shimmer
          color="gray"
          px={4}
          py={4}
          className={getGradientClasses("gray").border}
        >
          <Box
            className={`${styles.chipContent} ${styles.commsContent}`}
            ff={"monospace"}
          >
            <Flex gap={0} align={"baseline"}>
              <Text className={styles.countText}>{commodities}</Text>
              <Text className={styles.countTextGray}>/{commoditiesTotal}</Text>
            </Flex>
          </Box>
        </Shimmer>
      </Chip>
    </Stack>
  );
}
