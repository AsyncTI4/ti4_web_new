import { SocketReadyState } from "@/hooks/useGameSocket";
import type { GameDataState } from "@/app/providers/context/types";
import { FloatingRefreshButton } from "@/shared/ui/FloatingRefreshButton";

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
