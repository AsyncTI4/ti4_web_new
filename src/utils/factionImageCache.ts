import type { FactionImageMap } from "@/app/providers/context/types";

const STORAGE_KEY = "factionImageCache";
const CACHE_VERSION = 1;
const MAX_CACHE_AGE_MS = 30 * 24 * 60 * 60 * 1000;

export type CachedGameFactionImages = {
  factionImages: FactionImageMap;
  updatedAt: number;
};

export type FactionImageCache = {
  version: typeof CACHE_VERSION;
  games: Record<string, CachedGameFactionImages>;
};

const EMPTY_CACHE: FactionImageCache = {
  version: CACHE_VERSION,
  games: {},
};

const listeners = new Set<() => void>();
let cacheSnapshot: FactionImageCache | undefined;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseFactionImages(value: unknown): FactionImageMap {
  if (!isRecord(value)) return {};

  return Object.entries(value).reduce<FactionImageMap>(
    (factionImages, [faction, imageData]) => {
      if (
        faction.length > 0 &&
        isRecord(imageData) &&
        typeof imageData.image === "string" &&
        typeof imageData.type === "string"
      ) {
        factionImages[faction] = {
          image: imageData.image,
          type: imageData.type,
        };
      }

      return factionImages;
    },
    {},
  );
}

function parseCache(value: unknown): FactionImageCache {
  if (
    !isRecord(value) ||
    value.version !== CACHE_VERSION ||
    !isRecord(value.games)
  ) {
    return EMPTY_CACHE;
  }

  const games = Object.entries(value.games).reduce<
    FactionImageCache["games"]
  >((cachedGames, [gameId, gameData]) => {
    if (
      gameId.length === 0 ||
      !isRecord(gameData) ||
      !Number.isFinite(gameData.updatedAt)
    ) {
      return cachedGames;
    }

    cachedGames[gameId] = {
      factionImages: parseFactionImages(gameData.factionImages),
      updatedAt: gameData.updatedAt as number,
    };
    return cachedGames;
  }, {});

  return { version: CACHE_VERSION, games };
}

function readCache(): FactionImageCache {
  if (typeof window === "undefined") return EMPTY_CACHE;

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? parseCache(JSON.parse(stored) as unknown) : EMPTY_CACHE;
  } catch (error) {
    console.warn("Failed to load cached faction images", error);
    return EMPTY_CACHE;
  }
}

function factionImageMapsEqual(
  first: FactionImageMap,
  second: FactionImageMap,
) {
  const firstFactions = Object.keys(first);
  const secondFactions = Object.keys(second);

  return (
    firstFactions.length === secondFactions.length &&
    firstFactions.every(
      (faction) =>
        first[faction]?.image === second[faction]?.image &&
        first[faction]?.type === second[faction]?.type,
    )
  );
}

function emitCacheChange() {
  listeners.forEach((listener) => listener());
}

function persistCache(nextCache: FactionImageCache) {
  cacheSnapshot = nextCache;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextCache));
  } catch (error) {
    console.warn("Failed to cache faction images", error);
  }

  emitCacheChange();
}

function handleStorageChange(event: StorageEvent) {
  if (event.key !== null && event.key !== STORAGE_KEY) return;
  cacheSnapshot = readCache();
  emitCacheChange();
}

export function getFactionImageCacheSnapshot(): FactionImageCache {
  cacheSnapshot ??= readCache();
  return cacheSnapshot;
}

export function getEmptyFactionImageCacheSnapshot(): FactionImageCache {
  return EMPTY_CACHE;
}

export function subscribeToFactionImageCache(listener: () => void) {
  listeners.add(listener);

  if (listeners.size === 1 && typeof window !== "undefined") {
    window.addEventListener("storage", handleStorageChange);
  }

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && typeof window !== "undefined") {
      window.removeEventListener("storage", handleStorageChange);
    }
  };
}

/** Retains only recent cache entries that still have a persisted game tab. */
export function pruneFactionImageCache(
  persistedGameIds: readonly string[],
  now = Date.now(),
) {
  const currentCache = getFactionImageCacheSnapshot();
  const persistedGames = new Set(persistedGameIds);
  const oldestAllowedUpdate = now - MAX_CACHE_AGE_MS;
  const retainedGames = Object.fromEntries(
    Object.entries(currentCache.games).filter(
      ([gameId, gameData]) =>
        persistedGames.has(gameId) &&
        gameData.updatedAt >= oldestAllowedUpdate,
    ),
  );

  if (
    Object.keys(retainedGames).length === Object.keys(currentCache.games).length
  ) {
    return;
  }

  persistCache({
    version: CACHE_VERSION,
    games: retainedGames,
  });
}

export function storeFactionImagesForGame(
  gameId: string,
  factionImages: FactionImageMap,
) {
  if (!gameId) return;

  const normalizedFactionImages = parseFactionImages(factionImages);
  const currentCache = getFactionImageCacheSnapshot();
  const currentGame = currentCache.games[gameId];

  if (
    currentGame &&
    factionImageMapsEqual(currentGame.factionImages, normalizedFactionImages)
  ) {
    return;
  }

  persistCache({
    version: CACHE_VERSION,
    games: {
      ...currentCache.games,
      [gameId]: {
        factionImages: normalizedFactionImages,
        updatedAt: Date.now(),
      },
    },
  });
}
