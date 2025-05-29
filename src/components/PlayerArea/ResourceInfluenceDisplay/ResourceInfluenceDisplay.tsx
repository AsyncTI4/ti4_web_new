import { Stack, Group, Text, Divider, Box } from "@mantine/core";
// @ts-ignore
import InfluenceIcon from "../../InfluenceIcon";

type Props = {
  resources: number;
  totalResources: number;
  influence: number;
  totalInfluence: number;
};

// Helper function to pad single digits with space for alignment and round down decimals
const padNumber = (num: number): string => {
  const rounded = Math.floor(num);
  return rounded < 10 ? ` ${rounded}` : `${rounded}`;
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
  const currentSum = Math.floor(resources + influence);
  const totalSum = Math.floor(totalResources + totalInfluence);

  return (
    <Stack gap="sm" align="stretch">
      {/* Individual Resources and Influence */}
      <Stack gap="xs" align="stretch">
        {/* Resources */}
        <Group gap={4} align="baseline" justify="flex-start">
          <Box w={16} style={{ display: "flex", justifyContent: "center" }}>
            <svg width="12" height="12" viewBox="0 0 24 24">
              <polygon
                points="6,2 18,2 22,12 18,22 6,22 2,12"
                fill="transparent"
                stroke="#eab308"
                strokeWidth="2"
              />
            </svg>
          </Box>
          <Text
            size="md"
            fw={700}
            c="yellow.3"
            ff="mono"
            style={{
              textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
              lineHeight: 1,
              minWidth: "20px",
            }}
          >
            {padNumber(resources)}
          </Text>
          <Text
            size="xs"
            c="yellow.5"
            fw={500}
            ff="mono"
            style={{ lineHeight: 1 }}
          >
            / {padNumber(totalResources)}
          </Text>
        </Group>

        {/* Influence */}
        <Group gap={4} align="baseline" justify="flex-start">
          <Box w={16} style={{ display: "flex", justifyContent: "center" }}>
            <InfluenceIcon size={12} />
          </Box>
          <Text
            size="md"
            fw={700}
            c="blue.3"
            ff="mono"
            style={{
              textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
              lineHeight: 1,
              minWidth: "20px",
            }}
          >
            {padNumber(influence)}
          </Text>
          <Text
            size="xs"
            c="blue.5"
            fw={500}
            ff="mono"
            style={{ lineHeight: 1 }}
          >
            / {padNumber(totalInfluence)}
          </Text>
        </Group>
      </Stack>

      {/* Subtle Horizontal Divider */}
      <Divider
        size="xs"
        color="gray.7"
        style={{
          width: "60%",
          opacity: 0.3,
          alignSelf: "center",
        }}
      />

      {/* Combined Sum */}
      <Group gap={4} align="baseline" justify="center">
        <Box w={16} style={{ display: "flex", justifyContent: "center" }}>
          <CombinedResourceInfluenceIcon size={12} />
        </Box>
        <Text
          size="md"
          fw={700}
          c="gray.3"
          ff="mono"
          style={{
            textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
            lineHeight: 1,
            minWidth: "20px",
          }}
        >
          {padNumber(currentSum)}
        </Text>
        <Text size="xs" c="gray.5" fw={500} ff="mono" style={{ lineHeight: 1 }}>
          / {padNumber(totalSum)}
        </Text>
      </Group>
    </Stack>
  );
}
