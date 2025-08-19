import { useEffect, useMemo, useRef, useState } from "react";
import {
  Button,
  Group,
  Modal,
  Stack,
  Text,
  Box,
  SimpleGrid,
} from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";
import type { MapTileType, TileUnitData, EntityData } from "@/data/types";
import { useMovementStore } from "@/utils/movementStore";
import { useFactionColors } from "@/hooks/useFactionColors";
import { getColorAlias } from "@/lookup/colors";
import classes from "./MovementOriginModal.module.css";
import { MapTile } from "@/components/Map/MapTile";
import { getPlanetData } from "@/lookup/planets";
import { getGenericUnitDataByAsyncId, lookupUnit } from "@/lookup/units";
import { useGameData } from "@/hooks/useGameContext";
import { getAllEntityPlacementsForTile } from "@/utils/unitPositioning";
import { CircularFactionIcon } from "@/components/shared/CircularFactionIcon";
import { UnitMultiContextTile } from "./MovementOriginModal/UnitMultiContextTile";
import { useUser } from "@/hooks/useUser";

type Props = {
  opened: boolean;
  onClose: () => void;
  originTile: MapTileType;
  originPosition: string;
};

type Counts = {
  healthy: number;
  sustained: number;
  maxHealthy: number;
  maxSustained: number;
};

