import { Stack, Group, Text } from "@mantine/core";
// @ts-ignore
import InfluenceIcon from "../../InfluenceIcon";

type Props = {
  resources: number;
  totalResources: number;
  influence: number;
  totalInfluence: number;
};

export function ResourceInfluenceDisplay({
  resources,
  totalResources,
  influence,
  totalInfluence,
}: Props) {
  return (
    <Stack gap="xs">
      {/* Resources */}
      <Group gap={4} align="baseline">
        <svg width="12" height="12" viewBox="0 0 24 24">
          <polygon
            points="6,2 18,2 22,12 18,22 6,22 2,12"
            fill="transparent"
            stroke="#eab308"
            strokeWidth="2"
          />
        </svg>
        <Text
          size="lg"
          fw={700}
          c="yellow.3"
          style={{
            textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
            lineHeight: 1,
          }}
        >
          {resources}
        </Text>
        <Text size="sm" c="yellow.5" fw={500} style={{ lineHeight: 1 }}>
          / {totalResources}
        </Text>
      </Group>
      {/* Influence */}
      <Group gap={4} align="baseline">
        <InfluenceIcon size={12} />
        <Text
          size="lg"
          fw={700}
          c="blue.3"
          style={{
            textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
            lineHeight: 1,
          }}
        >
          {influence}
        </Text>
        <Text size="sm" c="blue.5" fw={500} style={{ lineHeight: 1 }}>
          / {totalInfluence}
        </Text>
      </Group>
    </Stack>
  );
}
