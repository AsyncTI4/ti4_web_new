import { Box, Text, Stack, Group } from "@mantine/core";
import { SmoothPopover } from "@/shared/ui/SmoothPopover";
import { useDisclosure } from "@/hooks/useDisclosure";
import type { ReactElement } from "react";
import styles from "./Plot.module.css";
import { Chip } from "@/shared/ui/primitives/Chip";
import { CircularFactionIcon } from "@/shared/ui/CircularFactionIcon";
import type { PlotCard } from "@/entities/data/types";
import { DetailsCard } from "@/shared/ui/DetailsCard";

type Props = {
  plotCard: PlotCard;
  faction?: string;
  compact?: boolean;
};

const MAX_PLOT_SLOTS = 4;

export function Plot({ plotCard, faction, compact = false }: Props) {
  const { opened, setOpened, toggle } = useDisclosure(false);

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
            <Box className={styles.tokenSeat} />
          </Box>
        );
      }
    }

    return slots;
  };

  /*
   * The claim seats are what makes a plot a plot. Nothing else in the player
   * area is a fixed row of four, so the silhouette identifies the compartment
   * before any label does — and the count is real information: how many
   * factions have already signed on to this scheme.
   */
  const renderCompactSeats = (): ReactElement[] =>
    Array.from({ length: MAX_PLOT_SLOTS }, (_, i) => {
      const claimant = plotCard.factions[i];
      return claimant ? (
        <CircularFactionIcon key={`claim-${i}`} faction={claimant} size={13} />
      ) : (
        <Box key={`claim-${i}`} className={styles.tokenSeatSm} />
      );
    });

  const chipContent = compact ? (
    <Stack gap={3} align="center" className={styles.compactContent}>
      <Group gap={5} wrap="nowrap" align="center" justify="center">
        <Text size="xs" fw={700} className={styles.compactId}>
          #{plotCard.identifier}
        </Text>
        {isRevealed ? (
          <Text size="xs" fw={700} className={styles.compactName}>
            {displayName}
          </Text>
        ) : (
          /* Redacted rather than the word "Hidden": a column of plots then
             shows at a glance which ones have been cracked open. */
          <span
            className={styles.redaction}
            role="img"
            aria-label="Name not yet revealed"
          />
        )}
      </Group>
      <Group gap={3} wrap="nowrap" className={styles.compactSeats}>
        {renderCompactSeats()}
      </Group>
    </Stack>
  ) : (
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
              textShadow: "0 1px 1px rgba(0, 0, 0, 0.62)",
              lineHeight: 1.1,
            }}
          >
            {displayName}
          </Text>
          <Text
            size="xs"
            ff="mono"
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
            ff="mono"
            ta="center"
            c="white"
            style={{
              letterSpacing: "0.5px",
              textShadow: "0 1px 1px rgba(0, 0, 0, 0.7)",
              lineHeight: 1.1,
            }}
          >
            #{plotCard.identifier}
          </Text>
          <Text
            size="xs"
            ta="center"
            c="dimmed"
            style={{ letterSpacing: "0.2px", opacity: 0.8 }}
          >
            Hidden Plot
          </Text>
        </>
      )}
    </Stack>
  );

  return (
    <SmoothPopover opened={opened} onChange={setOpened}>
      <SmoothPopover.Target>
        <Box miw={compact ? undefined : 60}>
          <Chip
            className={compact ? styles.plotCardCompact : styles.plotCard}
            accent="gray"
            onClick={toggle}
            strong={!compact}
            px="xs"
            py={compact ? 2 : 6}
          >
            {chipContent}
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
              <Text size="sm" c="dimmed">
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
