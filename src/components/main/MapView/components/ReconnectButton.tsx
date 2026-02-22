import { SocketReadyState } from "@/hooks/useGameSocket";
import type { GameDataState } from "@/context/types";
import { FloatingRefreshButton } from "@/components/shared/FloatingRefreshButton";

type Props = {
  gameDataState: GameDataState | null | undefined;
};

export function ReconnectButton({ gameDataState }: Props) {
  if (gameDataState?.readyState !== SocketReadyState.CLOSED) {
    return null;
  }

  return (
    <FloatingRefreshButton
      onClick={gameDataState?.reconnect}
      loading={gameDataState?.isReconnecting}
    />
  );
}
