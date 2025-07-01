import { Stack, Box, Image, Text, Group, Divider } from "@mantine/core";
import { getSecretObjectiveData as getSecretData } from "../../../lookup/secretObjectives";
import styles from "./SecretObjectiveCard.module.css";

type Props = {
  secretId: string;
};

export function SecretObjectiveCard({ secretId }: Props) {
  const secretData = getSecretData(secretId);

  if (!secretData) return null;

  return (
    <Box w={320} p="md" className={styles.container}>
      <Stack gap="md">
        {/* Header with icon and basic info */}
        <Group gap="md" align="flex-start">
          <Box w={80} h={80} className={styles.iconContainer}>
            <Image
              src="/so_icon.png"
              w={40}
              h={40}
              className={styles.secretIcon}
            />
          </Box>
          <Stack gap={4} flex={1}>
            <Text size="lg" fw={700} c="white">
              {secretData.name}
            </Text>
            <Text size="xs" c="red.3" fw={600} tt="uppercase">
              Secret Objective
            </Text>
            <Text size="xs" c="red.4" fw={500}>
              {secretData.phase} Phase • {secretData.points} VP
            </Text>
          </Stack>
        </Group>

        <Divider c="red.7" opacity={0.6} />

        {/* Objective Text */}
        <Box>
          <Text size="sm" c="red.3" mb={4} fw={500}>
            Objective
          </Text>
          <Text size="sm" c="gray.1" lh={1.5}>
            {secretData.text}
          </Text>
        </Box>
      </Stack>
    </Box>
  );
}
