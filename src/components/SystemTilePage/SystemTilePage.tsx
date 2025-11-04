import React from "react";
import { Tile } from "../Map/Tile";
import { UnitStack } from "../Map/UnitStack";
import {
  processPlanetEntities,
  HEX_SQUARE_WIDTH,
  HEX_SQUARE_HEIGHT,
  DEFAULT_PLANET_RADIUS,
  MAX_HEAT,
  HEX_GRID_SIZE,
  HEX_VERTICES,
  placeSpaceEntities,
} from "../../utils/unitPositioning";
import { getPlanetById, getPlanetCoordsBySystemId } from "@/lookup/planets";
import { TileUnitData, LawInPlay } from "@/data/types";
import classes from "./SystemTilePage.module.css";

type SystemTileDisplayProps = {
  systemId: string;
  tileUnitData: TileUnitData;
  lawsInPlay?: LawInPlay[];
};

const COLOR_ALIAS = "pnk";

const SystemTileDisplay = ({
  systemId,
  tileUnitData,
  lawsInPlay,
}: SystemTileDisplayProps) => {
  // Get all entity placements for the tile
  const { entityPlacements: entityPlacements, finalCostMap } =
    React.useMemo(() => {
      const planetCoords = getPlanetCoordsBySystemId(systemId);
      const planets = Object.entries(planetCoords).map(
        ([planetId, coordStr]) => {
          const [x, y] = coordStr.split(",").map(Number);
          return {
            name: planetId,
            x,
            y,
            radius: DEFAULT_PLANET_RADIUS, // Default planet radius for collision detection
            resourcesLocation:
              getPlanetById(planetId)?.planetLayout?.resourcesLocation,
          };
        }
      );

      const { entityPlacements: allEntityPlacements, finalCostMap } =
        placeSpaceEntities({
          gridSize: HEX_GRID_SIZE,
          squareWidth: HEX_SQUARE_WIDTH,
          squareHeight: HEX_SQUARE_HEIGHT,
          hexagonVertices: HEX_VERTICES,
          planets,
          factionEntities: tileUnitData.space || {},
          initialHeatSources: [],
          systemId,
          highestProduction: tileUnitData.production
            ? Math.max(...Object.values(tileUnitData.production))
            : 0,
        });

      return {
        entityPlacements: allEntityPlacements,
        finalCostMap: finalCostMap,
      };
    }, [systemId, tileUnitData]);

  // Generate unit images (UnitStack components)
  const unitImages: React.ReactElement[] = React.useMemo(() => {
    const planetCoords = getPlanetCoordsBySystemId(systemId);

    return Object.entries(entityPlacements).flatMap(([key, stack]) => {
      // Determine planet center for tokens that belong to a planet
      let planetCenter: { x: number; y: number } | undefined;
      if (stack.planetName && planetCoords[stack.planetName]) {
        const [x, y] = planetCoords[stack.planetName].split(",").map(Number);
        planetCenter = { x, y };
      }

      return [
        // <UnitStack
        //   key={`${systemId}-${key}-stack`}
        //   stack={stack}
        //   colorAlias={COLOR_ALIAS}
        //   stackKey={key}
        //   planetCenter={planetCenter}
        //   lawsInPlay={lawsInPlay}
        // />,
      ];
    });
  }, [systemId, tileUnitData, entityPlacements, lawsInPlay]);

  // Generate cost map grid overlay
  const costMapGrid: React.ReactElement[] = React.useMemo(() => {
    if (!finalCostMap || finalCostMap.length === 0) {
      return [];
    }

    // Check if there are any non-zero, non-negative cost values to display
    const hasValidCosts = finalCostMap.flat().some((cost) => cost > 0);
    if (!hasValidCosts) return [];

    const gridElements: React.ReactElement[] = [];

    for (let row = 0; row < finalCostMap.length; row++) {
      for (let col = 0; col < finalCostMap[row].length; col++) {
        const cost = finalCostMap[row][col];

        // Skip only zero cost squares (remain transparent)
        if (cost === 0) continue;

        // Calculate position
        const x = col * HEX_SQUARE_WIDTH;
        const y = row * HEX_SQUARE_HEIGHT;

        let opacity: number = 1;
        let backgroundColor: string;

        if (cost === -1) {
          // Inaccessible squares: black color
          backgroundColor = "black";
        } else {
          // Normalize heat values using MAX_HEAT as the scale maximum
          // Higher heat = more red, lower heat = more blue
          const normalizedValue = (cost / MAX_HEAT) * 255 * 2;
          const red = Math.min(255, Math.max(0, normalizedValue));
          const blue = Math.max(0, 255 - normalizedValue);
          backgroundColor = `rgb(${red}, 0, ${blue})`;
        }

        gridElements.push(
          <div
            key={`cost-${row}-${col}`}
            className={classes.costMapSquare}
            style={{
              position: "absolute",
              left: `${x}px`,
              top: `${y}px`,
              width: `${HEX_SQUARE_WIDTH}px`,
              height: `${HEX_SQUARE_HEIGHT}px`,
              backgroundColor,
              opacity,
              pointerEvents: "none",
              zIndex: 1000,
            }}
          />
        );
      }
    }

    return gridElements;
  }, [finalCostMap]);

  return (
    <div className={classes.tileContainer}>
      <h3>System {systemId}</h3>
      <div className={classes.systemTileDisplay}>
        <Tile systemId={systemId} className={classes.tile} />
        {unitImages}
        {costMapGrid}
      </div>
    </div>
  );
};

export const SystemTilePage = () => {
  return (
    <div className={classes.container}>
      <SystemTileDisplay
        systemId="75"
        tileUnitData={{
          space: {
            neutral: [
              {
                entityId: "gamma",
                entityType: "token",
                count: 1,
                sustained: null,
              },
            ],
            franken10: [
              {
                entityId: "cv",
                entityType: "unit",
                count: 4,
                sustained: null,
              },
              {
                entityId: "ca",
                entityType: "unit",
                count: 1,
                sustained: null,
              },
              // {
              //   entityId: "ff",
              //   entityType: "unit",
              //   count: 9,
              //   sustained: null,
              // },

              // {
              //   entityId: "dd",
              //   entityType: "unit",
              //   count: 1,
              //   sustained: null,
              // },
            ],
          },
          planets: {},
          ccs: [],
          production: {
            red: 4,
          },
          pds: {
            franken10: {
              count: 2,
              expected: 1,
            },
          },
          anomaly: false,
        }}
      />
    </div>
  );
};
