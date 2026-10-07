import { Box, Text, Stack } from "@mantine/core";
import { useState, type ReactNode } from "react";
import { ActionCard } from "@/domains/player/components/ActionCard";
import { ScoredSecret } from "@/domains/player/components/ScoredSecret";
import { PromissoryNote } from "@/domains/player/components/PromissoryNote";
import { SmoothPopover } from "@/shared/ui/SmoothPopover";
import { ActionCardDetailsCard } from "@/domains/cards/components/ActionCardDetailsCard";
import { SecretObjectiveCard } from "@/domains/cards/components/SecretObjectiveCard";
import { PromissoryNoteCard } from "@/domains/cards/components/PromissoryNoteCard";
import { PlayerHandData } from "@/shared/types/playerHand";
import classes from "./SecretHand.module.css";

type Props = {
  handData?: PlayerHandData;
  isLoading?: boolean;
  error?: Error | null;
};

export function SecretHand({ handData, isLoading, error }: Props) {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const isEmpty =
    !handData ||
    (handData.actionCards.length === 0 &&
      handData.secretObjectives.length === 0 &&
      handData.promissoryNotes.length === 0);

  const sectionProps = { selectedCard, onSelect: setSelectedCard };

  return (
    <Box className={classes.container}>
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
            <HandSection
              {...sectionProps}
              title="Action Cards"
              keyPrefix="action"
              ids={handData.actionCards}
              renderChip={(id, onClick) => (
                <ActionCard
                  actionCardId={id}
                  onClick={onClick}
                  showDetails={false}
                />
              )}
              renderDetails={(id) => <ActionCardDetailsCard actionCardId={id} />}
            />
            <HandSection
              {...sectionProps}
              title="Secret Objectives"
              keyPrefix="secret"
              ids={handData.secretObjectives}
              renderChip={(id, onClick) => (
                <ScoredSecret
                  secretId={id}
                  variant="unscored"
                  onClick={onClick}
                />
              )}
              renderDetails={(id) => <SecretObjectiveCard secretId={id} />}
            />
            <HandSection
              {...sectionProps}
              title="Promissory Notes"
              keyPrefix="promissory"
              ids={handData.promissoryNotes}
              renderChip={(id, onClick) => (
                <PromissoryNote promissoryNoteId={id} onClick={onClick} />
              )}
              renderDetails={(id) => (
                <PromissoryNoteCard promissoryNoteId={id} />
              )}
            />
          </Stack>
        )}

        {!isLoading && !error && isEmpty && (
          <Text size="sm" c="gray.5" ta="center" py="md">
            No cards in hand
          </Text>
        )}
      </Box>
    </Box>
  );
}

type HandSectionProps = {
  title: string;
  keyPrefix: string;
  ids: string[];
  selectedCard: string | null;
  onSelect: (cardKey: string | null) => void;
  renderChip: (id: string, onClick: () => void) => ReactNode;
  renderDetails: (id: string) => ReactNode;
};

function HandSection({
  title,
  keyPrefix,
  ids,
  selectedCard,
  onSelect,
  renderChip,
  renderDetails,
}: HandSectionProps) {
  if (ids.length === 0) return null;

  return (
    <Box>
      <Text size="xs" fw={600} c="gray.3" mb="xs">
        {title} ({ids.length})
      </Text>
      <Stack gap={4}>
        {ids.map((id, index) => {
          const cardKey = `${keyPrefix}-${id}-${index}`;
          return (
            <SmoothPopover
              key={cardKey}
              opened={selectedCard === cardKey}
              onChange={(opened) => onSelect(opened ? cardKey : null)}
            >
              <SmoothPopover.Target>
                <div>{renderChip(id, () => onSelect(cardKey))}</div>
              </SmoothPopover.Target>
              <SmoothPopover.Dropdown p={0}>
                {renderDetails(id)}
              </SmoothPopover.Dropdown>
            </SmoothPopover>
          );
        })}
      </Stack>
    </Box>
  );
}
