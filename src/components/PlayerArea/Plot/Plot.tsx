import { Box, Text, Stack, Group } from "@mantine/core";
import { SmoothPopover } from "../../shared/SmoothPopover";
import { useState } from "react";
import type { ReactElement } from "react";
import styles from "./Plot.module.css";
import { Chip } from "@/components/shared/primitives/Chip";
import { CircularFactionIcon } from "@/components/shared/CircularFactionIcon";
import type { PlotCard } from "@/data/types";
import { DetailsCard } from "@/components/shared/DetailsCard";

type Props = {
  plotCard: PlotCard;
  faction?: string;
};

const MAX_PLOT_SLOTS = 4;

export function Plot({ plotCard, faction }: Props) {
  const [opened, setOpened] = useState(false);

  // Only reveal plot names if:
  // 1. plotAlias exists AND
  // 2. faction is "obsidian" (not "firmament")
  const isRevealed = !!plotCard.plotAlias && faction === "obsidian";
  const displayName = plotCard.plotAlias
    ? plotCard.plotAlias.charAt(0).toUpperCase() + plotCard.plotAlias.slice(1)
    : undefined;

  const renderFactionSlots = (): ReactElement[] => {
    const slots: ReactElement[] = [];
    const filledSlots = plotCard.factions.length;

    for (let i = 0; i < MAX_PLOT_SLOTS; i++) {
      if (i < filledSlots) {
        const faction = plotCard.factions[i];
        slots.push(
          <Box key={`faction-${i}`} display="flex" style={{ flexShrink: 0 }}>
            <CircularFactionIcon faction={faction} size={18} />
          </Box>
        );
      } else {
        slots.push(
          <Box
            key={`empty-${i}`}
            w={18}
            h={18}
            display="flex"
            style={{ flexShrink: 0 }}
          >
            <Box
              w={15}
              h={15}
              style={{
                borderRadius: "50%",
                border: "1.5px dashed rgba(255, 255, 255, 0.3)",
                background: "rgba(255, 255, 255, 0.05)",
              }}
            />
          </Box>
        );
      }
    }

    return slots;
  };

  return (
    <SmoothPopover opened={opened} onChange={setOpened}>
      <SmoothPopover.Target>
        <Box miw={60}>
          <Chip
            className={styles.plotCard}
            accent="bloodOrange"
            onClick={() => setOpened((o) => !o)}
            strong
            px="xs"
            py={6}
          >
            <Stack gap={2} align="center">
              <Group gap={2} justify="center" wrap="wrap">
                {renderFactionSlots()}
              </Group>
              {isRevealed ? (
                <>
                  <Text
                    size="xs"
                    fw={600}
                    ta="center"
                    tt="uppercase"
                    c="white"
                    style={{
                      letterSpacing: "0.3px",
                      textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
                      lineHeight: 1.1,
                    }}
                  >
                    {displayName}
                  </Text>
                  <Text
                    size="xs"
                    ff="monospace"
                    ta="center"
                    style={{ letterSpacing: "0.3px", opacity: 0.7 }}
                  >
                    #{plotCard.identifier}
                  </Text>
                </>
              ) : (
                <>
                  <Text
                    size="md"
                    fw={700}
                    ff="monospace"
                    ta="center"
                    c="white"
                    style={{
                      letterSpacing: "0.5px",
                      textShadow: "0 2px 4px rgba(0, 0, 0, 0.9)",
                      lineHeight: 1.1,
                    }}
                  >
                    #{plotCard.identifier}
                  </Text>
                  <Text
                    size="xs"
                    ta="center"
                    c="dimmed"
                    style={{
                      letterSpacing: "0.2px",
                      opacity: 0.8,
                      fontStyle: "italic",
                    }}
                  >
                    Hidden Plot
                  </Text>
                </>
              )}
            </Stack>
          </Chip>
        </Box>
      </SmoothPopover.Target>
      <SmoothPopover.Dropdown p={0}>
        <DetailsCard width={300} color="red">
          <Stack gap="md">
            <DetailsCard.Title
              title={
                isRevealed
                  ? `${displayName} (Plot #${plotCard.identifier})`
                  : `Hidden Plot Card #${plotCard.identifier}`
              }
              subtitle={
                isRevealed
                  ? `Plot Card #${plotCard.identifier}`
                  : `Plot Card #${plotCard.identifier}`
              }
            />
            {!isRevealed && (
              <Text size="sm" c="dimmed" style={{ fontStyle: "italic" }}>
                This plot card has not been revealed yet. The plot name will be
                shown when the Firmament player becomes the Obsidian.
              </Text>
            )}
            {plotCard.factions.length > 0 && (
              <Stack gap="xs">
                <Text size="sm" fw={600}>
                  Control Tokens:
                </Text>
                <Stack gap={8}>
                  {plotCard.factions.map((faction: string, index: number) => (
                    <Group key={index} gap="xs">
                      <CircularFactionIcon faction={faction} size={20} />
                      <Text size="sm">{faction}</Text>
                    </Group>
                  ))}
                </Stack>
              </Stack>
            )}
          </Stack>
        </DetailsCard>
      </SmoothPopover.Dropdown>
    </SmoothPopover>
  );
}
