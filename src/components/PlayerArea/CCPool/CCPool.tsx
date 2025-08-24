import { Flex, Group, Text } from "@mantine/core";

type Props = {
  tacticalCC: number;
  fleetCC: number;
  strategicCC: number;
  mahactEdict?: string[];
};

export function CCPool({
  tacticalCC,
  fleetCC,
  strategicCC,
  mahactEdict = [],
}: Props) {
  return (
    <Flex
      gap={0}
      direction={"column"}
      mah={100}
      ff="mono"
      fw={500}
      style={{
        textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
      }}
    >
      <Group gap={4}>
        <Text
          size="xl"
          c="white"
        >
          {tacticalCC}
        </Text>
        <Text
          fs={"italic"}
          size="xs"
          c="gray"
        >
          TAC
        </Text>
      </Group>
      <Group gap={4}>
        <Text
          fs={"italic"}
          size="xs"
          c="gray"
        >
          FLT
        </Text>
        <Text
          size="xl"
          c="white"
        >
          {fleetCC + mahactEdict.length}{mahactEdict.length > 0 ? "*" : ""}
        </Text>
      </Group>
      <Group gap={4}>
        <Text
          size="xl"
          c="white"
        >{strategicCC}
        </Text>
        <Text
          fs={"italic"}
          size="xs"
          c="gray"
        >
          STR
        </Text>
      </Group>
    </Flex>
  );
}