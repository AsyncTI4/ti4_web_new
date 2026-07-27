import { useGameDataState } from "@/hooks/useGameContext";
import { GameDataFetchError } from "@/hooks/usePlayerData";
import { MapSurveyLoader } from "@/shared/ui/primitives/MapSurveyLoader";

type Props = {
  gameId: string;
};

/**
 * What a player can do about it, not what the request did. A 404 is a wrong game
 * id and no amount of retrying fixes it; a 5xx is the bot being busy, which
 * retrying usually does.
 */
function describeFailure(error: Error | null): string | undefined {
  if (!(error instanceof GameDataFetchError)) return undefined;
  if (error.status === 404) {
    return "No game data exists under this id. Check the game name, or ask the bot to rebuild it.";
  }
  if (error.status === 403 || error.status === 401) {
    return "This game's data is not public. Log in with the Discord account that plays in it.";
  }
  if (error.status >= 500) {
    return `The game data service answered ${error.status}. Nothing has changed on the board — a retry usually clears it.`;
  }
  return `The game data service refused the request (${error.status}).`;
}

/**
 * The map field before its game state arrives, and after that state fails to.
 * Holds the map tab's whole no-data case so the board, the HUD decks and the
 * floating controls only ever mount over real data.
 */
export function MapLoadingState({ gameId }: Props) {
  const dataState = useGameDataState();
  const failed = dataState?.isError ?? false;

  return (
    <MapSurveyLoader
      gameId={gameId}
      status={failed ? "failed" : "surveying"}
      errorMessage={
        failed ? describeFailure(dataState?.error ?? null) : undefined
      }
      onRetry={failed ? dataState?.refetch : undefined}
    />
  );
}

export default MapLoadingState;
