import { Group, Stack, Text, Image, Box } from "@mantine/core";
import { Shimmer } from "../Shimmer";
import { leaders } from "../../../data/leaders";

type Props = {
  id: string;
  type: "agent" | "commander" | "hero";
  tgCount: number;
  exhausted: boolean;
  locked: boolean;
  active: boolean;
};

// Helper function to get leader data by ID
const getLeaderData = (leaderId: string) => {
  return leaders.find((leader) => leader.id === leaderId);
};

export function Leader({
  id,
  type,
  tgCount,
  exhausted,
  locked,
  active,
}: Props) {
  const leaderData = getLeaderData(id);

  if (!leaderData) {
    return null; // or some fallback UI
  }

  const isInactive = exhausted || locked;
  const shouldShowGreen = active && !isInactive;
  const shouldShowGrey = isInactive;

  if (shouldShowGreen) {
    return (
      <Shimmer color="green" p={2} px="sm">
        <Group
          gap={8}
          pos="relative"
          align="center"
          style={{
            flexFlow: "nowrap",
          }}
        >
          <Image
            src={`/commanders/${id}.webp`}
            style={{
              width: "35px",
              height: "35px",
              borderRadius: "50%",
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
          <Stack gap={0} style={{ overflow: "hidden" }}>
            <Text
              size="sm"
              fw={700}
              c="white"
              style={{
                textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "clip",
              }}
            >
              {leaderData.name}
            </Text>
            <Text
              size="xs"
              c="green.3"
              fw={500}
              style={{
                opacity: 0.8,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "clip",
                textTransform: "capitalize",
              }}
            >
              {type}
            </Text>
          </Stack>
        </Group>
      </Shimmer>
    );
  }

  return (
    <Box>
      <Group
        gap={8}
        pos="relative"
        align="center"
        p={2}
        px="sm"
        bg="linear-gradient(135deg, rgba(107, 114, 128, 0.1) 0%, rgba(107, 114, 128, 0.05) 100%)"
        opacity={0.7}
        style={{
          borderRadius: "var(--mantine-radius-sm)",
          border: "1px solid #6b7280",
          overflow: "hidden",
          flexFlow: "nowrap",
        }}
      >
        <Image
          src={`/commanders/${id}.webp`}
          style={{
            width: "35px",
            height: "35px",
            borderRadius: "50%",
            objectFit: "cover",
            objectPosition: "center",
            filter: "grayscale(50%)",
          }}
        />
        <Stack gap={0} style={{ overflow: "hidden" }}>
          <Text
            size="sm"
            fw={700}
            c="gray.4"
            style={{
              textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "clip",
            }}
          >
            {leaderData.name}
          </Text>
          <Text
            size="xs"
            c="gray.5"
            fw={500}
            style={{
              opacity: 0.8,
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "clip",
              textTransform: "capitalize",
            }}
          >
            {type}
          </Text>
        </Stack>
      </Group>
    </Box>
  );
}
