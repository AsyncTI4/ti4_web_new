import { Group, ScrollArea, Stack, Text } from "@mantine/core";
import { IconTrophy } from "@tabler/icons-react";
import { Panel } from "@/shared/ui/primitives/Panel";
import type { TitleSummary } from "./types";
import { SectionHeader } from "./DashboardParts";
import classes from "./DashboardPage.module.css";

export function TitlesCard({ titles }: { titles: TitleSummary }) {
  return (
    <Panel variant="elevated" className={classes.sectionCard}>
      <SectionHeader
        icon={<IconTrophy size={16} color="var(--mantine-color-yellow-5)" />}
        title="Titles"
        badgeAccent="yellow"
        badge={titles.totalCount}
      />
      <ScrollArea h={200} scrollbarSize={4}>
        <Stack gap={8}>
          {titles.items.length === 0 && (
            <Text c="gray.6" size="xs">
              No titles earned yet.
            </Text>
          )}
          {titles.items.map((titleItem) => (
            <div key={titleItem.title} className={classes.titleItem}>
              <Group justify="space-between" gap="xs">
                <Text fw={600} size="sm" c="gray.2">
                  {titleItem.title}
                </Text>
                <Text size="xs" ff="mono" c="yellow.4" fw={700}>
                  x{titleItem.count}
                </Text>
              </Group>
              <Text c="gray.6" size="10px" truncate>
                {titleItem.gameIds.join(" · ")}
              </Text>
            </div>
          ))}
        </Stack>
      </ScrollArea>
    </Panel>
  );
}
