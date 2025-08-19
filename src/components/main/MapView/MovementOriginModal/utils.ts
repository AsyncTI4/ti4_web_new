import type {
  MapTileType,
  TileUnitData,
  EntityData,
  PlayerDataResponse,
} from "@/data/types";
import { applyDisplacementToPlayerData } from "@/utils/displacement";
import { getAllEntityPlacementsForTile } from "@/utils/unitPositioning";

export function buildTileUnitDataFromMap(tile: MapTileType): TileUnitData {
  const space: Record<string, EntityData[]> = {};
  (tile.space || []).forEach((u: any) => {
    if (u.type !== "unit") return;
    const list = (space[u.owner] ||= []);
    list.push({
      entityId: u.entityId,
      entityType: "unit",
      count: u.amount,
      sustained: u.amountSustained,
    });
  });
  const planets: Record<string, any> = {};
  (tile.planets || []).forEach((p: any) => {
    const entities: Record<string, EntityData[]> = {};
    (p.units || []).forEach((u: any) => {
      if (u.type !== "unit") return;
      const list = (entities[u.owner] ||= []);
      list.push({
        entityId: u.entityId,
        entityType: "unit",
        count: u.amount,
        sustained: u.amountSustained,
      });
    });
    planets[p.name] = {
      controlledBy: p.controller,
      entities,
      commodities: p.commodities ?? null,
    };
  });
  return {
    space,
    planets,
    ccs: [],
    anomaly: tile.anomaly,
    production: tile.production,
    pds: null,
  } as unknown as TileUnitData;
}

type LocalEntry = {
  faction: string;
  unitType: string;
  healthy: number;
  sustained: number;
};

export function buildPreviewFromLocal(
  baseOrigin: MapTileType,
  originPosition: string,
  baseTarget: MapTileType | null,
  local: Record<string, LocalEntry[]>,
  targetPositionId: string | null
) {
  const originTu = buildTileUnitDataFromMap(baseOrigin);
  const targetTu = baseTarget ? buildTileUnitDataFromMap(baseTarget) : undefined;

  // Build minimal PlayerDataResponse with only these two tiles
  const source: PlayerDataResponse = {
    ringCount: 0,
    playerData: [] as any,
    tileUnitData: {
      [originPosition]: originTu as any,
      ...(baseTarget && targetPositionId
        ? { [targetPositionId]: targetTu as any }
        : {}),
    } as any,
    tilePositions: [],
    statTilePositions: {} as any,
    lawsInPlay: [],
    strategyCards: [],
    vpsToWin: 0,
    cardPool: {} as any,
    objectives: {} as any,
    gameRound: 0,
    gameName: "",
  } as PlayerDataResponse;

  // Convert local list to displacement draft structure
  const origins: any = {};
  const ensureOrigin = (pos: string) =>
    (origins[pos] ||= { space: {}, planets: {} });

  Object.entries(local).forEach(([areaKey, entries]) => {
    const [pos, rest] = areaKey.split("-");
    const isSpace = rest === "space";
    const origin = ensureOrigin(pos);
    entries.forEach(({ faction, unitType, healthy, sustained }) => {
      if (healthy <= 0 && sustained <= 0) return;
      const counts = { healthy, sustained };
      if (isSpace) {
        const bucket = (origin.space[faction] ||= {});
        bucket[unitType] = counts;
      } else {
        const planet = (origin.planets[rest] ||= {});
        const bucket = (planet[faction] ||= {});
        bucket[unitType] = counts;
      }
    });
  });

  const draft = {
    targetPositionId: targetPositionId,
    origins,
  } as any;

  const displaced = applyDisplacementToPlayerData(source, draft);

  const originPlacements = getAllEntityPlacementsForTile(
    baseOrigin.systemId,
    displaced.tileUnitData[originPosition] as any
  );
  const targetPlacements =
    baseTarget && targetPositionId
      ? getAllEntityPlacementsForTile(
          baseTarget.systemId,
          displaced.tileUnitData[targetPositionId] as any
        )
      : null;

  const originPreview = { ...baseOrigin, entityPlacements: originPlacements } as MapTileType;
  const targetPreview =
    baseTarget && targetPlacements
      ? ({ ...baseTarget, entityPlacements: targetPlacements } as MapTileType)
      : null;

  return { originPreview, targetPreview };
}


