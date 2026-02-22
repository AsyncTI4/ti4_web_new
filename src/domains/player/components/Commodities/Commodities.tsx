import { Image, Text, Group } from "@mantine/core";
import { Chip } from "@/shared/ui/primitives/Chip";
import classes from "./Commodities.module.css";

type Props = {
  commodities: number;
  commoditiesTotal: number;
};

export function Commodities({ commodities, commoditiesTotal }: Props) {
  return (
    <Chip accent="gray" leftSection={<Image src="/comms.png" />} py={6}>
      <Group gap={2} align="baseline" ff="monospace">
        <Text fw={800} fz={18} lh={1} c="white" className={classes.value}>
          {commodities}
        </Text>
        <Text fw={400} fz={14} lh={1} c="dimmed" className={classes.total}>
          /{commoditiesTotal}
        </Text>
      </Group>
    </Chip>
  );
}
