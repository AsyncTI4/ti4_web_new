import React, { useContext } from "react";
import { Tile } from "./Tile";
import { UnitStack } from "./UnitStack";
import { ControlToken } from "./ControlToken";
import { PdsControlToken } from "./PdsControlToken";
import { CommandCounterStack } from "./CommandCounterStack";
import { CommodityIndicator } from "./CommodityIndicator";
import { ProductionIndicator } from "./ProductionIndicator";
import { FactionColorOverlay } from "./FactionColorOverlay";
import { findOptimalProductionIconCorner } from "../../utils/unitPositioning";
import { getColorAlias } from "@/lookup/colors";
import { getPlanetCoordsBySystemId, getPlanetById } from "@/lookup/planets";
import classes from "./MapTile.module.css";
import { MapTileType } from "@/data/types";
import { cdnImage } from "../../data/cdnImage";
import { TILE_HEIGHT, TILE_WIDTH } from "@/mapgen/tilePositioning";
import { TileSelectedOverlay } from "./TileSelectedOverlay";
import { useSettingsStore, useAppStore } from "@/utils/appStore";
import { useGameData } from "@/hooks/useGameContext";

type Props = {
  mapTile: MapTileType;
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
  onPlanetMouseEnter?: (planetId: string, x: number, y: number) => void;
  onPlanetMouseLeave?: () => void;
  selectedTiles?: string[];
  tileDistance?: number | null;
  isOnPath?: boolean; // Whether this tile is on any of the calculated paths
};

