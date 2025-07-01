import { Stack, Text, Box, Divider } from "@mantine/core";
import { getAbility } from "../../../lookup/abilities";
import { Surface } from "../Surface";

type Props = {
  abilityId: string;
};

export function AbilityDetailsCard({ abilityId }: Props) {
  const ability = getAbility(abilityId);

  if (!ability) return null;

  return (
    <Surface p="md" style={{ minWidth: 280, maxWidth: 400 }}>
      <Stack gap="sm">
        <Box>
          <Text size="lg" fw={700} c="white" mb={4}>
            {ability.name}
          </Text>
          <Text size="sm" c="dimmed" tt="capitalize">
            {ability.permanentEffect ? "Passive Ability" : "Active Ability"}
          </Text>
        </Box>

        <Divider color="gray.7" />

        {ability.permanentEffect && (
          <Box>
            <Text size="xs" c="violet.3" fw={600} mb={4}>
              PERMANENT EFFECT
            </Text>
            <Text size="sm" c="white" style={{ lineHeight: 1.4 }}>
              {ability.permanentEffect}
            </Text>
          </Box>
        )}

        {ability.window && (
          <Box>
            <Text size="xs" c="violet.3" fw={600} mb={4}>
              TIMING WINDOW
            </Text>
            <Text size="sm" c="white" style={{ lineHeight: 1.4 }}>
              {ability.window}
            </Text>
          </Box>
        )}

        {ability.windowEffect && (
          <Box>
            <Text size="xs" c="violet.3" fw={600} mb={4}>
              EFFECT
            </Text>
            <Text size="sm" c="white" style={{ lineHeight: 1.4 }}>
              {ability.windowEffect}
            </Text>
          </Box>
        )}
      </Stack>
    </Surface>
  );
}
