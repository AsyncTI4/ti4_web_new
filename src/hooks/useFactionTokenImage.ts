import { useFactionImageUrl } from "./useFactionImages";

export function useFactionTokenImage(faction?: string) {
  const url = useFactionImageUrl(faction ?? "");
  return faction ? url : undefined;
}
