import { useCallback } from "react";
import { MapTileType, PlanetMapTile, UnitMapTile } from "@/entities/data/types";
import { useLiveAnnouncer } from "./useLiveAnnouncer";
import { getPlanetData } from "@/entities/lookup/planets";
import { getGenericUnitDataByAsyncId, getUnitData } from "@/entities/lookup/units";

type Options = {
  speakWithSpeechSynthesis?: boolean;
};

export function useTileVoiceOver(options?: Options) {
  const { announce } = useLiveAnnouncer("polite");
  const speakBrowser =
    typeof window !== "undefined" && "speechSynthesis" in window;

  const buildDescription = useCallback((tile: MapTileType): string => {
    const parts: string[] = [];

    // Start with ring position only
    parts.push(`${tile.position}`);

    if (tile.anomaly) parts.push("Anomaly present");
    if (tile.hasTechSkips) parts.push("Tech skip");
    if (tile.tokens?.length) parts.push(`${tile.tokens.length} tokens`);

    const planets: PlanetMapTile[] = tile.planets || [];
    if (planets.length > 0) {
      const details = planets
        .map((p) => {
          const base = getPlanetData(p.name);
          if (!base) return p.name;
          return `${base.name}: ${base.resources} resources, ${base.influence} influence`;
        })
        .join("; ");
      parts.push(`Planets: ${details}`);
    }

    const summarizeUnits = (units: UnitMapTile[]): string | null => {
      if (!units || units.length === 0) return null;
      const counts: Record<string, number> = {};
      for (const u of units) {
        const asyncId = u.entityId;
        const unitData =
          getGenericUnitDataByAsyncId(asyncId) || getUnitData(asyncId);
        const key = (
          unitData?.baseType ||
          unitData?.name ||
          asyncId ||
          "unit"
        ).toLowerCase();
        counts[key] = (counts[key] || 0) + u.amount;
      }
      const pluralize = (label: string, count: number) => {
        const irregular: Record<string, string> = {
          infantry: "infantry",
          mech: "mechs",
          fighter: "fighters",
          carrier: "carriers",
          cruiser: "cruisers",
          destroyer: "destroyers",
          dreadnought: "dreadnoughts",
          warsun: "war suns",
          "war sun": "war suns",
          pds: "PDS",
          spacedock: "spacedocks",
          "space dock": "spacedocks",
        };
        const lbl = label.replace(/\s+/g, " ");
        const lower = lbl.toLowerCase();
        const word = irregular[lower] || `${lbl}${count === 1 ? "" : "s"}`;
        return `${count} ${word}`;
      };
      const summary = Object.entries(counts)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([label, count]) => pluralize(label, count))
        .join(", ");
      return summary ? `Units: ${summary}` : null;
    };

    const spaceSummary = summarizeUnits(tile.space || []);
    // Include planet units in the summary as well
    const planetUnitsAll = planets.flatMap((p) => p.units || []);
    const groundSummary = summarizeUnits(planetUnitsAll);

    if (spaceSummary && groundSummary) {
      parts.push(
        `${spaceSummary}; On planets: ${groundSummary.replace("Units: ", "")}`
      );
    } else if (spaceSummary) {
      parts.push(spaceSummary);
    } else if (groundSummary) {
      parts.push(`On planets: ${groundSummary.replace("Units: ", "")}`);
    }

    if (tile.controller) parts.push(`Controlled by ${tile.controller}`);

    return parts.join(". ");
  }, []);

  const speak = useCallback(
    (text: string) => {
      announce(text);
      if (!options?.speakWithSpeechSynthesis) return;
      if (!speakBrowser || !window.speechSynthesis) return;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      try {
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        // ignore
      }
    },
    [announce, options?.speakWithSpeechSynthesis, speakBrowser]
  );

  const announceTile = useCallback(
    (tile: MapTileType | undefined) => {
      if (!tile) return;
      const text = buildDescription(tile);
      speak(text);
    },
    [buildDescription, speak]
  );

  return { announceTile, buildDescription } as const;
}
