import React from "react";
import { Tile } from "../Map/Tile";
import { UnitStack } from "../Map/UnitStack";
import {
  processPlanetEntities,
  HEX_SQUARE_WIDTH,
  HEX_SQUARE_HEIGHT,
  DEFAULT_PLANET_RADIUS,
  MAX_HEAT,
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
  // Filter out space units by creating a modified tileUnitData
  const planetOnlyTileUnitData: TileUnitData = {
    ...tileUnitData,
    space: {}, // Remove all space units
  };

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
            statsPos: getPlanetById(planetId)?.statsPos,
          };
        }
      );

      // Process all planets that have data
      const allEntityPlacements: Record<string, any> = {};
      let combinedCostMap: number[][] = [];

      Object.entries(planetOnlyTileUnitData.planets).forEach(
        ([planetId, planetData]) => {
          const planet = planets.find((p) => p.name === planetId);
          if (planet && planetData) {
            const result = processPlanetEntities(planet, planetData);
            Object.assign(allEntityPlacements, result.entityPlacements);
            if (result.finalCostMap.length > 0) {
              combinedCostMap = result.finalCostMap;
            }
          }
        }
      );

      return {
        entityPlacements: allEntityPlacements,
        finalCostMap: combinedCostMap,
      };
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

      console.log("the planet center is", JSON.stringify(planetCenter));

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
          lawsInPlay={lawsInPlay}
        />,
      ];
    });
  }, [systemId, planetOnlyTileUnitData, entityPlacements, lawsInPlay]);

  // Generate cost map grid overlay
  const costMapGrid: React.ReactElement[] = React.useMemo(() => {
    if (!finalCostMap || finalCostMap.length === 0) {
      return [];
    }

    console.log("finalCostMap", finalCostMap);

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
  // Default tile unit data for system 53
  const system53TileData: TileUnitData = {
    anomaly: false,
    space: {},
    planets: {
      arcturus: {
        controlledBy: "letnev",
        entities: {
          letnev: [
            { entityId: "gf", count: 1, entityType: "unit" },
            { entityId: "sd", count: 1, entityType: "unit" },
            { entityId: "mf", count: 1, entityType: "unit" },
          ],
        },
        commodities: null,
      },
    },
    ccs: [],
    production: {},
    capacity: {},
  };

  // Default tile unit data for system 22
  const system22TileData: TileUnitData = {
    anomaly: false,
    space: {},
    planets: {
      tarmann: {
        controlledBy: "sol",
        entities: {
          letnev: [
            { entityId: "gf", count: 2, entityType: "unit" },
            // { entityId: "sd", count: 1, entityType: "unit" },
            { entityId: "mf", count: 1, entityType: "unit" },
          ],
        },
        commodities: null,
      },
    },
    ccs: [],
    production: {},
    capacity: {},
  };

  return (
    <div className={classes.container}>
      <SystemTileDisplay systemId="53" tileUnitData={system53TileData} />
      <SystemTileDisplay systemId="22" tileUnitData={system22TileData} />
      <SystemTileDisplay
        systemId="69"
        tileUnitData={{
          anomaly: false,
          space: {},
          planets: {
            accoen: {
              controlledBy: "sol",
              entities: {
                letnev: [
                  { entityId: "gf", count: 2, entityType: "unit" },
                  // { entityId: "sd", count: 1, entityType: "unit" },
                  { entityId: "mf", count: 1, entityType: "unit" },
                ],
              },
              commodities: null,
            },
            jeolir: {
              controlledBy: "sol",
              entities: {
                letnev: [
                  { entityId: "gf", count: 2, entityType: "unit" },
                  // { entityId: "sd", count: 1, entityType: "unit" },
                  { entityId: "mf", count: 1, entityType: "unit" },
                  {
                    entityId: "dysonsphere",
                    count: 1,
                    entityType: "attachment",
                  },
                ],
              },
              commodities: null,
            },
          },
          ccs: [],
          production: {},
          capacity: {},
        }}
      />
    </div>
  );
};
