import { Stack, Box, Image, Text, Group, Divider } from "@mantine/core";
import { secretObjectives } from "../../data/secretObjectives";

type Props = {
  secretId: string;
};

export function SecretObjectiveCard({ secretId }: Props) {
  const secretData = getSecretObjectiveData(secretId);

  if (!secretData) return null;

  return (
    <Box
      w={320}
      p="md"
      bg="linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)"
      style={{
        border: "1px solid rgba(239, 68, 68, 0.4)",
        borderRadius: "12px",
        backdropFilter: "blur(8px)",
        boxShadow:
          "0 4px 16px rgba(239, 68, 68, 0.2), 0 0 12px rgba(248, 113, 113, 0.1)",
      }}
    >
      <Stack gap="md">
        {/* Header with icon and basic info */}
        <Group gap="md" align="flex-start">
          <Box
            w={80}
            h={80}
            style={{
              borderRadius: "50%",
              background:
                "linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.15) 100%)",
              border: "2px solid rgba(239, 68, 68, 0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              src="/so_icon.png"
              w={40}
              h={40}
              style={{
                objectFit: "contain",
                filter:
                  "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.8)) hue-rotate(0deg) saturate(1.2)",
              }}
            />
          </Box>
          <Stack gap={4} flex={1}>
            <Text
              size="lg"
              fw={700}
              c="white"
              style={{
                textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
              }}
            >
              {secretData.name}
            </Text>
            <Text
              size="xs"
              c="red.3"
              fw={600}
              tt="uppercase"
              style={{
                textShadow: "0 1px 2px rgba(0, 0, 0, 0.6)",
              }}
            >
              Secret Objective
            </Text>
            <Text
              size="xs"
              c="red.4"
              fw={500}
              style={{
                textShadow: "0 1px 2px rgba(0, 0, 0, 0.6)",
              }}
            >
              {secretData.phase} Phase • {secretData.points} VP
            </Text>
          </Stack>
        </Group>

        <Divider c="red.7" opacity={0.6} />

        {/* Objective Text */}
        <Box>
          <Text
            size="sm"
            c="red.3"
            mb={4}
            fw={500}
            style={{
              textShadow: "0 1px 2px rgba(0, 0, 0, 0.6)",
            }}
          >
            Objective
          </Text>
          <Text
            size="sm"
            c="gray.1"
            lh={1.5}
            style={{
              textShadow: "0 1px 2px rgba(0, 0, 0, 0.6)",
            }}
          >
            {secretData.text}
          </Text>
        </Box>
      </Stack>
    </Box>
  );
}

// Helper function to get secret objective data by ID
const getSecretObjectiveData = (secretId: string) => {
  return secretObjectives.find((secret) => secret.alias === secretId);
};
