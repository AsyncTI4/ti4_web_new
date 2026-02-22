import { PlotCardInfo } from "@/entities/data/types";
import { plots } from "@/entities/data/plots";

const plotsMap = new Map<number, PlotCardInfo>();
plots.forEach((obj) => {
  plotsMap.set(obj.identifier, obj);
});

/**
 * Get plot card info
 */
export function getPlotCardInfo(
  id: number
): PlotCardInfo | undefined {
  return plotsMap.get(id);
}