export const MapTile = React.memo<Props>(
  ({
    mapTile,
    style,
    className,
    onTileSelect,
    onTileHover,
    onUnitMouseOver,
    onUnitMouseLeave,
    onUnitSelect,
    onPlanetMouseEnter,
    onPlanetMouseLeave,
    selectedTiles,
    isOnPath = true, // Default to true so tiles aren't dimmed unless explicitly marked
  }) => {
    const hoverTimeoutRef = React.useRef<Record<string, number>>({});
    const gameData = useGameData();

    const ringPosition = mapTile.position;
    const systemId = mapTile.systemId;
    const position = {
      x: mapTile.properties.x,
      y: mapTile.properties.y,
    };
    const isSelected = useAppStore((state) => state.selectedArea);
    const techSkipsMode = useSettingsStore(
      (state) => state.settings.techSkipsMode
    );
    const distanceMode = useSettingsStore(
      (state) => state.settings.distanceMode
    );
    const alwaysShowControlTokens = useSettingsStore(
      (state) => state.settings.showControlTokens
    );
    const showExhaustedPlanets = useSettingsStore(
      (state) => state.settings.showExhaustedPlanets
    );
    const overlaysEnabled = useSettingsStore(
      (state) => state.settings.overlaysEnabled
    );
    const isHovered = useAppStore((state) => state.hoveredTile);
    const pdsMode = useSettingsStore((state) => state.settings.showPDSLayer);

    const handlePlanetMouseEnter = React.useCallback(
      (planetId: string, x: number, y: number) => {
        if (!onPlanetMouseEnter) return;

        hoverTimeoutRef.current[planetId] = setTimeout(() => {
          // Convert relative planet position to world coordinates
          const worldX = position.x + x;
          const worldY = position.y + y;
          onPlanetMouseEnter(planetId, worldX, worldY);
        }, 1000);
      },
      [onPlanetMouseEnter, position.x, position.y]
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

    const unitImages: React.ReactElement[] = React.useMemo(() => {
      const planetCoords = getPlanetCoordsBySystemId(systemId);

      return Object.entries(mapTile.entityPlacements).flatMap(
        ([key, stack]) => {
          // Determine planet center for tokens that belong to a planet
          let planetCenter: { x: number; y: number } | undefined;
          if (stack.planetName && planetCoords[stack.planetName]) {
            const [x, y] = planetCoords[stack.planetName]
              .split(",")
              .map(Number);
            planetCenter = { x, y };
          }

          return [
            <UnitStack
              key={`${systemId}-${key}-stack`}
              stack={stack}
              colorAlias={getColorAlias(
                gameData?.factionColorMap?.[stack.faction]?.color
              )}
              stackKey={key}
              planetCenter={planetCenter}
              lawsInPlay={gameData?.lawsInPlay}
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
        }
      );
    }, [systemId, mapTile, onUnitMouseOver, onUnitMouseLeave, onUnitSelect]);

    const controlTokens: React.ReactElement[] = React.useMemo(() => {
      if (!mapTile?.planets) {
        return [];
      }

      const planetCoords = getPlanetCoordsBySystemId(systemId);

      return mapTile.planets.flatMap((planetData) => {
        const planetId = planetData.name;
        if (!planetData.controller) return [];

        // Check if we should show control tokens based on the setting
        if (!alwaysShowControlTokens) {
          // Only show control tokens on planets with no units
          const planetHasUnits = Object.values(mapTile.entityPlacements).some(
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
          const tokenPlacement = Object.values(mapTile.entityPlacements).find(
            (placement) => placement.entityId === planetId
          );
          if (!tokenPlacement) return [];
          x = tokenPlacement.x;
          y = tokenPlacement.y;
        }

        const colorAlias = getColorAlias(
          gameData?.factionColorMap?.[planetData.controller]?.color
        );

        return [
          <ControlToken
            key={`${systemId}-${planetId}-control`}
            colorAlias={colorAlias}
            faction={planetData.controller}
            style={{
              position: "absolute",
              left: `${x - 10}px`,
              top: `${y + 15}px`, // 20px offset downward
              transform: "translate(-50%, -50%)",
              zIndex: 990,
            }}
          />,
        ];
      });
    }, [systemId, mapTile, mapTile.entityPlacements, alwaysShowControlTokens]);

    const planetCircles: React.ReactElement[] = React.useMemo(() => {
      if (!mapTile?.planets) return [];
      const planetCoords = getPlanetCoordsBySystemId(systemId);

      return mapTile.planets.flatMap((planetTile) => {
        const planetId = planetTile.name;
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

        const exhaustedBackdropFilter =
          planetTile.exhausted && showExhaustedPlanets
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
      mapTile,
      handlePlanetMouseEnter,
      handlePlanetMouseLeave,
      showExhaustedPlanets,
    ]);

    const commodityIndicators: React.ReactElement[] = React.useMemo(() => {
      if (!mapTile?.planets) {
        return [];
      }

      const planetCoords = getPlanetCoordsBySystemId(systemId);

      return mapTile.planets.flatMap((planetData) => {
        const planetId = planetData.name;
        if (!planetData.commodities || planetData.commodities === 0) return [];

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
      });
    }, [systemId, mapTile]);

    const productionIcon: React.ReactElement | null = React.useMemo(() => {
      const optimalCorner = findOptimalProductionIconCorner(systemId);
      if (!optimalCorner || mapTile.highestProduction <= 0) return null;

      return (
        <ProductionIndicator
          key={`${systemId}-production-icon`}
          x={optimalCorner.x}
          y={optimalCorner.y}
          productionValue={mapTile.highestProduction}
        />
      );
    }, [systemId]);

    const commandCounterStack: React.ReactElement | null = React.useMemo(() => {
      if (!mapTile?.commandCounters || mapTile.commandCounters.length === 0) {
        return null;
      }

      return (
        <CommandCounterStack
          key={`${systemId}-command-stack`}
          factions={mapTile.commandCounters}
          style={{
            position: "absolute",
            left: "0px",
            top: "0px",
          }}
        />
      );
    }, [systemId, mapTile]);

    // Determine controlling faction for the system overlay
    const controllingFaction = mapTile.controller;

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
              return mapTile.hasTechSkips ? 1.0 : 0.2;
            }

            // PDS mode - dim tiles that don't have PDS
            if (pdsMode && gameData!.tilesWithPds) {
              return ringPosition && gameData!.tilesWithPds.has(ringPosition)
                ? 1.0
                : 0.2;
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

          {mapTile?.anomaly && (
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
            <FactionColorOverlay faction={controllingFaction} opacity={0.3} />
          )}

          {/* PDS Control Token Overlay */}
          {pdsMode &&
            gameData!.dominantPdsFaction &&
            (() => {
              const tilePosition = ringPosition;
              const pdsData = tilePosition
                ? gameData!.dominantPdsFaction[tilePosition]
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
