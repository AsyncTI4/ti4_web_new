import { useSyncExternalStore } from "react";
import {
  getEmptyFactionImageCacheSnapshot,
  getFactionImageCacheSnapshot,
  subscribeToFactionImageCache,
} from "@/utils/factionImageCache";

export function useFactionImageCache() {
  return useSyncExternalStore(
    subscribeToFactionImageCache,
    getFactionImageCacheSnapshot,
    getEmptyFactionImageCacheSnapshot,
  );
}
