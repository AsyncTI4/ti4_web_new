import { Button, Group, Stack, Text } from "@mantine/core";
import { IconRefresh } from "@tabler/icons-react";
import { DiscordAuthButton } from "@/domains/auth/DiscordLogin";
import classes from "@/shared/ui/map/MapUI.module.css";
import { MovementOriginModal } from "../MovementOriginModal";
import type { ActiveOrigin } from "../hooks/useMovementMode";
import { Tile } from "@/app/providers/context/types";
import { AppModal } from "@/shared/ui/AppModal";

type Props = {
  showAuthModal: boolean;
  onCloseAuthModal: () => void;
  showSuccessModal: boolean;
  onCloseSuccessModal: () => void;
  originModalOpen: boolean;
  onCloseOriginModal: () => void;
  activeOrigin: ActiveOrigin;
  tiles: Tile[];
};

export function MovementModals({
  showAuthModal,
  onCloseAuthModal,
  showSuccessModal,
  onCloseSuccessModal,
  originModalOpen,
  onCloseOriginModal,
  activeOrigin,
  tiles,
}: Props) {
  return (
    <>
      <AppModal
        opened={showAuthModal}
        onClose={onCloseAuthModal}
        title="Login Required"
      >
        <Stack>
          <Text size="sm">
            You must be logged into Discord to use movement mode.
          </Text>
          <DiscordAuthButton leftSection={<IconRefresh size={16} />}>
            Login with Discord
          </DiscordAuthButton>
        </Stack>
      </AppModal>

      <AppModal
        opened={showSuccessModal}
        onClose={onCloseSuccessModal}
        title="Movement Posted"
        size="lg"
        zIndex={22000}
        classNames={{
          content: classes.detailsModalContent,
          header: classes.detailsModalHeader,
          title: classes.detailsModalTitle,
          body: classes.detailsModalBody,
        }}
      >
        <Stack className={classes.detailsModalBody}>
          <Text size="xl" c="gray.3" mt="lg">
            Head back to Discord to continue.
          </Text>
          <Group justify="flex-end" mt="sm">
            <Button onClick={onCloseSuccessModal} size="sm">
              Close
            </Button>
          </Group>
        </Stack>
      </AppModal>

      {activeOrigin && tiles && (
        <MovementOriginModal
          opened={originModalOpen}
          onClose={onCloseOriginModal}
          originTile={tiles.find((t) => t.position === activeOrigin.position)!}
          originPosition={activeOrigin.position}
        />
      )}
    </>
  );
}
