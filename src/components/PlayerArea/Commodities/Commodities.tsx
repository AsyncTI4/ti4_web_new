import { Image, Text, Group } from "@mantine/core";
import styles from "./TradeGoodsCommodities.module.css";
import { Chip } from "@/components/shared/primitives/Chip";

type Props = {
  commodities: number;
  commoditiesTotal: number;
};

export function Commodities({ commodities, commoditiesTotal }: Props) {
  return (
    <Chip
      accent="gray"
      leftSection={<Image src="/comms.png" />}
      ff={"monospace"}
      py={6}
    >
      <Group gap={2} align={"baseline"}>
        <Text className={styles.countText}>{commodities}</Text>
        <Text className={styles.countTextGray}>/{commoditiesTotal}</Text>
      </Group>
    </Chip>
  );
}
