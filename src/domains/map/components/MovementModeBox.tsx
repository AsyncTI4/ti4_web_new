import { useMemo } from "react";
import { Box, Button, Group, Stack, Text } from "@mantine/core";
import classesGlobal from "@/shared/ui/map/MapUI.module.css";
import classes from "./MovementModeBox.module.css";
import { useMovementStore } from "@/utils/movementStore";
import { useGameData } from "@/hooks/useGameContext";
import {
  useFactionColors,
  useOriginalFactionColors,
} from "@/hooks/useFactionColors";
import { useSubmitMovement } from "@/hooks/useSubmitMovement";
import { getTileById } from "@/domains/map/model/mapgen/systems";
import { CircularFactionIcon } from "@/shared/ui/CircularFactionIcon";
import { Unit } from "@/shared/ui/Unit";
import { Chip } from "@/shared/ui/primitives/Chip";
import { getColorAlias } from "@/entities/lookup/colors";

type Props = {
  gameId: string;
  onCancel: () => void;
  onReset: () => void;
  onSuccess: () => void;
};

export function MovementModeBox({
  gameId,
  onCancel,
  onReset,
  onSuccess,
}: Props) {
  const clearAll = useMovementStore((s) => s.clearAll);
  const draft = useMovementStore((s) => s.draft);
  const game = useGameData();
  const factionColorMap = useOriginalFactionColors();

  const submitMovement = useSubmitMovement(gameId, {
    onSuccess: () => {
      clearAll();
      onSuccess();
    },
  });

  const entries = Object.entries(draft.origins);

  const targetSystemId = useMemo(() => {
    if (!game?.tilePositions || !draft.targetPositionId) return null;
    const entry = (game.tilePositions || []).find((p: string) =>
      p.startsWith(`${draft.targetPositionId}:`)
    );
    return entry ? entry.split(":")[1] : null;
  }, [game?.tilePositions, draft.targetPositionId]);

  const targetSystemName = useMemo(() => {
    if (!targetSystemId) return null;
    return getTileById(targetSystemId)?.name || null;
  }, [targetSystemId]);

  const originsSummary = useMemo(() => {
    const tilesByPosition = new Map(
      (game?.mapTiles || []).map((t) => [t.position, t])
    );

    const summaries = entries.map(([position, originDraft]) => {
      const perFaction = buildFactionUnitSummary(originDraft);
      const systemName = getSystemName(position, tilesByPosition);
      return { position, systemName, perFaction };
    });

    summaries.sort((a, b) => a.systemName.localeCompare(b.systemName));
    return summaries;
  }, [entries, game?.mapTiles]);

  const handleSubmit = () => {
    if (!draft.targetPositionId) return;
    const payload = buildApiPayloadFromDraft(draft, factionColorMap);
    submitMovement.mutate(payload);
  };

  const isConfirmDisabled = !draft.targetPositionId || entries.length === 0;

  return (
    <Box className={classesGlobal.movementBox}>
      <Stack gap={6} w="100%">
        <Text
          size="md"
          ff="heading"
          className={classesGlobal.movementBannerTitle}
        >
          {`Moving to `}
          <span className={classesGlobal.movementBannerTargetName}>
            {targetSystemName || draft.targetPositionId}{" "}
            {targetSystemName && `(${draft.targetPositionId})`}
          </span>
        </Text>

        <div className={classes.summaryWrap}>
          {entries.length === 0 ? (
            <Text size="xs" c="gray.4">
              No movements selected.
            </Text>
          ) : (
            originsSummary.map((origin) => {
              const factionKeys = Object.keys(origin.perFaction).sort((a, b) =>
                a.localeCompare(b)
              );
              return (
                <div key={origin.position} className={classes.originRow}>
                  <Stack gap={8}>
                    <div className={classes.originPill}>
                      {origin.systemName}
                    </div>
                    {factionKeys.map((faction) => {
                      const colorAlias = getColorAlias(
                        factionColorMap[faction]?.color || faction
                      );
                      const unitEntries = Object.entries(
                        origin.perFaction[faction]
                      ).sort((a, b) => a[0].localeCompare(b[0]));
                      return (
                        <Group
                          key={`${origin.position}-${faction}`}
                          gap={6}
                          align="center"
                          wrap="wrap"
                          className={classes.factionGroup}
                        >
                          <CircularFactionIcon faction={faction} size={14} />
                          {unitEntries.map(([unitType, total]) => (
                            <Chip
                              key={`${origin.position}-${faction}-${unitType}`}
                              className={classes.unitChip}
                              accent="gray"
                              p={4}
                            >
                              <div className={classes.unitIconWrap}>
                                <Unit
                                  unitType={unitType}
                                  colorAlias={colorAlias}
                                  faction={faction}
                                  style={{
                                    width: 18,
                                    height: 18,
                                    objectFit: "contain",
                                  }}
                                />
                              </div>
                              <Text size="sm" c="gray.1" fw={600}>
                                {unitType.toUpperCase()}
                              </Text>
                              <Text size="sm" c="gray.3">
                                ({total})
                              </Text>
                            </Chip>
                          ))}
                        </Group>
                      );
                    })}
                  </Stack>
                </div>
              );
            })
          )}
        </div>

        {submitMovement.isError && (
          <Text size="xs" c="red.5">
            Failed to submit movement.
          </Text>
        )}

        <Group
          gap="xs"
          justify="flex-end"
          mt="sm"
          className={classes.actionsRow}
        >
          <Button
            variant="light"
            color="red"
            size="xs"
            onClick={onCancel}
            disabled={submitMovement.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="light"
            color="gray"
            size="xs"
            onClick={onReset}
            disabled={submitMovement.isPending}
          >
            Reset
          </Button>
          <Button
            variant="filled"
            size="xs"
            onClick={handleSubmit}
            loading={submitMovement.isPending}
            disabled={isConfirmDisabled}
          >
            Confirm
          </Button>
        </Group>
      </Stack>
    </Box>
  );
}

type FactionColorMap = ReturnType<typeof useFactionColors>;

type DisplacementEntry = {
  unitType: string;
  colorID: string;
  counts: [number, number];
};

type DisplacementMap = Record<string, DisplacementEntry[]>;

type UnitCounts = {
  healthy: number;
  sustained: number;
};

type FactionUnitsMap = Record<string, Record<string, number>>;

function addUnitsToFactionMap(
  factionMap: FactionUnitsMap,
  faction: string,
  unitType: string,
  counts: UnitCounts
) {
  const factionUnits = (factionMap[faction] ||= {});
  const totalCount = counts.healthy + counts.sustained;
  factionUnits[unitType] = (factionUnits[unitType] || 0) + totalCount;
}

function processUnitsArea(
  factionMap: FactionUnitsMap,
  unitsArea: Record<string, Record<string, UnitCounts>> | undefined
) {
  if (!unitsArea) return;

  Object.entries(unitsArea).forEach(([faction, units]) => {
    Object.entries(units).forEach(([unitType, counts]) => {
      addUnitsToFactionMap(factionMap, faction, unitType, counts);
    });
  });
}

function buildFactionUnitSummary(originDraft: {
  space?: Record<string, Record<string, UnitCounts>>;
  planets?: Record<string, Record<string, Record<string, UnitCounts>>>;
}): FactionUnitsMap {
  const factionMap: FactionUnitsMap = {};

  processUnitsArea(factionMap, originDraft.space);

  if (originDraft.planets) {
    Object.values(originDraft.planets).forEach((planetArea) => {
      processUnitsArea(factionMap, planetArea);
    });
  }

  return factionMap;
}

function getSystemName(
  position: string,
  tilesByPosition: Map<string, { systemId: string }>
): string {
  const tile = tilesByPosition.get(position);
  if (!tile) return position;

  return getTileById(tile.systemId)?.name || tile.systemId;
}

function addDisplacementEntry(
  displacement: DisplacementMap,
  locationKey: string,
  faction: string,
  unitType: string,
  counts: UnitCounts,
  factionColorMap: FactionColorMap
) {
  const colorID = factionColorMap[faction]?.color || faction;
  (displacement[locationKey] ||= []).push({
    unitType,
    colorID,
    counts: [counts.healthy, counts.sustained],
  });
}

function processSpaceUnits(
  displacement: DisplacementMap,
  position: string,
  spaceUnits: Record<string, Record<string, UnitCounts>> | undefined,
  factionColorMap: FactionColorMap
) {
  if (!spaceUnits) return;

  const locationKey = `${position}-space`;
  Object.entries(spaceUnits).forEach(([faction, units]) => {
    Object.entries(units).forEach(([unitType, counts]) => {
      addDisplacementEntry(
        displacement,
        locationKey,
        faction,
        unitType,
        counts,
        factionColorMap
      );
    });
  });
}

function processPlanetUnits(
  displacement: DisplacementMap,
  position: string,
  planets:
    | Record<string, Record<string, Record<string, UnitCounts>>>
    | undefined,
  factionColorMap: FactionColorMap
) {
  if (!planets) return;

  Object.entries(planets).forEach(([planetName, area]) => {
    if (!area) return;

    const locationKey = `${position}-${planetName}`;
    Object.entries(area).forEach(([faction, units]) => {
      Object.entries(units).forEach(([unitType, counts]) => {
        addDisplacementEntry(
          displacement,
          locationKey,
          faction,
          unitType,
          counts,
          factionColorMap
        );
      });
    });
  });
}

function buildApiPayloadFromDraft(
  draft: ReturnType<typeof useMovementStore.getState>["draft"],
  factionColorMap: FactionColorMap
) {
  const displacement: DisplacementMap = {};

  Object.entries(draft.origins).forEach(([position, origin]) => {
    processSpaceUnits(displacement, position, origin.space, factionColorMap);
    processPlanetUnits(displacement, position, origin.planets, factionColorMap);
  });

  return {
    targetPosition: draft.targetPositionId!,
    displacement,
  };
}
