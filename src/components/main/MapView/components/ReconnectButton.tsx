import { Button } from "@mantine/core";
import { IconRefresh } from "@tabler/icons-react";
import { SocketReadyState } from "@/hooks/useGameSocket";
import type { GameDataState } from "@/context/GameContextProvider";

type Props = {
  gameDataState: GameDataState | null | undefined;
};

export function ReconnectButton({ gameDataState }: Props) {
  if (gameDataState?.readyState !== SocketReadyState.CLOSED) {
    return null;
  }

  return (
    <Button
      variant="filled"
      size="md"
      radius="xl"
      leftSection={<IconRefresh size={20} />}
      style={{
        position: "fixed",
        top: "80px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1000,
      }}
      onClick={gameDataState?.reconnect}
      loading={gameDataState?.isReconnecting}
    >
      Refresh
    </Button>
  );
}
