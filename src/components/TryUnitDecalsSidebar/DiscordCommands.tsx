import React from "react";
import { Box, Stack, Text, Code, ActionIcon, Group } from "@mantine/core";
import { IconCopy } from "@tabler/icons-react";

type Props = {
  colorName: string | null;
  decalId: string | null;
};

export function DiscordCommands({ colorName, decalId }: Props) {
  const handleCopyCommand = (command: string) => {
    navigator.clipboard.writeText(command);
  };

  return (
    <Box
      py="sm"
      px="md"
      style={{
        borderBottom: "1px solid var(--mantine-color-dark-4)",
        background: "var(--mantine-color-dark-7)",
      }}
    >
      <Text size="sm" fw={600} mb="xs" c="gray.3">
        Discord Commands
      </Text>
      <Stack gap="xs">
        {colorName && (
          <Group gap="xs" wrap="nowrap">
            <Code style={{ flex: 1, fontSize: 11 }} p="xs" bg="dark.8">
              /player change_color color: {colorName}
            </Code>
            <ActionIcon
              size="sm"
              variant="subtle"
              onClick={() =>
                handleCopyCommand(`/player change_color color: ${colorName}`)
              }
            >
              <IconCopy size={14} />
            </ActionIcon>
          </Group>
        )}
        {decalId && (
          <Group gap="xs" wrap="nowrap">
            <Code style={{ flex: 1, fontSize: 11 }} p="xs" bg="dark.8">
              /player change_unit_decal decal_set: {decalId}
            </Code>
            <ActionIcon
              size="sm"
              variant="subtle"
              onClick={() =>
                handleCopyCommand(
                  `/player change_unit_decal decal_set: ${decalId}`
                )
              }
            >
              <IconCopy size={14} />
            </ActionIcon>
          </Group>
        )}
        {!colorName && !decalId && (
          <Text size="xs" c="dimmed">
            Select a color or decal to see commands
          </Text>
        )}
      </Stack>
    </Box>
  );
}

