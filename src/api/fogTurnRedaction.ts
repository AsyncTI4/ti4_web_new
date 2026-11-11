import type { PlayerDataResponse } from "@/entities/data/types";

const redacted = new WeakMap<PlayerDataResponse, PlayerDataResponse>();

/**
 * Fog of War hides whose turn it is: a seat only learns that it is on the
 * clock itself. The bot still sends the active player, the system they are
 * acting in and the combat under way, so when the document is fogged for one
 * seat, everything about another seat's turn is dropped here. A GM looking at
 * the whole game (viewingAs null) keeps it all.
 *
 * Results are cached per document so selectors keep stable references.
 */
export function redactFogTurn(data: PlayerDataResponse): PlayerDataResponse {
  const viewingAs = data.fogView?.viewingAs;
  if (!viewingAs) return data;

  const cached = redacted.get(data);
  if (cached) return cached;

  const viewer = data.playerData.find((p) => p.faction === viewingAs);
  const viewerColor = viewer?.color ?? null;
  const viewerIsActive = Boolean(viewer?.active);

  const playerData = data.playerData.map((player) =>
    player.active && player !== viewer ? { ...player, active: false } : player,
  );

  const gameState = data.gameState;
  const fogGameState =
    gameState && !viewerIsActive
      ? {
          ...gameState,
          activePlayer: null,
          activeSystem: null,
          activeCombat:
            viewerColor &&
            gameState.activeCombat?.participantColors.includes(viewerColor)
              ? gameState.activeCombat
              : null,
        }
      : gameState;

  const result = { ...data, playerData, gameState: fogGameState };
  redacted.set(data, result);
  return result;
}
