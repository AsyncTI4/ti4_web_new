import { Title, Text, Box, Grid, Group } from "@mantine/core";
import type { ReactNode } from "react";
import classes from "./KeyboardShortcutsModal.module.css";
import { AppModal } from "@/shared/ui/AppModal";

type KeyboardShortcutsModalProps = {
  opened: boolean;
  onClose: () => void;
};

/* A section rail: engraved label carried across the column by a fading rule. */
function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <Box className={classes.sectionTitle}>
      {children}
      <span className={classes.sectionRule} aria-hidden="true" />
    </Box>
  );
}

function Keycap({ children }: { children: ReactNode }) {
  return <kbd className={classes.key}>{children}</kbd>;
}

type ShortcutItemProps = {
  keys: string | string[];
  description: string;
  /** True when the keys are a contiguous run rather than alternatives. */
  range?: boolean;
};

function ShortcutItem({ keys, description, range = false }: ShortcutItemProps) {
  const keyArray = Array.isArray(keys) ? keys : [keys];

  return (
    <Group
      justify="space-between"
      wrap="nowrap"
      align="center"
      className={classes.shortcutItem}
    >
      <Text className={classes.description}>{description}</Text>
      <Box className={range ? classes.keyRange : classes.keyContainer}>
        {keyArray.map((key, index) => (
          <Box key={key} className={classes.keyContainer}>
            {!range && index > 0 && (
              <span className={classes.alt} aria-hidden="true">
                /
              </span>
            )}
            <Keycap>{key}</Keycap>
          </Box>
        ))}
      </Box>
    </Group>
  );
}

export function KeyboardShortcutsModal({
  opened,
  onClose,
}: KeyboardShortcutsModalProps) {
  return (
    <AppModal
      opened={opened}
      onClose={onClose}
      title={
        <Title order={3} size="h4">
          Keyboard Shortcuts
        </Title>
      }
      size="lg"
      centered
    >
      <Box className={classes.content}>
        <Grid>
          <Grid.Col span={6}>
            <SectionTitle>Navigation &amp; Display</SectionTitle>
            <Box className={classes.section}>
              <ShortcutItem
                keys="h"
                description="Toggle both sidebars (smart toggle)"
              />
              <ShortcutItem keys="l" description="Toggle left sidebar" />
              <ShortcutItem keys="r" description="Toggle right sidebar" />
              <ShortcutItem keys={["+", "="]} description="Zoom in" />
              <ShortcutItem keys="-" description="Zoom out" />
              <ShortcutItem keys="t" description="Toggle tech skip rendering" />
              <ShortcutItem keys="a" description="Toggle attachments mode" />
              <ShortcutItem keys="o" description="Toggle overlays" />
            </Box>
          </Grid.Col>

          <Grid.Col span={6}>
            <SectionTitle>Right Sidebar Selection</SectionTitle>
            <Box className={classes.section}>
              <ShortcutItem
                keys={["1", "2", "3", "4", "5", "6", "7", "8"]}
                description="Select faction by seat order"
                range
              />
              <ShortcutItem keys="T" description="Toggle tech tab" />
              <ShortcutItem keys="H" description="Toggle hand tab" />
              <ShortcutItem keys="S" description="Toggle strength tab" />
            </Box>
          </Grid.Col>
        </Grid>

        <Box mt="lg" className={classes.note}>
          <Text className={classes.noteText}>
            Press the same key again to deselect. Shortcuts are disabled while
            you are typing in an input.
          </Text>
        </Box>
      </Box>
    </AppModal>
  );
}
