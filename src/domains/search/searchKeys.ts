/**
 * The kinds of thing board search can find. Each one renders somewhere on the
 * board or in a player area, tagged with a `data-search-key` built here.
 */
export type SearchKind =
  | "planet"
  | "system"
  | "faction"
  | "tech"
  | "relic"
  | "leader"
  | "promissory"
  | "secret"
  | "objective"
  | "law"
  | "strategy";

export type SearchKey = `${SearchKind}:${string}`;

export function searchKey(kind: SearchKind, id: string): SearchKey {
  return `${kind}:${id}`;
}

/**
 * Where a target is drawn. Map targets live inside the zoomed board, so their
 * highlight is scaled up to survive the zoom; a hex (a system, or a player's
 * stat area off the board's edge) highlights its own outline rather than its
 * rectangular box.
 */
export type SearchScope = "map" | "map-tile";

/** Attributes that make an element findable by board search. */
export function searchTarget(key: SearchKey, scope?: SearchScope) {
  return {
    "data-search-key": key,
    ...(scope ? { "data-search-scope": scope } : {}),
  };
}
