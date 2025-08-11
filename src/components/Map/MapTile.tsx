import React from "react";
import { Tile } from "./Tile";
import { UnitStack } from "./UnitStack";
import { ControlToken } from "./ControlToken";
import { PdsControlToken } from "./PdsControlToken";
import { CommandCounterStack } from "./CommandCounterStack";
import { CommodityIndicator } from "./CommodityIndicator";
import { ProductionIndicator } from "./ProductionIndicator";
import { FactionColorOverlay } from "./FactionColorOverlay";
import {
  getAllEntityPlacementsForTile,
  findOptimalProductionIconCorner,
} from "../../utils/unitPositioning";
import { getColorAlias } from "@/lookup/colors";
import {
  getPlanetsByTileId,
  getPlanetCoordsBySystemId,
  getPlanetById,
} from "@/lookup/planets";
import classes from "./MapTile.module.css";
import { TileUnitData, LawInPlay } from "@/data/types";
import { cdnImage } from "../../data/cdnImage";
import { TILE_HEIGHT, TILE_WIDTH } from "@/mapgen/tilePositioning";
import { getAttachmentData } from "@/lookup/attachments";
import { RGBColor } from "../../utils/colorOptimization";
import { TileSelectedOverlay } from "./TileSelectedOverlay";

// Helper function to check if a system has tech skips
const systemHasTechSkips = (
  systemId: string,
  tileUnitData?: TileUnitData
): boolean => {
  // Check base planet tech specialties
  const systemPlanets = getPlanetsByTileId(systemId);
  const hasBaseTechSkips = systemPlanets.some(
    (planet) =>
      planet.techSpecialties &&
      planet.techSpecialties.length > 0 &&
      !planet.techSpecialties.includes("NONUNITSKIP")
  );

  if (hasBaseTechSkips) {
    return true;
  }

  // Check planet attachments for tech skips
  if (tileUnitData?.planets) {
    for (const [_, planetData] of Object.entries(tileUnitData.planets)) {
      if (planetData?.entities) {
        for (const entities of Object.values(planetData.entities)) {
          if (Array.isArray(entities)) {
            for (const entity of entities) {
              if (entity.entityType === "attachment") {
                const attachmentData = getAttachmentData(entity.entityId);
                if (
                  attachmentData?.techSpeciality &&
                  attachmentData.techSpeciality.length > 0
                ) {
                  return true;
                }
              }
            }
          }
        }
      }
    }
  }

  return false;
};

type Props = {
  systemId: string;
  position: { x: number; y: number };
  ringPosition: string;
  tileUnitData?: TileUnitData;
  factionToColor: Record<string, string>;
  optimizedColors: Record<string, RGBColor>;
  style?: React.CSSProperties;
  className?: string;
  onTileSelect?: (position: string) => void;
  onTileHover?: (position: string, isHovered: boolean) => void;
  onUnitMouseOver?: (
    faction: string,
    unitId: string,
    x: number,
    y: number
  ) => void;
  onUnitMouseLeave?: () => void;
  onUnitSelect?: (faction: string) => void;
  onPlanetHover?: (
    systemId: string,
    planetId: string,
    x: number,
    y: number
  ) => void;
  onPlanetMouseLeave?: () => void;
  isSelected?: boolean;
  isHovered?: boolean;
  techSkipsMode?: boolean;
  distanceMode?: boolean;
  pdsMode?: boolean;
  tilesWithPds?: Set<string>;
  dominantPdsFaction?: Record<
    string,
    {
      faction: string;
      color: string;
      count: number;
      expected: number;
    }
  >;
  selectedTiles?: string[];
  tileDistance?: number | null;
  overlaysEnabled?: boolean;
  lawsInPlay?: LawInPlay[];
  exhaustedPlanets?: string[];
  alwaysShowControlTokens?: boolean;
  showExhaustedPlanets?: boolean;
  isOnPath?: boolean; // Whether this tile is on any of the calculated paths
};

