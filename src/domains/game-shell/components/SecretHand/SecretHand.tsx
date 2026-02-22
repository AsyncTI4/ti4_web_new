import { Box, Text, Stack, SimpleGrid, Image, Group } from "@mantine/core";
import { useState } from "react";
import { IconChevronUp, IconChevronDown } from "@tabler/icons-react";
import { ActionCard } from "@/domains/player/components/ActionCard";
import { ScoredSecret } from "@/domains/player/components/ScoredSecret";
import { PromissoryNote } from "@/domains/player/components/PromissoryNote";
import { SmoothPopover } from "@/shared/ui/SmoothPopover";
import { ActionCardDetailsCard } from "@/domains/player/components/ActionCardDetailsCard";
import { SecretObjectiveCard } from "@/domains/player/components/SecretObjectiveCard";
import { PromissoryNoteCard } from "@/domains/player/components/PromissoryNoteCard";
import { PlayerHandData } from "@/shared/types/playerHand";
import { PlayerData } from "@/entities/data/types";
import { cdnImage } from "@/entities/data/cdnImage";
import classes from "./SecretHand.module.css";

type Props = {
  isCollapsed: boolean;
  onToggle: () => void;
  handData?: PlayerHandData;
  isLoading?: boolean;
  error?: Error | null;
  playerData?: PlayerData[];
  activeArea?: any;
  userDiscordId?: string;
};

