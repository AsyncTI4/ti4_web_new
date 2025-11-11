import { Button, Group, Modal, Stack, Text } from "@mantine/core";
import { IconRefresh } from "@tabler/icons-react";
import { getDiscordOauthUrl } from "@/components/DiscordLogin";
import classes from "@/components/MapUI.module.css";
import { MovementOriginModal } from "../MovementOriginModal";
import type { ActiveOrigin } from "../hooks/useMovementMode";
import { Tile } from "@/context/types";

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
      <Modal
        opened={showAuthModal}
        onClose={onCloseAuthModal}
        title="Login Required"
        zIndex={3500}
      >
        <Stack>
          <Text size="sm">
            You must be logged into Discord to use movement mode.
          </Text>
          <Button
            component="a"
            href={getDiscordOauthUrl()}
            leftSection={<IconRefresh size={16} />}
          >
            Login with Discord
          </Button>
        </Stack>
      </Modal>

      <Modal
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
      </Modal>

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
