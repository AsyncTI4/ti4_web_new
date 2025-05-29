import { Stack, Group, Text } from "@mantine/core";
// @ts-ignore
import InfluenceIcon from "../../InfluenceIcon";

type Props = {
  resources: number;
  totalResources: number;
  influence: number;
  totalInfluence: number;
};

// Component for the half-yellow, half-blue combined icon
function CombinedResourceInfluenceIcon({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <defs>
        <linearGradient id="half-yellow-blue" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="50%" stopColor="#eab308" />
          <stop offset="50%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
      <polygon
        points="6,2 18,2 22,12 18,22 6,22 2,12"
        fill="transparent"
        stroke="url(#half-yellow-blue)"
        strokeWidth="2"
      />
    </svg>
  );
}

export function ResourceInfluenceDisplay({
  resources,
  totalResources,
  influence,
  totalInfluence,
}: Props) {
  const currentSum = resources + influence;
  const totalSum = totalResources + totalInfluence;

  return (
    <Group gap="md" align="start">
      {/* Individual Resources and Influence */}
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

      {/* Combined Sum */}
      <Group gap={4} align="baseline">
        <CombinedResourceInfluenceIcon size={12} />
        <Text
          size="lg"
          fw={700}
          c="gray.3"
          style={{
            textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
            lineHeight: 1,
          }}
        >
          {currentSum}
        </Text>
        <Text size="sm" c="gray.5" fw={500} style={{ lineHeight: 1 }}>
          / {totalSum}
        </Text>
      </Group>
    </Group>
  );
}
