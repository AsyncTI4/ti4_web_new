import { Modal, Title, Text, Box, Grid, Group } from "@mantine/core";
import classes from "./KeyboardShortcutsModal.module.css";

type KeyboardShortcutsModalProps = {
  opened: boolean;
  onClose: () => void;
};

type ShortcutItemProps = {
  keys: string | string[];
  description: string;
};

function ShortcutItem({ keys, description }: ShortcutItemProps) {
  const keyArray = Array.isArray(keys) ? keys : [keys];

  return (
    <Group justify="space-between" gap="md" className={classes.shortcutItem}>
      <Text size="sm" className={classes.description}>
        {description}
      </Text>
      <Group gap="xs">
        {keyArray.map((key, index) => (
          <Box key={index} className={classes.keyContainer}>
            {index > 0 && (
              <Text size="xs" c="dimmed" mx="xs">
                or
              </Text>
            )}
            <Box className={classes.key}>
              <Text size="sm" fw={600}>
                {key}
              </Text>
            </Box>
          </Box>
        ))}
      </Group>
    </Group>
  );
}

export function KeyboardShortcutsModal({
  opened,
  onClose,
}: KeyboardShortcutsModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Title order={3} size="h4">
          Keyboard Shortcuts
        </Title>
      }
      size="lg"
      centered
      // Hardcoded to match --z-settings-modal; see src/utils/zIndexVariables.css
      zIndex={3500}
    >
      <Box className={classes.content}>
        <Grid>
          <Grid.Col span={6}>
            <Title order={4} size="sm" mb="md" c="dimmed">
              Navigation & Display
            </Title>
            <Box className={classes.section}>
              <ShortcutItem
                keys="h"
                description="Toggle both sidebars (smart toggle)"
              />
              <ShortcutItem keys="l" description="Toggle left sidebar" />
              <ShortcutItem keys="r" description="Toggle right sidebar" />
              <ShortcutItem keys={["+", "="]} description="Zoom in" />
              <ShortcutItem keys="-" description="Zoom out" />
              <ShortcutItem keys="u" description="Toggle ruler/distance mode" />
              <ShortcutItem keys="t" description="Toggle tech skip rendering" />
              <ShortcutItem keys="o" description="Toggle overlays" />
            </Box>
          </Grid.Col>

          <Grid.Col span={6}>
            <Title order={4} size="sm" mb="md" c="dimmed">
              Right Sidebar Selection
            </Title>
            <Box className={classes.section}>
              <ShortcutItem
                keys={["1", "2", "3", "4", "5", "6", "7", "8"]}
                description="Select faction (1st, 2nd, etc.)"
              />
              <ShortcutItem keys="T" description="Toggle tech tab" />
              <ShortcutItem keys="H" description="Toggle hand tab" />
              <ShortcutItem keys="S" description="Toggle strength tab" />
            </Box>
          </Grid.Col>
        </Grid>

        <Box mt="xl" p="md" className={classes.note}>
          <Text size="xs" c="dimmed" ta="center">
            Shortcuts are disabled when typing in input fields. Press the same
            key again to deselect.
          </Text>
        </Box>
      </Box>
    </Modal>
  );
}
