import { Image, Text } from "@mantine/core";
import { Chip } from "@/components/shared/primitives/Chip";
import classes from "./TradeGoods.module.css";

type Props = {
  tg: number;
};

export function TradeGoods({ tg }: Props) {
  return (
    <Chip accent="yellow" leftSection={<Image src="/tg.png" />} py={4}>
      <Text ff="monospace" fw={800} fz={18} lh={1} c="white" className={classes.value}>
        {tg}
      </Text>
    </Chip>
  );
}
