import { useMemo } from "react";
import { getFactionImage } from "@/lookup/factions";
import { useFactionImages } from "./useFactionImages";

export function useFactionTokenImage(faction?: string) {
  const factionImages = useFactionImages();

  return useMemo(() => {
    if (!faction) return undefined;

    const imageData = factionImages[faction];
    return getFactionImage(faction, imageData?.image, imageData?.type);
  }, [faction, factionImages]);
}
