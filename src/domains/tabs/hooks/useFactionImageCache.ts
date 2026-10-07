import { useSyncExternalStore } from "react";
import {
  getEmptyFactionImageCacheSnapshot,
  getFactionImageCacheSnapshot,
  subscribeToFactionImageCache,
} from "@/entities/game/factionImageCache";

export function useFactionImageCache() {
  return useSyncExternalStore(
    subscribeToFactionImageCache,
    getFactionImageCacheSnapshot,
    getEmptyFactionImageCacheSnapshot,
  );
}
