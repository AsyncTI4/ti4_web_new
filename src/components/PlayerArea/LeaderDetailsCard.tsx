import { Stack, Box, Image, Text, Group, Divider } from "@mantine/core";
import { leaders } from "../../data/leaders";
import styles from "./LeaderDetailsCard.module.css";

type Props = {
  leaderId: string;
};

export function LeaderDetailsCard({ leaderId }: Props) {
  const leaderData = getLeaderData(leaderId);

  if (!leaderData) return null;

  return (
    <Box w={320} p="md" className={styles.container}>
      <Stack gap="md">
        {/* Header with image and basic info */}
        <Group gap="md" align="flex-start">
          <Image
            src={`/leaders/${leaderId}.webp`}
            w={80}
            h={80}
            radius="50%"
            className={styles.leaderImage}
          />
          <Stack gap={4} flex={1}>
            <Text size="lg" fw={700} c="white">
              {leaderData.name}
            </Text>
            <Text size="sm" c="gray.3" fw={500} fs="italic">
              {leaderData.title}
            </Text>
            <Text size="xs" c="blue.3" fw={600} tt="uppercase">
              {leaderData.type}
            </Text>
          </Stack>
        </Group>

        <Divider c="gray.7" opacity={0.8} />

        {/* Unlock Condition */}
        <Box>
          <Text size="sm" c="blue.3" mb={4}>
            Unlock Condition
          </Text>
          <Text size="sm" c="gray.2" lh={1.4}>
            {leaderData.unlockCondition}
          </Text>
        </Box>

        <Divider c="gray.7" opacity={0.8} />

        {/* Ability */}
        <Box>
          {leaderData.abilityWindow && (
            <Text size="sm" fw={500} c="blue.3" mb={6}>
              {leaderData.abilityWindow}
            </Text>
          )}

          <Text size="sm" c="gray.1" lh={1.5}>
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
