import React from "react";
import { Tile } from "./Tile";
import { FactionColorOverlay } from "./FactionColorOverlay";
import classes from "./MapTile.module.css";
import { MapTileType } from "@/data/types";
import { TileSelectedOverlay } from "./TileSelectedOverlay";
import { useSettingsStore, useAppStore } from "@/utils/appStore";
import { useGameData } from "@/hooks/useGameContext";
import { UnitImagesLayer } from "./layers/UnitImagesLayer";
import { ControlTokensLayer } from "./layers/ControlTokensLayer";
import { PlanetCirclesLayer } from "./layers/PlanetCirclesLayer";
import { CommodityIndicatorsLayer } from "./layers/CommodityIndicatorsLayer";
import { ProductionIconLayer } from "./layers/ProductionIconLayer";
import { CommandCounterLayer } from "./layers/CommandCounterLayer";
import { PdsOverlayLayer } from "./layers/PdsOverlayLayer";
import { AnomalyOverlay } from "./layers/AnomalyOverlay";
import { TILE_HEIGHT, TILE_WIDTH } from "@/mapgen/tilePositioning";

type Props = {
  mapTile: MapTileType;
  style?: React.CSSProperties;
  className?: string;
  onTileSelect?: (position: string) => void;
  onTileHover?: (position: string, isHovered: boolean) => void;
  hoveredTilePosition?: string | null;
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
    hoveredTilePosition,
    onUnitMouseOver,
    onUnitMouseLeave,
    onUnitSelect,
    onPlanetMouseEnter,
    onPlanetMouseLeave,
    selectedTiles,
    isOnPath = true, // Default to true so tiles aren't dimmed unless explicitly marked
  }) => {
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
    const overlaysEnabled = useSettingsStore(
      (state) => state.settings.overlaysEnabled
    );
    const isHovered = useAppStore((state) => state.hoveredTile);
    const pdsMode = useSettingsStore((state) => state.settings.showPDSLayer);

    const isDistanceSelected =
      distanceMode && selectedTiles?.includes(ringPosition);
    const isDistanceHoverable = distanceMode && !isDistanceSelected;
    const isHoveredForDistance =
      !!distanceMode && hoveredTilePosition === ringPosition;

    const controllingFaction = mapTile.controller;

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
      >
        <div className={classes.tileContainer}>
          <Tile
            systemId={systemId}
            className={classes.tile}
            onMouseEnter={
              onTileHover ? () => onTileHover(ringPosition, true) : undefined
            }
            onMouseLeave={
              onTileHover ? () => onTileHover(ringPosition, false) : undefined
            }
          />

          <AnomalyOverlay
            show={!!mapTile?.anomaly}
            width={TILE_WIDTH}
            height={TILE_HEIGHT}
          />
          <PlanetCirclesLayer
            systemId={systemId}
            mapTile={mapTile}
            position={position}
            onPlanetMouseEnter={onPlanetMouseEnter}
            onPlanetMouseLeave={onPlanetMouseLeave}
          />
          <ControlTokensLayer systemId={systemId} mapTile={mapTile} />
          <CommodityIndicatorsLayer systemId={systemId} mapTile={mapTile} />
          <ProductionIconLayer
            systemId={systemId}
            highestProduction={mapTile.highestProduction}
          />
          <UnitImagesLayer
            systemId={systemId}
            mapTile={mapTile}
            position={position}
            onUnitMouseOver={onUnitMouseOver}
            onUnitMouseLeave={onUnitMouseLeave}
            onUnitSelect={onUnitSelect}
          />
          <CommandCounterLayer
            systemId={systemId}
            factions={mapTile.commandCounters}
          />
          <div className={classes.ringPosition}>{ringPosition}</div>

          {controllingFaction && overlaysEnabled && (
            <FactionColorOverlay faction={controllingFaction} opacity={0.3} />
          )}

          {pdsMode && (
            <PdsOverlayLayer
              ringPosition={ringPosition}
              dominantPdsFaction={gameData?.dominantPdsFaction}
            />
          )}

          <TileSelectedOverlay
            isSelected={!!isDistanceSelected}
            isHovered={isHoveredForDistance}
            isDistanceMode={!!distanceMode}
          />
        </div>
      </div>
    );
  }
);
