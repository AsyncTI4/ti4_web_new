import { getColorAlias } from "@/entities/lookup/colors";
import { useFactionColors } from "@/hooks/useFactionColors";
import { useColorOverrides } from "@/hooks/useGameContext";

/** Resolves a faction's unit color alias, preferring a "try colors" override. */
export function useResolveColorAlias() {
  const factionColorMap = useFactionColors();
  const { colorOverrides } = useColorOverrides();

  return (faction: string) =>
    colorOverrides[faction] ||
    getColorAlias(factionColorMap?.[faction]?.color);
}
