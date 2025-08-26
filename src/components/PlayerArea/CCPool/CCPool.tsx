import { Group, Stack, Text } from "@mantine/core";
import classes from "./CCPool.module.css";

type Props = {
  tacticalCC: number;
  fleetCC: number;
  strategicCC: number;
  mahactEdict?: string[];
};

const lh = 1.1;
export function CCPool({
  tacticalCC,
  fleetCC,
  strategicCC,
  mahactEdict = [],
}: Props) {
  return (
    <Stack gap={0} ff="mono" fw={500}>
      <Group gap={6}>
        <Text size="xl" c="white" lh={lh} className={classes.num}>
          {tacticalCC}
        </Text>
        <Text size="xs" lh={lh} fw={400} className={classes.label}>
          TAC
        </Text>
      </Group>
      <Group gap={6}>
        <Text size="xl" c="white" lh={lh} className={classes.num}>
          {fleetCC + mahactEdict.length}
          {mahactEdict.length > 0 ? "*" : ""}
        </Text>
        <Text size="xs" lh={lh} fw={400} className={classes.label}>
          FLT
        </Text>
      </Group>
      <Group gap={6}>
        <Text size="xl" c="white" lh={lh} className={classes.num}>
          {strategicCC}
        </Text>
        <Text size="xs" lh={lh} fw={400} className={classes.label}>
          STR
        </Text>
      </Group>
    </Stack>
  );
}
