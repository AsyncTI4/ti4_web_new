import { Box, Image, Text,  Flex } from "@mantine/core";
import { getGradientClasses } from "../gradientClasses";
import styles from "./TradeGoodsCommodities.module.css";
import { Shimmer } from "../Shimmer";
import { Chip } from "@/components/shared/primitives/Chip";

type Props = {
  commodities: number;
  commoditiesTotal: number;
};

export function Commodities({
  commodities,
  commoditiesTotal,
}: Props) {
  return (
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
  );
}