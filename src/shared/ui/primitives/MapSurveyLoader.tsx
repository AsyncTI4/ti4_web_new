import { useEffect, useState } from "react";
import { Button } from "@mantine/core";
import { IconRefresh } from "@tabler/icons-react";
import cx from "clsx";

import { generateHexagonPoints } from "@/utils/hexagonUtils";
import Caption from "../Caption/Caption";
import { MapViewportCenter } from "../MapViewportCenter";
import hud from "../hudChrome.module.css";
import classes from "./MapSurveyLoader.module.css";

/**
 * Circumradius of one survey hex. The real board's tiles are 345px across; this
 * is a diagram of the board, not a preview of it, so it is sized to sit beside
 * the 300px game-state panel rather than to match the map's scale.
 */
const HEX_RADIUS = 30;

/** Rings around Mecatol. Three is the standard six-player galaxy: 37 systems. */
const RING_COUNT = 3;

/** Room for the 1px stroke at the lattice's outer edge. */
const STROKE_CLEARANCE = 1;

/** How far behind its inner neighbour each ring's sweep lights up. */
const RING_DELAY_MS = 200;

/**
 * The board's geometry as flat-top hexes in axial coordinates, grouped by ring
 * so the sweep can light one ring at a time from a handful of animated nodes
 * instead of thirty-seven.
 */
function buildSurveyLattice() {
  const rowHeight = Math.sqrt(3) * HEX_RADIUS;
  const cells: { ring: number; cx: number; cy: number }[] = [];

  for (let q = -RING_COUNT; q <= RING_COUNT; q++) {
    for (let r = -RING_COUNT; r <= RING_COUNT; r++) {
      const ring = Math.max(Math.abs(q), Math.abs(r), Math.abs(q + r));
      if (ring > RING_COUNT) continue;
      cells.push({
        ring,
        cx: 1.5 * HEX_RADIUS * q,
        cy: rowHeight * (r + q / 2),
      });
    }
  }

  const originX = 1.5 * HEX_RADIUS * RING_COUNT + HEX_RADIUS + STROKE_CLEARANCE;
  const originY = rowHeight * (RING_COUNT + 0.5) + STROKE_CLEARANCE;

  const toPoints = (cx: number, cy: number) =>
    generateHexagonPoints(cx + originX, cy + originY, HEX_RADIUS)
      .map(({ x, y }) => `${x.toFixed(2)},${y.toFixed(2)}`)
      .join(" ");

  const rings = Array.from({ length: RING_COUNT + 1 }, (_, ring) =>
    cells.filter((cell) => cell.ring === ring).map((c) => toPoints(c.cx, c.cy)),
  );

  return {
    rings,
    /** Mecatol Rex: the one system every board has in the same place. */
    core: toPoints(0, 0),
    width: originX * 2,
    height: originY * 2,
  };
}

const LATTICE = buildSurveyLattice();

/** Elapsed time only becomes information once a load stops feeling instant. */
const SLOW_AFTER_MS = 2500;
/** Past this, the wait itself is the news and deserves a sentence. */
const STALLED_AFTER_MS = 12000;
const TICK_MS = 100;

function useElapsedMs() {
  const [elapsedMs, setElapsedMs] = useState(0);

  useEffect(() => {
    const startedAt = performance.now();
    const id = window.setInterval(
      () => setElapsedMs(performance.now() - startedAt),
      TICK_MS,
    );
    return () => window.clearInterval(id);
  }, []);

  return elapsedMs;
}

/**
 * Owns the ticking clock so the lattice above it never re-renders, and escalates
 * in two steps: silent while the load is quick, timed once it isn't, and
 * explained once it is genuinely slow.
 */
function SurveyProgress({ gameId }: { gameId: string }) {
  const elapsedMs = useElapsedMs();

  return (
    <>
      <div className={classes.metaRow}>
        <span className={classes.gameId}>{gameId}</span>
        <span
          className={classes.elapsed}
          data-shown={elapsedMs >= SLOW_AFTER_MS}
          aria-hidden="true"
        >
          {(elapsedMs / 1000).toFixed(1)}s
        </span>
      </div>
      {elapsedMs >= STALLED_AFTER_MS && (
        <p className={classes.note}>
          Slower than usual. The bot may be rebuilding this game&rsquo;s data.
        </p>
      )}
    </>
  );
}

export type MapSurveyLoaderProps = {
  gameId: string;
  /** `failed` freezes the sweep and turns the readout over to the error. */
  status?: "surveying" | "failed";
  /** Shown under the failure headline in place of the elapsed readout. */
  errorMessage?: string;
  onRetry?: () => void;
};

/**
 * The map field while a game's state is in flight.
 *
 * There is no board to skeleton yet, so the field draws what is knowable
 * regardless of which game is loading — the galaxy's shape, and Mecatol at the
 * centre of it — and runs a sweep outward through the rings to report that the
 * fetch is live. The same instrument carries the failure: the sweep stops, the
 * lattice goes cold, and the readout hands over to a reason and a retry.
 */
export function MapSurveyLoader({
  gameId,
  status = "surveying",
  errorMessage,
  onRetry,
}: MapSurveyLoaderProps) {
  const failed = status === "failed";

  return (
    <MapViewportCenter>
      <div
        className={cx(classes.instrument, failed && classes.failed)}
        role="status"
      >
        <span className={cx(classes.bracket, classes.bracketTopLeft)} />
        <span className={cx(classes.bracket, classes.bracketTopRight)} />
        <span className={cx(classes.bracket, classes.bracketBottomLeft)} />
        <span className={cx(classes.bracket, classes.bracketBottomRight)} />

        <div className={classes.field}>
          <span className={classes.bloom} />
          <svg
            className={classes.lattice}
            viewBox={`0 0 ${LATTICE.width} ${LATTICE.height}`}
            width={LATTICE.width}
            height={LATTICE.height}
            aria-hidden="true"
            focusable="false"
          >
            <g className={classes.latticeBase}>
              {LATTICE.rings.flat().map((points) => (
                <polygon key={points} points={points} />
              ))}
            </g>

            {!failed &&
              LATTICE.rings.map((points, ring) => (
                <g
                  key={ring}
                  className={classes.latticeSweep}
                  style={{ animationDelay: `${ring * RING_DELAY_MS}ms` }}
                >
                  {points.map((p) => (
                    <polygon key={p} points={p} />
                  ))}
                </g>
              ))}

            <polygon className={classes.core} points={LATTICE.core} />
          </svg>
        </div>

        <div className={classes.readout}>
          {/* Same construction as the deck's round line and its section
              captions, because this readout is what those replace. */}
          <Caption size="sm" rule c={failed ? "rgb(var(--gd-red))" : undefined}>
            {failed ? "Link failed" : "Acquiring game state"}
          </Caption>

          {failed ? (
            <>
              <div className={classes.metaRow}>
                <span className={classes.gameId}>{gameId}</span>
              </div>
              <p className={classes.note}>
                {errorMessage ??
                  "The game data service did not respond. Nothing has changed on the board."}
              </p>
              {onRetry && (
                <Button
                  variant="default"
                  size="xs"
                  className={cx(hud.hudButton, classes.retry)}
                  leftSection={<IconRefresh size={13} />}
                  onClick={onRetry}
                >
                  Retry
                </Button>
              )}
            </>
          ) : (
            <SurveyProgress gameId={gameId} />
          )}
        </div>
      </div>
    </MapViewportCenter>
  );
}

export default MapSurveyLoader;
