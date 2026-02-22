import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MapTileType } from "@/entities/data/types";
import { tileAdjacencies } from "@/entities/data/tileAdjacencies";
import { TILE_HEIGHT, TILE_WIDTH } from "@/domains/map/model/mapgen/tilePositioning";

type UseHexRingNavigationArgs = {
  mapTiles: MapTileType[];
  initialPosition?: string;
};

type UseHexRingNavigationResult = {
  selectedPosition: string | null;
  setSelectedPosition: (position: string | null) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  containerTabIndex: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
};

function getRingFromPosition(position: string): number {
  if (position === "000") return 0;
  const first = position[0];
  const ring = parseInt(first, 10);
  return Number.isNaN(ring) ? 0 : ring - 0; // positions like 101, 201, 301...
}

function angleBetween(cx: number, cy: number, x: number, y: number): number {
  return Math.atan2(y - cy, x - cx);
}

export function useHexRingNavigation(
  args: UseHexRingNavigationArgs
): UseHexRingNavigationResult {
  const { mapTiles, initialPosition } = args;
  const containerRef = useRef<HTMLDivElement | null>(null);

  const positionToTile = useMemo(() => {
    const map: Record<string, MapTileType> = {};
    for (const t of mapTiles) map[t.position] = t;
    return map;
  }, [mapTiles]);

  const positions = useMemo(() => mapTiles.map((t) => t.position), [mapTiles]);

  const center = useMemo(() => positionToTile["000"], [positionToTile]);

  const centerPoint = useMemo(() => {
    if (!center) return { x: 0, y: 0 };
    return {
      x: center.properties.x + TILE_WIDTH / 2,
      y: center.properties.y + TILE_HEIGHT / 2,
    };
  }, [center]);

  const angleByPosition = useMemo(() => {
    const map: Record<string, number> = {};
    for (const t of mapTiles) {
      const x = t.properties.x + TILE_WIDTH / 2;
      const y = t.properties.y + TILE_HEIGHT / 2;
      map[t.position] = angleBetween(centerPoint.x, centerPoint.y, x, y);
    }
    return map;
  }, [mapTiles, centerPoint.x, centerPoint.y]);

  const ringsOrdered = useMemo(() => {
    const byRing: Record<number, string[]> = {};
    for (const pos of positions) {
      const ring = getRingFromPosition(pos);
      if (!byRing[ring]) byRing[ring] = [];
      byRing[ring].push(pos);
    }
    for (const r of Object.keys(byRing)) {
      byRing[+r].sort((a, b) => angleByPosition[a] - angleByPosition[b]);
    }
    return byRing;
  }, [positions, angleByPosition]);

  const [selectedPosition, setSelectedPosition] = useState<string | null>(
    () => {
      if (initialPosition && positions.includes(initialPosition))
        return initialPosition;
      if (positions.includes("000")) return "000";
      return positions[0] ?? null;
    }
  );

  useEffect(() => {
    if (!selectedPosition && positions.length > 0) {
      setSelectedPosition(positions.includes("000") ? "000" : positions[0]);
    }
  }, [positions, selectedPosition]);

  const clampToExisting = useCallback(
    (pos: string | null): string | null =>
      pos && positionToTile[pos] ? pos : selectedPosition,
    [positionToTile, selectedPosition]
  );

  const selectOnRing = useCallback(
    (delta: 1 | -1) => {
      if (!selectedPosition) return;
      const ring = getRingFromPosition(selectedPosition);
      const ringList = ringsOrdered[ring] || [];
      if (ringList.length <= 1) return;
      const idx = ringList.indexOf(selectedPosition);
      const next = (idx + delta + ringList.length) % ringList.length;
      setSelectedPosition(ringList[next]);
    },
    [selectedPosition, ringsOrdered]
  );

  const selectRingNeighbor = useCallback(
    (direction: -1 | 1) => {
      if (!selectedPosition) return;
      const currentRing = getRingFromPosition(selectedPosition);
      const targetRing = currentRing + direction;
      if (targetRing < 0) return;

      const candidates = (tileAdjacencies as any)[selectedPosition]?.filter(
        (p: string | null) => {
          if (!p) return false;
          if (!positionToTile[p]) return false;
          return getRingFromPosition(p) === targetRing;
        }
      ) as string[];

      if (!candidates || candidates.length === 0) return;
      const currentAngle = angleByPosition[selectedPosition];
      const best = candidates.reduce((bestPos, p) => {
        const diffBest = Math.abs(angleByPosition[bestPos] - currentAngle);
        const diffP = Math.abs(angleByPosition[p] - currentAngle);
        return diffP < diffBest ? p : bestPos;
      }, candidates[0]);
      setSelectedPosition(best);
    },
    [selectedPosition, positionToTile, angleByPosition]
  );

  const selectInward = useCallback(
    () => selectRingNeighbor(-1),
    [selectRingNeighbor]
  );

  const selectOutward = useCallback(
    () => selectRingNeighbor(1),
    [selectRingNeighbor]
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        selectOnRing(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        selectOnRing(1);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        selectInward();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        selectOutward();
      }
    },
    [selectOnRing, selectInward, selectOutward]
  );

  // Global fallback: capture arrow keys when focus isn't on the container
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key;
      if (
        key !== "ArrowLeft" &&
        key !== "ArrowRight" &&
        key !== "ArrowUp" &&
        key !== "ArrowDown"
      ) {
        return;
      }

      const activeEl = (document.activeElement as HTMLElement | null) || null;
      const container = containerRef.current;

      // Ignore when typing in inputs or editable elements
      if (activeEl) {
        const tag = activeEl.tagName;
        const isEditable =
          (activeEl as any).isContentEditable ||
          tag === "INPUT" ||
          tag === "TEXTAREA" ||
          tag === "SELECT";
        if (isEditable) return;
      }

      // Only handle when focus is within the map container or on body (no focus)
      const withinContainer = !!(
        container &&
        activeEl &&
        container.contains(activeEl)
      );
      const noFocus = activeEl === document.body || activeEl === null;
      if (!withinContainer && !noFocus) return;

      e.preventDefault();
      if (key === "ArrowLeft") selectOnRing(-1);
      else if (key === "ArrowRight") selectOnRing(1);
      else if (key === "ArrowUp") selectInward();
      else if (key === "ArrowDown") selectOutward();
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectOnRing, selectInward, selectOutward]);

  // Auto-focus container when mounted for keyboard usage
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const timer = setTimeout(() => {
      try {
        node.focus();
      } catch (err) {
        // ignore
      }
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  // Ensure selected tile is scrolled into view
  useEffect(() => {
    if (!selectedPosition) return;
    const el = document.getElementById(`tile-${selectedPosition}`);
    if (!el) return;
    try {
      el.scrollIntoView({
        block: "center",
        inline: "center",
        behavior: "smooth",
      });
    } catch (err) {
      // ignore
    }
  }, [selectedPosition]);

  return {
    selectedPosition: clampToExisting(selectedPosition ?? null),
    setSelectedPosition,
    onKeyDown,
    containerTabIndex: 0,
    containerRef,
  } as const;
}
