import { useSearchParams } from "react-router-dom";

const VIEW_AS_PARAM = "viewAs";

export function isFogOfWarGameId(gameId: string): boolean {
  return gameId.toLowerCase().startsWith("fow");
}

/**
 * The seat a Fog of War GM is looking through, kept in the URL (?viewAs=faction)
 * so a reload or a shared link keeps the same view. Null means the whole game.
 */
export function useFogViewAs(): [string | null, (faction: string | null) => void] {
  const [searchParams, setSearchParams] = useSearchParams();

  const setViewAs = (faction: string | null) => {
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);
        if (faction) next.set(VIEW_AS_PARAM, faction);
        else next.delete(VIEW_AS_PARAM);
        return next;
      },
      { replace: true },
    );
  };

  return [searchParams.get(VIEW_AS_PARAM), setViewAs];
}
