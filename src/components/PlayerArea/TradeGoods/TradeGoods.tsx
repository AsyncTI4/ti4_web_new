import { Box, Image, Text } from "@mantine/core";
import { getGradientClasses } from "../gradientClasses";
import styles from "./TradeGoodsCommodities.module.css";
import { Shimmer } from "../Shimmer";
import { Chip } from "@/components/shared/primitives/Chip";

type Props = {
  tg: number;
};

export function TradeGoods({
  tg,
}: Props) {
  return (

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
  );
}