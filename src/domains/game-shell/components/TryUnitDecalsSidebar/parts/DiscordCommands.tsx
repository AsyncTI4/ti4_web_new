import { Box, Stack, Text, Code, ActionIcon, Group } from "@mantine/core";
import { IconCopy } from "@tabler/icons-react";
import classes from "../TryUnitDecalsSidebar.module.css";

type Props = {
  colorName: string | null;
  decalId: string | null;
};

function CommandRow({ command }: { command: string }) {
  return (
    <Group gap="xs" wrap="nowrap">
      <Code style={{ flex: 1, fontSize: 11 }} p="xs" bg="dark.8">
        {command}
      </Code>
      <ActionIcon
        size="sm"
        variant="subtle"
        onClick={() => void navigator.clipboard.writeText(command)}
      >
        <IconCopy size={14} />
      </ActionIcon>
    </Group>
  );
}

export function DiscordCommands({ colorName, decalId }: Props) {
  return (
    <Box py="sm" px="md" className={classes.commands}>
      <Text size="sm" fw={600} mb="xs" c="gray.3">
        Discord Commands
      </Text>
      <Stack gap="xs">
        {colorName && (
          <CommandRow command={`/player change_color color: ${colorName}`} />
        )}
        {decalId && (
          <CommandRow
            command={`/player change_unit_decal decal_set: ${decalId}`}
          />
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