export function SecretHand({
  isCollapsed,
  onToggle,
  handData,
  isLoading,
  error,
  playerData,
  activeArea,
  userDiscordId,
}: Props) {
  const [selectedCard, setSelectedCard] = useState<{
    type: "action" | "secret" | "promissory";
    id: string;
  } | null>(null);

  // Determine if we're viewing the user's own faction
  const currentFaction =
    activeArea?.type === "faction" ? activeArea.faction : null;
  const currentPlayer = playerData?.find((p) => p.faction === currentFaction);
  const isViewingOwnFaction =
    currentPlayer && userDiscordId && currentPlayer.discordId === userDiscordId;

  // Get title and icon for the header
  const headerTitle = isViewingOwnFaction ? "Your Hand" : "Hand";
  const headerIcon =
    isViewingOwnFaction && currentFaction ? (
      <Image
        src={cdnImage(`/factions/${currentFaction}.png`)}
        alt={currentFaction}
        w={16}
        h={16}
      />
    ) : null;

  if (isCollapsed) {
    return (
      <Box className={classes.collapsedContainer}>
        <Box className={classes.collapsedHeader} onClick={onToggle}>
          <Group gap="xs" align="center">
            {headerIcon}
            <Text size="sm" fw={600} c="white">
              {headerTitle}
            </Text>
          </Group>
          <IconChevronUp size={14} color="var(--mantine-color-gray-5)" />
        </Box>
      </Box>
    );
  }

  return (
    <Box className={classes.container}>
      <Box className={classes.header} onClick={onToggle}>
        <Group gap="xs" align="center">
          {headerIcon}
          <Text size="sm" fw={600} c="white">
            {headerTitle}
          </Text>
        </Group>
        <IconChevronDown size={14} color="var(--mantine-color-gray-5)" />
      </Box>

      <Box className={classes.content}>
        {isLoading && (
          <Text size="sm" c="gray.5" ta="center" py="md">
            Loading hand...
          </Text>
        )}

        {error && (
          <Text size="sm" c="red.5" ta="center" py="md">
            Failed to load hand data
          </Text>
        )}

        {!isLoading && !error && handData && (
          <Stack gap="md">
            {/* Action Cards */}
            {handData.actionCards.length > 0 && (
              <Box>
                <Text size="xs" fw={600} c="gray.3" mb="xs">
                  Action Cards ({handData.actionCards.length})
                </Text>
                <Stack gap={4}>
                  {handData.actionCards.map((cardId, index) => {
                    const cardKey = `action-${cardId}-${index}`;
                    const isSelected =
                      selectedCard?.type === "action" &&
                      selectedCard?.id === cardKey;

                    return (
                      <SmoothPopover
                        key={cardKey}
                        opened={isSelected}
                        onChange={(opened) =>
                          setSelectedCard(
                            opened ? { type: "action", id: cardKey } : null
                          )
                        }
                      >
                        <SmoothPopover.Target>
                          <div>
                            <ActionCard
                              actionCardId={cardId}
                              onClick={() =>
                                setSelectedCard({ type: "action", id: cardKey })
                              }
                              showDetails={false}
                            />
                          </div>
                        </SmoothPopover.Target>
                        <SmoothPopover.Dropdown p={0}>
                          <ActionCardDetailsCard actionCardId={cardId} />
                        </SmoothPopover.Dropdown>
                      </SmoothPopover>
                    );
                  })}
                </Stack>
              </Box>
            )}

            {/* Secret Objectives */}
            {handData.secretObjectives.length > 0 && (
              <Box>
                <Text size="xs" fw={600} c="gray.3" mb="xs">
                  Secret Objectives ({handData.secretObjectives.length})
                </Text>
                <Stack gap={4}>
                  {handData.secretObjectives.map((secretId, index) => {
                    const cardKey = `secret-${secretId}-${index}`;
                    const isSelected =
                      selectedCard?.type === "secret" &&
                      selectedCard?.id === cardKey;

                    return (
                      <SmoothPopover
                        key={cardKey}
                        opened={isSelected}
                        onChange={(opened) =>
                          setSelectedCard(
                            opened ? { type: "secret", id: cardKey } : null
                          )
                        }
                      >
                        <SmoothPopover.Target>
                          <div>
                            <ScoredSecret
                              secretId={secretId}
                              variant="unscored"
                              onClick={() =>
                                setSelectedCard({ type: "secret", id: cardKey })
                              }
                            />
                          </div>
                        </SmoothPopover.Target>
                        <SmoothPopover.Dropdown p={0}>
                          <SecretObjectiveCard secretId={secretId} />
                        </SmoothPopover.Dropdown>
                      </SmoothPopover>
                    );
                  })}
                </Stack>
              </Box>
            )}

            {/* Promissory Notes */}
            {handData.promissoryNotes.length > 0 && (
              <Box>
                <Text size="xs" fw={600} c="gray.3" mb="xs">
                  Promissory Notes ({handData.promissoryNotes.length})
                </Text>
                <SimpleGrid cols={1} spacing={4}>
                  {handData.promissoryNotes.map((noteId, index) => {
                    const cardKey = `promissory-${noteId}-${index}`;
                    const isSelected =
                      selectedCard?.type === "promissory" &&
                      selectedCard?.id === cardKey;

                    return (
                      <SmoothPopover
                        key={cardKey}
                        opened={isSelected}
                        onChange={(opened) =>
                          setSelectedCard(
                            opened ? { type: "promissory", id: cardKey } : null
                          )
                        }
                      >
                        <SmoothPopover.Target>
                          <div>
                            <PromissoryNote
                              promissoryNoteId={noteId}
                              onClick={() =>
                                setSelectedCard({
                                  type: "promissory",
                                  id: cardKey,
                                })
                              }
                            />
                          </div>
                        </SmoothPopover.Target>
                        <SmoothPopover.Dropdown p={0}>
                          <PromissoryNoteCard promissoryNoteId={noteId} />
                        </SmoothPopover.Dropdown>
                      </SmoothPopover>
                    );
                  })}
                </SimpleGrid>
              </Box>
            )}
          </Stack>
        )}

        {!isLoading &&
          !error &&
          (!handData ||
            (handData.actionCards.length === 0 &&
              handData.secretObjectives.length === 0 &&
              handData.promissoryNotes.length === 0)) && (
            <Text size="sm" c="gray.5" ta="center" py="md">
              No cards in hand
            </Text>
          )}
      </Box>
    </Box>
  );
}
