const UNKNOWN_FACTION_PREFIX = "fow:";

/**
 * Resolves a control-token/CC "faction" value that may be a real faction, or a
 * "fow:<color>" sentinel the backend substitutes when the viewer can't identify that
 * player (see WebTileUnitData#redactControlIdentities). The colored base token should
 * always render; the faction icon overlay should only render when identified.
 */
export function resolveFactionIdentity(value: string): {
  faction: string | undefined;
  rawColor: string | undefined;
} {
  if (value.startsWith(UNKNOWN_FACTION_PREFIX)) {
    return { faction: undefined, rawColor: value.slice(UNKNOWN_FACTION_PREFIX.length) };
  }
  return { faction: value, rawColor: undefined };
}
