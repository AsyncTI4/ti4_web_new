import { Stack, Box, Image, Text, Group, Divider } from "@mantine/core";
import { leaders } from "../../data/leaders";

type Props = {
  leaderId: string;
};

export function LeaderDetailsCard({ leaderId }: Props) {
  const leaderData = getLeaderData(leaderId);

  if (!leaderData) return null;

  return (
    <Box
      w={320}
      p="md"
      bg="linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)"
      style={{
        border: "1px solid rgba(148, 163, 184, 0.3)",
        borderRadius: "12px",
        backdropFilter: "blur(8px)",
      }}
    >
      <Stack gap="md">
        {/* Header with image and basic info */}
        <Group gap="md" align="flex-start">
          <Image
            src={`/leaders/${leaderId}.webp`}
            w={80}
            h={80}
            radius="50%"
            style={{
              objectFit: "cover",
              objectPosition: "center",
              border: "2px solid rgba(148, 163, 184, 0.4)",
            }}
          />
          <Stack gap={4} flex={1}>
            <Text
              size="lg"
              fw={700}
              c="white"
              style={{
                textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
              }}
            >
              {leaderData.name}
            </Text>
            <Text
              size="sm"
              c="gray.3"
              fw={500}
              fs="italic"
              style={{
                textShadow: "0 1px 2px rgba(0, 0, 0, 0.6)",
              }}
            >
              {leaderData.title}
            </Text>
            <Text
              size="xs"
              c="blue.3"
              fw={600}
              tt="uppercase"
              style={{
                textShadow: "0 1px 2px rgba(0, 0, 0, 0.6)",
              }}
            >
              {leaderData.type}
            </Text>
          </Stack>
        </Group>

        <Divider c="gray.7" opacity={0.8} />

        {/* Unlock Condition */}
        <Box>
          <Text
            size="sm"
            c="blue.3"
            mb={4}
            style={{
              textShadow: "0 1px 2px rgba(0, 0, 0, 0.6)",
            }}
          >
            Unlock Condition
          </Text>
          <Text
            size="sm"
            c="gray.2"
            lh={1.4}
            style={{
              textShadow: "0 1px 2px rgba(0, 0, 0, 0.6)",
            }}
          >
            {leaderData.unlockCondition}
          </Text>
        </Box>

        <Divider c="gray.7" opacity={0.8} />

        {/* Ability */}
        <Box>
          {leaderData.abilityWindow && (
            <Text
              size="sm"
              fw={500}
              c="blue.3"
              mb={6}
              style={{
                textShadow: "0 1px 2px rgba(0, 0, 0, 0.6)",
              }}
            >
              {leaderData.abilityWindow}
            </Text>
          )}

          <Text
            size="sm"
            c="gray.1"
            lh={1.5}
            style={{
              textShadow: "0 1px 2px rgba(0, 0, 0, 0.6)",
            }}
          >
            {leaderData.abilityText}
          </Text>
        </Box>
      </Stack>
    </Box>
  );
}

// Helper function to get leader data by ID
const getLeaderData = (leaderId: string) => {
  return leaders.find((leader) => leader.id === leaderId);
};
