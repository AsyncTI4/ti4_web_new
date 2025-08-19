import { useMemo } from "react";
import { Box, Button, Group, Stack, Text } from "@mantine/core";
import classesGlobal from "@/components/MapUI.module.css";
import classes from "./MovementModeBox.module.css";
import { useMovementStore } from "@/utils/movementStore";
import { useGameData } from "@/hooks/useGameContext";
import { useFactionColors } from "@/hooks/useFactionColors";
import { useSubmitMovement } from "@/hooks/useSubmitMovement";
import { getTileById } from "@/mapgen/systems";
import { CircularFactionIcon } from "@/components/shared/CircularFactionIcon";
import { Unit } from "@/components/shared/Unit";
import { Chip } from "@/components/shared/primitives/Chip";
import { getColorAlias } from "@/lookup/colors";

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
  const factionColorMap = useFactionColors();

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
    const out: {
      position: string;
      systemName: string;
      perFaction: Record<string, Record<string, number>>;
    }[] = [];
    entries.forEach(([position, originDraft]) => {
      const perFaction: Record<string, Record<string, number>> = {};
      Object.entries(originDraft.space || {}).forEach(([faction, units]) => {
        Object.entries(units).forEach(([unitType, counts]) => {
          const byFaction = (perFaction[faction] ||= {});
          byFaction[unitType] =
            (byFaction[unitType] || 0) + counts.healthy + counts.sustained;
        });
      });
      Object.values(originDraft.planets || {}).forEach((area) => {
        Object.entries(area || {}).forEach(([faction, units]) => {
          Object.entries(units).forEach(([unitType, counts]) => {
            const byFaction = (perFaction[faction] ||= {});
            byFaction[unitType] =
              (byFaction[unitType] || 0) + counts.healthy + counts.sustained;
          });
        });
      });
      const tile = tilesByPosition.get(position);
      const systemName = tile
        ? getTileById(tile.systemId)?.name || tile.systemId
        : position;
      out.push({ position, systemName, perFaction });
    });
    out.sort((a, b) => a.systemName.localeCompare(b.systemName));
    return out;
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

function buildApiPayloadFromDraft(
  draft: ReturnType<typeof useMovementStore.getState>["draft"],
  factionColorMap: FactionColorMap
) {
  const displacement: Record<
    string,
    { unitType: string; colorID: string; counts: [number, number] }[]
  > = {};
  Object.entries(draft.origins).forEach(([position, origin]) => {
    Object.entries(origin.space || {}).forEach(([faction, units]) => {
      Object.entries(units).forEach(([unitType, counts]) => {
        const key = `${position}-space`;
        const colorID = factionColorMap[faction]?.color || faction;
        (displacement[key] ||= []).push({
          unitType,
          colorID,
          counts: [counts.healthy, counts.sustained],
        });
      });
    });
    Object.entries(origin.planets || {}).forEach(([planet, area]) => {
      Object.entries(area || {}).forEach(([faction, units]) => {
        Object.entries(units).forEach(([unitType, counts]) => {
          const key = `${position}-${planet}`;
          const colorID = factionColorMap[faction]?.color || faction;
          (displacement[key] ||= []).push({
            unitType,
            colorID,
            counts: [counts.healthy, counts.sustained],
          });
        });
      });
    });
  });

  return {
    targetPosition: draft.targetPositionId!,
    displacement,
  };
}