export const MapTile = React.memo<Props>(
  ({
    systemId,
    position,
    tileUnitData,
    factionToColor,
    optimizedColors,
    style,
    className,
    onTileSelect,
    onTileHover,
    onUnitMouseOver,
    onUnitMouseLeave,
    onUnitSelect,
    onPlanetHover,
    onPlanetMouseLeave,
    isSelected,
    isHovered,
    ringPosition,
    techSkipsMode,
    distanceMode,
    pdsMode,
    tilesWithPds,
    dominantPdsFaction,
    selectedTiles,

    overlaysEnabled,
    lawsInPlay,
    exhaustedPlanets = [],
    alwaysShowControlTokens = true,
    showExhaustedPlanets = true,
    isOnPath = true, // Default to true so tiles aren't dimmed unless explicitly marked
  }) => {
    const hoverTimeoutRef = React.useRef<Record<string, number>>({});

    const handlePlanetMouseEnter = React.useCallback(
      (planetId: string, x: number, y: number) => {
        if (!onPlanetHover) return;

        hoverTimeoutRef.current[planetId] = setTimeout(() => {
          // Convert relative planet position to world coordinates
          const worldX = position.x + x;
          const worldY = position.y + y;
          onPlanetHover(systemId, planetId, worldX, worldY);
        }, 1000);
      },
      [systemId, onPlanetHover, position.x, position.y]
    );

    const handlePlanetMouseLeave = React.useCallback(
      (planetId: string) => {
        if (hoverTimeoutRef.current[planetId]) {
          clearTimeout(hoverTimeoutRef.current[planetId]);
          delete hoverTimeoutRef.current[planetId];
        }
        if (onPlanetMouseLeave) {
          onPlanetMouseLeave();
        }
      },
      [onPlanetMouseLeave]
    );

    // Cleanup timeouts on unmount
    React.useEffect(() => {
      return () => {
        Object.values(hoverTimeoutRef.current).forEach(clearTimeout);
      };
    }, []);

    const allEntityPlacements = React.useMemo(() => {
      return getAllEntityPlacementsForTile(systemId, tileUnitData);
    }, [systemId, tileUnitData]);

    const unitImages: React.ReactElement[] = React.useMemo(() => {
      const planetCoords = getPlanetCoordsBySystemId(systemId);

      return Object.entries(allEntityPlacements).flatMap(([key, stack]) => {
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
            colorAlias={getColorAlias(factionToColor[stack.faction])}
            faction={stack.faction}
            count={stack.count}
            x={stack.x}
            y={stack.y}
            stackKey={key}
            sustained={stack.sustained}
            entityType={stack.entityType}
            planetCenter={planetCenter}
            lawsInPlay={lawsInPlay}
            onUnitMouseOver={
              onUnitMouseOver
                ? () => {
                    // Convert relative unit position to world coordinates
                    const worldX = position.x + stack.x;
                    const worldY = position.y + stack.y;
                    onUnitMouseOver(
                      stack.faction,
                      stack.entityId,
                      worldX,
                      worldY
                    );
                  }
                : undefined
            }
            onUnitMouseLeave={
              onUnitMouseLeave ? () => onUnitMouseLeave() : undefined
            }
            onUnitSelect={
              onUnitSelect ? () => onUnitSelect(stack.faction) : undefined
            }
          />,
        ];
      });
    }, [
      systemId,
      tileUnitData,
      factionToColor,
      onUnitMouseOver,
      onUnitMouseLeave,
      onUnitSelect,
      allEntityPlacements,
      lawsInPlay,
    ]);

    const controlTokens: React.ReactElement[] = React.useMemo(() => {
      if (!tileUnitData?.planets) {
        return [];
      }

      const planetCoords = getPlanetCoordsBySystemId(systemId);

      return Object.entries(tileUnitData.planets).flatMap(
        ([planetId, planetData]) => {
          if (!planetData.controlledBy) return [];

          // Check if we should show control tokens based on the setting
          if (!alwaysShowControlTokens) {
            // Only show control tokens on planets with no units
            const planetHasUnits = Object.values(allEntityPlacements).some(
              (placement) =>
                placement.planetName === planetId &&
                placement.entityType === "unit"
            );
            if (planetHasUnits) return [];
          }

          // Try to get coordinates from planet lookup first
          let x: number, y: number;
          if (planetCoords[planetId]) {
            [x, y] = planetCoords[planetId].split(",").map(Number);
          } else {
            // Fall back to checking entity placements for tokens matching the planet name
            // (handles mirage and other case where a token added *is* a planet)
            const tokenPlacement = Object.values(allEntityPlacements).find(
              (placement) => placement.entityId === planetId
            );
            if (!tokenPlacement) return [];
            x = tokenPlacement.x;
            y = tokenPlacement.y;
          }

          const colorAlias = getColorAlias(
            factionToColor[planetData.controlledBy]
          );

          return [
            <ControlToken
              key={`${systemId}-${planetId}-control`}
              colorAlias={colorAlias}
              faction={planetData.controlledBy}
              style={{
                position: "absolute",
                left: `${x - 10}px`,
                top: `${y + 15}px`, // 20px offset downward
                transform: "translate(-50%, -50%)",
                zIndex: 990,
              }}
            />,
          ];
        }
      );
    }, [
      systemId,
      tileUnitData,
      factionToColor,
      allEntityPlacements,
      alwaysShowControlTokens,
    ]);

    const planetCircles: React.ReactElement[] = React.useMemo(() => {
      if (!tileUnitData?.planets) {
        return [];
      }

      const planetCoords = getPlanetCoordsBySystemId(systemId);

      return Object.entries(tileUnitData.planets).flatMap(([planetId, _]) => {
        if (!planetCoords[planetId]) return [];
        const [x, y] = planetCoords[planetId].split(",").map(Number);

        // Get planet information to determine if it's legendary or Mecatol Rex
        const planet = getPlanetById(planetId);
        const isLegendary =
          planet?.legendaryAbilityName || planet?.legendaryAbilityText;
        const isMecatolRex = planetId === "mr";

        // Determine radius based on planet type
        let radius = 60; // Default radius
        if (isMecatolRex) {
          radius = 120;
        } else if (
          planetId === "mallice" ||
          planetId === "lockedmallice" ||
          planetId === "hexmallice" ||
          planetId === "hexlockedmallice"
        ) {
          radius = 60;
        } else if (isLegendary) {
          radius = 100;
        }

        const diameter = radius * 2;

        const isExhausted = exhaustedPlanets.includes(planetId);
        const exhaustedBackdropFilter =
          isExhausted && showExhaustedPlanets
            ? { backdropFilter: "grayscale(1) brightness(0.7) blur(0px)" }
            : {};

        return [
          <div
            key={`${systemId}-${planetId}-circle`}
            className={classes.planetCircle}
            style={{
              left: `${x}px`,
              top: `${y}px`,
              width: `${diameter}px`,
              height: `${diameter}px`,
              ...exhaustedBackdropFilter,
            }}
            onMouseEnter={() => handlePlanetMouseEnter(planetId, x, y)}
            onMouseLeave={() => handlePlanetMouseLeave(planetId)}
          />,
        ];
      });
    }, [
      systemId,
      tileUnitData,
      handlePlanetMouseEnter,
      handlePlanetMouseLeave,
      exhaustedPlanets,
      showExhaustedPlanets,
    ]);

    const commodityIndicators: React.ReactElement[] = React.useMemo(() => {
      if (!tileUnitData?.planets) {
        return [];
      }

      const planetCoords = getPlanetCoordsBySystemId(systemId);

      return Object.entries(tileUnitData.planets).flatMap(
        ([planetId, planetData]) => {
          if (!planetData.commodities || planetData.commodities === 0)
            return [];

          // Get coordinates from planet lookup
          if (!planetCoords[planetId]) return [];
          const [x, y] = planetCoords[planetId].split(",").map(Number);

          return [
            <CommodityIndicator
              key={`${systemId}-${planetId}-commodity`}
              commodityCount={planetData.commodities}
              x={x}
              y={y}
            />,
          ];
        }
      );
    }, [systemId, tileUnitData]);

    const productionIcon: React.ReactElement | null = React.useMemo(() => {
      // Find the optimal corner position for the production icon
      const optimalCorner = findOptimalProductionIconCorner(systemId);
      if (!optimalCorner) return null;

      const highestProduction = tileUnitData?.production
        ? Math.max(...Object.values(tileUnitData.production))
        : 0;
      if (highestProduction <= 0) return null;

      return (
        <ProductionIndicator
          key={`${systemId}-production-icon`}
          x={optimalCorner.x}
          y={optimalCorner.y}
          productionValue={highestProduction}
        />
      );
    }, [systemId, tileUnitData]);

    const commandCounterStack: React.ReactElement | null = React.useMemo(() => {
      if (!tileUnitData?.ccs || tileUnitData.ccs.length === 0) {
        return null;
      }

      return (
        <CommandCounterStack
          key={`${systemId}-command-stack`}
          factions={tileUnitData.ccs}
          factionToColor={factionToColor}
          style={{
            position: "absolute",
            left: "0px",
            top: "0px",
          }}
        />
      );
    }, [systemId, tileUnitData, factionToColor]);

    // Determine controlling faction for the system overlay
    const controllingFaction: string | null = React.useMemo(() => {
      if (!tileUnitData) return null;

      // Check if all planets are controlled by the same faction
      if (tileUnitData.planets) {
        const controllingFactions = Object.values(tileUnitData.planets)
          .map((planet) => planet.controlledBy)
          .filter(Boolean);

        if (controllingFactions.length > 0) {
          const uniqueFactions = [...new Set(controllingFactions)];
          if (uniqueFactions.length === 1) {
            return uniqueFactions[0];
          }
        }
      }

      // Check if there are units from a single faction (excluding command counters)
      const factionUnits = Object.values(allEntityPlacements)
        .filter((placement) => placement.entityType === "unit")
        .map((placement) => placement.faction);

      if (factionUnits.length > 0) {
        const uniqueFactionUnits = [...new Set(factionUnits)];
        if (uniqueFactionUnits.length === 1) {
          return uniqueFactionUnits[0];
        }
      }

      return null;
    }, [tileUnitData, allEntityPlacements]);

    const isDistanceSelected =
      distanceMode && selectedTiles?.includes(ringPosition);
    const isDistanceHoverable = distanceMode && !isDistanceSelected;

    return (
      <div
        className={`${classes.mapTile} ${className || ""} ${
          isSelected ? classes.selected : ""
        } ${isHovered ? classes.hovered : ""} ${
          isDistanceSelected ? classes.distanceSelected : ""
        } ${isDistanceHoverable ? classes.distanceHoverable : ""}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          opacity: (() => {
            // Tech skips mode takes priority
            if (techSkipsMode) {
              return systemHasTechSkips(systemId, tileUnitData) ? 1.0 : 0.2;
            }

            // PDS mode - dim tiles that don't have PDS
            if (pdsMode && tilesWithPds) {
              return ringPosition && tilesWithPds.has(ringPosition) ? 1.0 : 0.2;
            }

            // Distance mode with two selected tiles - dim tiles not on any path
            if (
              distanceMode &&
              selectedTiles &&
              selectedTiles.length === 2 &&
              !isOnPath
            ) {
              return 0.2;
            }

            return 1;
          })(),
          ...style,
        }}
        onClick={onTileSelect ? () => onTileSelect(ringPosition) : undefined}
        onMouseEnter={
          onTileHover ? () => onTileHover(ringPosition, true) : undefined
        }
        onMouseLeave={
          onTileHover ? () => onTileHover(ringPosition, false) : undefined
        }
      >
        <div className={classes.tileContainer}>
          <Tile systemId={systemId} className={classes.tile} />

          {tileUnitData?.anomaly && (
            <img
              src={cdnImage("/emojis/tiles/Anomaly.png")}
              alt="Anomaly"
              className={classes.anomalyOverlay}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: TILE_WIDTH,
                height: TILE_HEIGHT,
                zIndex: 1,
                pointerEvents: "none",
              }}
            />
          )}
          {planetCircles}
          {controlTokens}
          {commodityIndicators}
          {productionIcon}
          {unitImages}
          {commandCounterStack}
          <div className={classes.ringPosition}>{ringPosition}</div>

          {controllingFaction && overlaysEnabled && (
            <FactionColorOverlay
              faction={factionToColor[controllingFaction]}
              opacity={0.3}
              optimizedColors={optimizedColors}
            />
          )}

          {/* PDS Control Token Overlay */}
          {pdsMode &&
            dominantPdsFaction &&
            (() => {
              const tilePosition = ringPosition;
              const pdsData = tilePosition
                ? dominantPdsFaction[tilePosition]
                : null;

              if (pdsData) {
                return (
                  <PdsControlToken
                    colorAlias={getColorAlias(pdsData.color)}
                    faction={pdsData.faction}
                    count={pdsData.count}
                    expected={pdsData.expected}
                    style={{
                      position: "absolute",
                      left: `${TILE_WIDTH / 2}px`,
                      top: `${TILE_HEIGHT / 2}px`,
                      transform: "translate(-50%, -50%)",
                      zIndex: 19000, // High z-index to appear on top of everything
                    }}
                  />
                );
              }

              return null;
            })()}

          <TileSelectedOverlay
            isSelected={!!isDistanceSelected}
            isHovered={!!isHovered}
            isDistanceMode={!!distanceMode}
          />
        </div>
      </div>
    );
  }
);
