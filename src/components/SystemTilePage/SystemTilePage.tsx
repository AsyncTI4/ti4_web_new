import React from "react";
import { useParams } from "react-router-dom";
import { Tile } from "../Map/Tile";
import { UnitStack } from "../Map/UnitStack";
import {
  processPlanetEntities,
  HEX_SQUARE_WIDTH,
  HEX_SQUARE_HEIGHT,
} from "../../utils/unitPositioning";
import { getPlanetCoordsBySystemId } from "@/lookup/planets";
import { TileUnitData } from "@/data/types";
import classes from "./SystemTilePage.module.css";

type SystemTilePageProps = {
  systemId?: string;
  tileUnitData?: TileUnitData;
};

const COLOR_ALIAS = "pnk";

export const SystemTilePage = ({
  systemId: propSystemId,
  tileUnitData: propTileUnitData,
}: SystemTilePageProps) => {
  const { systemId: paramSystemId } = useParams<{ systemId: string }>();

  // Use props first, fallback to URL params
  const systemId = propSystemId || paramSystemId || "";

  // Default tile unit data for demo/testing
  const defaultTileUnitData: TileUnitData = {
    space: {}, // Explicitly empty space units since we're skipping space
    planets: {
      bereg: {
        controlledBy: "The Barony of Letnev",
        entities: {
          neutral: [
            { entityId: "worlddestroyed", count: 1, entityType: "token" },
          ],
        },
      },
    },
    ccs: [],
  };

  const tileUnitData = propTileUnitData || defaultTileUnitData;

  // Filter out space units by creating a modified tileUnitData
  const planetOnlyTileUnitData: TileUnitData = {
    ...tileUnitData,
    space: {}, // Remove all space units
  };

  if (!systemId) {
    return (
      <div className={classes.errorContainer}>
        <h1>System Tile Viewer</h1>
        <p>
          No system ID provided. Please provide a system ID via URL parameter or
          props.
        </p>
      </div>
    );
  }

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
            radius: 60, // Default planet radius for collision detection
          };
        }
      );

      return processPlanetEntities(planets.find((p) => p.name === "bereg")!, {
        controlledBy: "The Barony of Letnev",
        entities: {
          neutral: [
            { entityId: "worlddestroyed", count: 1, entityType: "token" },
          ],
        },
      });
    }, [systemId, planetOnlyTileUnitData]);

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
        <UnitStack
          key={`${systemId}-${key}-stack`}
          unitType={stack.entityId}
          colorAlias={COLOR_ALIAS}
          faction={stack.faction}
          count={stack.count}
          x={stack.x}
          y={stack.y}
          stackKey={key}
          sustained={stack.sustained}
          entityType={stack.entityType}
          planetCenter={planetCenter}
        />,
      ];
    });
  }, [systemId, planetOnlyTileUnitData, entityPlacements]);

  // Generate cost map grid overlay
  const costMapGrid: React.ReactElement[] = React.useMemo(() => {
    if (!finalCostMap || finalCostMap.length === 0) {
      return [];
    }

    // Find the maximum cost value for normalization
    const maxCost = Math.max(
      ...finalCostMap.flat().filter((cost) => cost !== -1)
    );

    if (maxCost === 0) return [];

    const gridElements: React.ReactElement[] = [];

    for (let row = 0; row < finalCostMap.length; row++) {
      for (let col = 0; col < finalCostMap[row].length; col++) {
        const cost = finalCostMap[row][col];

        // Skip only zero cost squares (remain transparent)
        if (cost === 0) continue;

        // Calculate position
        const x = col * HEX_SQUARE_WIDTH;
        const y = row * HEX_SQUARE_HEIGHT;

        let opacity: number;
        let backgroundColor: string;

        if (cost === -1) {
          // Inaccessible squares: full opacity with different color
          opacity = 1;
          backgroundColor = "black";
        } else {
          // Accessible squares with cost: normalize cost to opacity (0-1 range)
          opacity = Math.min(cost / maxCost, 1);
          backgroundColor = "red";
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
    <div className={classes.container}>
      <div className={classes.tileContainer}>
        <div className={classes.systemTileDisplay}>
          <Tile systemId={systemId} className={classes.tile} />
          {/* {controlTokens} */}
          {unitImages}
          {costMapGrid}
        </div>
      </div>
    </div>
  );
};