export function MovementOriginModal({
  opened,
  onClose,
  originTile,
  originPosition,
}: Props) {
  const draft = useMovementStore((s) => s.draft);
  const setCountsInStore = useMovementStore((s) => s.setCounts);
  const factionColorMap = useFactionColors();
  const game = useGameData();
  const { user } = useUser();

  // Build availability map per area -> faction -> unitType
  const availability = useMemo(() => {
    const result: Record<string, Record<string, Record<string, Counts>>> = {};
    const add = (
      areaKey: string,
      faction: string,
      unitType: string,
      total: number,
      sustained: number
    ) => {
      const byFaction = (result[areaKey] ||= {});
      const byUnit = (byFaction[faction] ||= {});
      const current = byUnit[unitType] || {
        healthy: 0,
        sustained: 0,
        maxHealthy: 0,
        maxSustained: 0,
      };
      current.maxSustained += sustained;
      current.maxHealthy += Math.max(0, total - sustained);
      byUnit[unitType] = current;
    };

    Object.values(originTile.entityPlacements).forEach((stack: any) => {
      if (stack.entityType !== "unit") return;
      const areaKey = stack.planetName
        ? `${originPosition}-${stack.planetName}`
        : `${originPosition}-space`;
      add(
        areaKey,
        stack.faction,
        stack.entityId,
        stack.count,
        stack.sustained ?? 0
      );
    });

    return result;
  }, [originTile, originPosition]);

  // Local draft initialized from store; reset when opened/draft changes
  const buildInitialLocal = () => {
    const initial: Record<
      string,
      {
        faction: string;
        unitType: string;
        healthy: number;
        sustained: number;
      }[]
    > = {};
    Object.keys(availability).forEach((areaKey) => {
      const [position, rest] = areaKey.split("-");
      const isSpace = rest === "space";
      const area = isSpace
        ? draft.origins[position]?.space
        : draft.origins[position]?.planets?.[rest];
      const list: {
        faction: string;
        unitType: string;
        healthy: number;
        sustained: number;
      }[] = [];
      if (area) {
        Object.entries(area).forEach(([faction, unitMap]) => {
          Object.entries(unitMap).forEach(([unitType, counts]) => {
            list.push({
              faction,
              unitType,
              healthy: counts.healthy,
              sustained: counts.sustained,
            });
          });
        });
      }
      initial[areaKey] = list;
    });
    return initial;
  };

  const [local, setLocal] = useState<
    Record<
      string,
      {
        faction: string;
        unitType: string;
        healthy: number;
        sustained: number;
      }[]
    >
  >(() => buildInitialLocal());

  useEffect(() => {
    if (opened) setLocal(buildInitialLocal());
  }, [opened, draft, availability]);

  // Helper to get and set a specific entry
  const upsertLocal = (
    areaKey: string,
    faction: string,
    unitType: string,
    nextHealthy: number,
    nextSustained: number
  ) => {
    const list = local[areaKey] ? [...local[areaKey]] : [];
    const idx = list.findIndex(
      (e) => e.unitType === unitType && e.faction === faction
    );
    if (nextHealthy <= 0 && nextSustained <= 0) {
      if (idx !== -1) list.splice(idx, 1);
    } else if (idx === -1) {
      list.push({
        unitType,
        faction,
        healthy: nextHealthy,
        sustained: nextSustained,
      });
    } else {
      list[idx] = {
        unitType,
        faction,
        healthy: nextHealthy,
        sustained: nextSustained,
      };
    }
    setLocal((prev) => ({ ...prev, [areaKey]: list }));
  };

  const getCurrentCounts = (
    areaKey: string,
    faction: string,
    unitType: string
  ): { healthy: number; sustained: number } => {
    const list = local[areaKey] || [];
    const found = list.find(
      (e) => e.unitType === unitType && e.faction === faction
    );
    return {
      healthy: found?.healthy || 0,
      sustained: found?.sustained || 0,
    };
  };

  const adjust = (
    areaKey: string,
    faction: string,
    unitType: string,
    field: "healthy" | "sustained",
    delta: number
  ) => {
    const caps = availability[areaKey]?.[faction]?.[unitType];
    if (!caps) return;
    const current = getCurrentCounts(areaKey, faction, unitType);
    const nextHealthy = Math.min(
      caps.maxHealthy,
      Math.max(0, current.healthy + (field === "healthy" ? delta : 0))
    );
    const nextSustained = Math.min(
      caps.maxSustained,
      Math.max(0, current.sustained + (field === "sustained" ? delta : 0))
    );
    upsertLocal(areaKey, faction, unitType, nextHealthy, nextSustained);
  };

  const handleConfirm = () => {
    // Persist to store
    Object.entries(local).forEach(([areaKey, entries]) => {
      const [position, rest] = areaKey.split("-");
      const isSpace = rest === "space";
      entries.forEach((e) => {
        setCountsInStore(
          position,
          isSpace ? { type: "space" } : { type: "planet", name: rest },
          e.faction,
          e.unitType,
          { healthy: e.healthy, sustained: e.sustained }
        );
      });
      // Clear units with zero in UI state already handled via upsertLocal
    });
    onClose();
  };

  const areaOrder = Object.keys(availability).sort((a, b) =>
    a.localeCompare(b)
  );

  // Build minimal TileUnitData from a MapTileType
  const buildTileUnitDataFromMap = (tile: MapTileType): TileUnitData => {
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
  };

  // Snapshot origin/target tiles on open to avoid background updates changing the base while editing
  const targetTileFromGame = useMemo(
    () =>
      game?.mapTiles.find((t) => t.position === draft.targetPositionId) || null,
    [game, draft.targetPositionId]
  );

  const snapshotRef = useRef<{
    origin: MapTileType;
    target: MapTileType | null;
  } | null>(null);

  useEffect(() => {
    if (!opened) return;
    const clone = <T,>(obj: T): T => JSON.parse(JSON.stringify(obj));
    snapshotRef.current = {
      origin: clone(originTile),
      target: targetTileFromGame ? clone(targetTileFromGame) : null,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened]);

  // Local preview: apply local draft to origin and target snapshot only and compute new placements
  const previewTiles = useMemo(() => {
    const baseOrigin = snapshotRef.current?.origin ?? originTile;
    const baseTarget = snapshotRef.current?.target ?? targetTileFromGame;
    const originTu = buildTileUnitDataFromMap(baseOrigin);
    const targetTu = baseTarget ? buildTileUnitDataFromMap(baseTarget) : null;

    const decFromArea = (
      tu: TileUnitData,
      areaKey: string,
      faction: string,
      unitType: string,
      healthy: number,
      sustained: number
    ) => {
      const [, rest] = areaKey.split("-");
      const isSpace = rest === "space";
      const bucket: any = isSpace ? tu.space : tu.planets?.[rest]?.entities;
      if (!bucket) return;
      const list: any[] = bucket[faction];
      if (!list) return;
      const idx = list.findIndex(
        (e) => e.entityId === unitType && e.entityType === "unit"
      );
      if (idx === -1) return;
      const cur = list[idx];
      cur.count = Math.max(0, (cur.count || 0) - healthy - sustained);
      cur.sustained = Math.max(0, (cur.sustained || 0) - sustained);
      if (cur.count === 0 && (!cur.sustained || cur.sustained === 0)) {
        list.splice(idx, 1);
        if (list.length === 0) delete bucket[faction];
      }
    };

    const addToTargetSpace = (
      tu: TileUnitData | null,
      faction: string,
      unitType: string,
      healthy: number,
      sustained: number
    ) => {
      if (!tu) return;
      const list = (tu.space[faction] ||= []);
      const idx = list.findIndex(
        (e) => e.entityId === unitType && e.entityType === "unit"
      );
      if (idx === -1) {
        list.push({
          entityId: unitType,
          entityType: "unit",
          count: healthy + sustained,
          sustained,
        });
      } else {
        list[idx].count = (list[idx].count || 0) + healthy + sustained;
        list[idx].sustained = (list[idx].sustained || 0) + sustained;
      }
    };

    Object.entries(local).forEach(([areaKey, entries]) => {
      entries.forEach(({ faction, unitType, healthy, sustained }) => {
        if (healthy <= 0 && sustained <= 0) return;
        decFromArea(originTu, areaKey, faction, unitType, healthy, sustained);
        addToTargetSpace(targetTu, faction, unitType, healthy, sustained);
      });
    });

    const originPlacements = getAllEntityPlacementsForTile(
      baseOrigin.systemId,
      originTu
    );
    const originPreview = {
      ...baseOrigin,
      entityPlacements: originPlacements,
    } as MapTileType;
    let targetPreview: MapTileType | null = null;
    if (baseTarget && targetTu) {
      const targetPlacements = getAllEntityPlacementsForTile(
        baseTarget.systemId,
        targetTu
      );
      targetPreview = {
        ...baseTarget,
        entityPlacements: targetPlacements,
      } as MapTileType;
    }
    return { originPreview, targetPreview };
  }, [originTile, targetTileFromGame, local]);

  const currentUserFaction = useMemo(() => {
    if (!user?.authenticated) return null;
    const player = game?.playerData?.find(
      (p: any) => p.discordId === (user as any)?.discord_id
    );
    return player?.faction || null;
  }, [user, game?.playerData]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={`Move from ${originPosition}`}
      size={920}
      zIndex={22000}
      classNames={{
        content: classes.modalContent,
        header: classes.modalHeader,
        title: classes.modalTitle,
        body: classes.modalBody,
      }}
    >
      <Stack gap={10} className={classes.modalBody}>
        <Box className={classes.dualPaneGrid}>
          <div className={classes.leftPane}>
            <Box className={classes.tilePreviewBox}>
              <MapTile mapTile={previewTiles.originPreview} embedded />
            </Box>
          </div>
          <div className={classes.arrowWrap}>
            <IconArrowRight size={20} color="#9aa4b2" />
          </div>
          <Box className={classes.tilePreviewBox}>
            {previewTiles.targetPreview ? (
              <MapTile mapTile={previewTiles.targetPreview} embedded />
            ) : (
              <Text size="xs" c="gray.5">
                Select a target to preview
              </Text>
            )}
          </Box>
        </Box>

        {areaOrder.length === 0 && (
          <Box>
            <Text size="sm">Move units to the target tile.</Text>
          </Box>
        )}
        {areaOrder.length > 0 &&
          (() => {
            // Build unified map: faction -> unitType -> contexts[] across all areas
            const factions = Array.from(
              new Set(
                areaOrder.flatMap((areaKey) =>
                  Object.keys(availability[areaKey] || {})
                )
              )
            ).sort((a, b) => a.localeCompare(b));

            const getAreaLabel = (areaKey: string) => {
              if (areaKey.endsWith("-space")) return "Space";
              const planetId = areaKey.split("-").slice(1).join("-");
              const pd = getPlanetData(planetId);
              return pd?.name || planetId;
            };

            const getUnitLabel = (unitType: string, faction: string) => {
              const playerForFaction = game?.playerData?.find(
                (p) => p.faction === faction
              );
              const unitMeta =
                lookupUnit(unitType, faction, playerForFaction) ||
                getGenericUnitDataByAsyncId(unitType);
              return (unitMeta?.name || unitType.toUpperCase()).replace(
                /^Factionless\s+/i,
                ""
              );
            };

            return (
              <Stack>
                {factions.map((faction) => {
                  const colorAlias = getColorAlias(
                    factionColorMap[faction]?.color
                  );
                  // unitTypes available anywhere for this faction
                  const unitTypes = Array.from(
                    new Set(
                      areaOrder.flatMap((areaKey) =>
                        Object.keys(availability[areaKey]?.[faction] || {})
                      )
                    )
                  ).sort((a, b) => a.localeCompare(b));

                  return (
                    <div key={faction} className={classes.factionBlock}>
                      <Group gap={6} className={classes.factionHeader}>
                        <CircularFactionIcon faction={faction} size={20} />
                        <Text fw={700} size="sm" c="gray.2">
                          {faction}
                        </Text>
                      </Group>
                      <SimpleGrid cols={3} verticalSpacing="md">
                        {unitTypes.map((unitType) => {
                          // Build contexts per area where this unit appears for this faction
                          const contexts = areaOrder
                            .filter(
                              (areaKey) =>
                                availability[areaKey]?.[faction]?.[unitType]
                            )
                            .map((areaKey) => {
                              const caps =
                                availability[areaKey][faction][unitType];
                              const current = getCurrentCounts(
                                areaKey,
                                faction,
                                unitType
                              );
                              return {
                                key: areaKey,
                                label: getAreaLabel(areaKey),
                                currentHealthy: current.healthy,
                                currentSustained: current.sustained,
                                maxHealthy: caps.maxHealthy,
                                maxSustained: caps.maxSustained,
                                onAdjust: (
                                  field: "healthy" | "sustained",
                                  delta: number
                                ) =>
                                  adjust(
                                    areaKey,
                                    faction,
                                    unitType,
                                    field,
                                    delta
                                  ),
                              };
                            });
                          const totalAvailable = contexts.reduce(
                            (sum, c) => sum + c.maxHealthy + c.maxSustained,
                            0
                          );
                          const canAdjust = currentUserFaction === faction;
                          return (
                            <UnitMultiContextTile
                              key={`${faction}-${unitType}`}
                              unitType={unitType}
                              unitLabel={getUnitLabel(unitType, faction)}
                              faction={faction}
                              colorAlias={colorAlias}
                              totalAvailable={totalAvailable}
                              contexts={contexts}
                              canAdjust={!!canAdjust}
                            />
                          );
                        })}
                      </SimpleGrid>
                    </div>
                  );
                })}
              </Stack>
            );
          })()}
        <Group justify="flex-end" mt={10}>
          <Button variant="light" size="xs" onClick={onClose}>
            Cancel
          </Button>
          <Button size="xs" onClick={handleConfirm}>
            Apply
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
