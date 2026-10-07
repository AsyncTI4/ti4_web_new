import { SocketReadyState } from "@/api/useGameSocket";
import type { GameDataState } from "@/state/gameContextTypes";
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
