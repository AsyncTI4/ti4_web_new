import { Box, Image, Text, Stack, Group, Flex } from "@mantine/core";
import { getGradientClasses } from "../gradientClasses";
import styles from "./TradeGoodsCommodities.module.css";
import { Shimmer } from "../Shimmer";
import { Chip } from "@/components/shared/primitives/Chip";

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
        <Chip accent="yellow" className={styles.tgChip} enableHover={false} ff={"monospace"}>
          <Shimmer
            color="yellow"
            px={4}
            py={4}
            className={getGradientClasses("yellow").border}
          >
            <Box className={styles.chipContent}>
              <Image
                src="/tg.png"
                className={`${getGradientClasses("yellow").iconFilter} ${styles.icon}`}
              />
              <Text className={styles.countText}>{tg}</Text>
            </Box>
          </Shimmer>
        </Chip>

        {/* Commodities Chip */}
        <Chip accent="gray" className={styles.commsChip} enableHover={false}>
          <Shimmer
            color="gray"
            px={4}
            py={4}
            className={getGradientClasses("gray").border}
          >
            <Box className={styles.chipContent} ff={"monospace"}>
              <Image
                src="/comms.png"
                className={`${getGradientClasses("gray").iconFilter} ${styles.icon}`}
              />
              <Flex gap={0} align={"baseline"}>
                <Text className={styles.countText}>
                  {commodities}
                </Text>
                <Text className={styles.countTextGray}>
                  /{commoditiesTotal}
                </Text>
              </Flex>
            </Box>
          </Shimmer>
        </Chip>
      </Stack>
  );
}
