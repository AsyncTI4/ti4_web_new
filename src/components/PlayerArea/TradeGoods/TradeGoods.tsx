import { Image, Text } from "@mantine/core";
import styles from "./TradeGoodsCommodities.module.css";
import { Chip } from "@/components/shared/primitives/Chip";

type Props = {
  tg: number;
};

export function TradeGoods({ tg }: Props) {
  return (
    <Chip
      accent="yellow"
      ff={"monospace"}
      leftSection={<Image src="/tg.png" />}
      py={4}
    >
      <Text className={styles.countText}>{tg}</Text>
    </Chip>
  );
}
