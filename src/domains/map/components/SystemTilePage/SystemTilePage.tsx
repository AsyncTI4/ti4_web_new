import { Tile } from "../Tile";
import {
  HEX_SQUARE_WIDTH,
  HEX_SQUARE_HEIGHT,
  MAX_HEAT,
  HEX_GRID_SIZE,
  HEX_VERTICES,
  placeSpaceEntities,
} from "@/entities/positioning";
import { parsePlanetsFromCoords } from "@/entities/positioning/coordinateUtils";
import type { TileUnitData } from "@/entities/data/types";
import classes from "./SystemTilePage.module.css";

type SystemTileDisplayProps = {
  systemId: string;
  tileUnitData: TileUnitData;
};

const SAMPLE_TILE_UNIT_DATA: TileUnitData = {
  space: {
    neutral: [
      { entityId: "gamma", entityType: "token", count: 1, sustained: null },
    ],
    franken10: [
      { entityId: "cv", entityType: "unit", count: 4, sustained: null },
      { entityId: "ca", entityType: "unit", count: 1, sustained: null },
    ],
  },
  planets: {},
  ccs: [],
  production: { red: 4 },
  pds: { franken10: { count: 2, expected: 1 } },
  anomaly: false,
};

function costColor(cost: number): string {
  if (cost === -1) return "black";
  const normalizedValue = (cost / MAX_HEAT) * 255 * 2;
  const red = Math.min(255, Math.max(0, normalizedValue));
  const blue = Math.max(0, 255 - normalizedValue);
  return `rgb(${red}, 0, ${blue})`;
}

function SystemTileDisplay({ systemId, tileUnitData }: SystemTileDisplayProps) {
  const { finalCostMap } = placeSpaceEntities({
    gridSize: HEX_GRID_SIZE,
    squareWidth: HEX_SQUARE_WIDTH,
    squareHeight: HEX_SQUARE_HEIGHT,
    hexagonVertices: HEX_VERTICES,
    planets: parsePlanetsFromCoords(systemId),
    tokens: [],
    factionEntities: tileUnitData.space || {},
    initialHeatSources: [],
    systemId,
    highestProduction: tileUnitData.production
      ? Math.max(...Object.values(tileUnitData.production))
      : 0,
  });

  const hasValidCosts = !!finalCostMap?.flat().some((cost) => cost > 0);
  const costSquares = hasValidCosts
    ? finalCostMap.flatMap((rowCosts, row) =>
        rowCosts.map((cost, col) =>
          cost === 0 ? null : (
            <div
              key={`cost-${row}-${col}`}
              className={classes.costMapSquare}
              style={{
                left: `${col * HEX_SQUARE_WIDTH}px`,
                top: `${row * HEX_SQUARE_HEIGHT}px`,
                width: `${HEX_SQUARE_WIDTH}px`,
                height: `${HEX_SQUARE_HEIGHT}px`,
                backgroundColor: costColor(cost),
              }}
            />
          ),
        ),
      )
    : null;

  return (
    <div className={classes.tileContainer}>
      <h3>System {systemId}</h3>
      <div className={classes.systemTileDisplay}>
        <Tile systemId={systemId} className={classes.tile} />
        {costSquares}
      </div>
    </div>
  );
}

export const SystemTilePage = () => (
  <div className={classes.container}>
    <SystemTileDisplay systemId="75" tileUnitData={SAMPLE_TILE_UNIT_DATA} />
  </div>
);
