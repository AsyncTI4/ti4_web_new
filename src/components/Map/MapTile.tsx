import React, { useState } from "react";
import { Tile } from "./Tile";
import { FactionColorOverlay } from "./FactionColorOverlay";
import classes from "./MapTile.module.css";
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
import { PlanetaryShieldOverlayLayer } from "./layers/PlanetaryShieldOverlayLayer";
import { AnomalyOverlay } from "./layers/AnomalyOverlay";
import { BorderAnomalyLayer } from "./layers/BorderAnomalyLayer";
import { TILE_HEIGHT, TILE_WIDTH } from "@/mapgen/tilePositioning";
import { hasTechSkips } from "@/utils/tileDistances";
import { Tile as TileType } from "@/context/types";

type Props = {
  mapTile: TileType;
  style?: React.CSSProperties;
  className?: string;
  onTileSelect?: (position: string, systemId: string) => void;
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
  isTargetSelected?: boolean;
  isMovingMode?: boolean; // Movement mode active globally
  isOrigin?: boolean; // This tile is an origin in displacement draft
  embedded?: boolean; // Render as self-contained preview without map offsets
  isA11ySelected?: boolean; // Accessibility selection highlight
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
    isTargetSelected = false,
    isMovingMode = false,
    isOrigin = false,
    embedded = false,
    isA11ySelected = false,
  }) => {
    const gameData = useGameData();
    const [hoveredLocal, setHoveredLocal] = useState(false);

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
    const planetTypesMode = useSettingsStore(
      (state) => state.settings.planetTypesMode
    );
    const isHovered = useAppStore((state) => state.hoveredTile);
    const pdsMode = useSettingsStore((state) => state.settings.showPDSLayer);

    const isDistanceSelected =
      distanceMode && selectedTiles?.includes(ringPosition);
    const isDistanceHoverable = distanceMode && !isDistanceSelected;
    const isHoveredForDistance =
      !!distanceMode && hoveredTilePosition === ringPosition;

    const controllingFaction = mapTile.controlledBy;

    return (
      <div
        id={`tile-${ringPosition}`}
        className={`${classes.mapTile} ${className || ""} ${
          isSelected ? classes.selected : ""
        } ${isHovered ? classes.hovered : ""} ${
          isDistanceSelected ? classes.distanceSelected : ""
        } ${isDistanceHoverable ? classes.distanceHoverable : ""} ${
          isMovingMode ? classes.movingMode : ""
        } ${isA11ySelected ? classes.selected : ""}`}
        style={{
          left: embedded ? 0 : `${position.x}px`,
          top: embedded ? 0 : `${position.y}px`,
          position: embedded ? "relative" : undefined,
          opacity: (() => {
            // Tech skips mode takes priority
            if (techSkipsMode) {
              return hasTechSkips(mapTile) ? 1.0 : 0.2;
            }

            if (planetTypesMode) {
              return Object.values(mapTile.planets).length > 0 ? 1.0 : 0.2;
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
        onClick={
          onTileSelect ? () => onTileSelect(ringPosition, systemId) : undefined
        }
      >
        <div className={classes.tileContainer}>
          <Tile
            systemId={systemId}
            className={classes.tile}
            onMouseEnter={() => {
              setHoveredLocal(true);
              if (onTileHover) onTileHover(ringPosition, true);
            }}
            onMouseLeave={() => {
              setHoveredLocal(false);
              if (onTileHover) onTileHover(ringPosition, false);
            }}
          />

          <AnomalyOverlay
            show={mapTile.hasAnomaly}
            width={TILE_WIDTH}
            height={TILE_HEIGHT}
          />
          {/* <BorderAnomalyLayer mapTile={mapTile} /> */}
          <PlanetCirclesLayer
            systemId={systemId}
            mapTile={mapTile}
            position={position}
            onPlanetMouseEnter={onPlanetMouseEnter}
            onPlanetMouseLeave={onPlanetMouseLeave}
          />
          <PlanetaryShieldOverlayLayer systemId={systemId} mapTile={mapTile} />
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
          <div
            className={`${classes.ringPosition} ${
              isOrigin
                ? classes.ringPositionOrange
                : isTargetSelected
                  ? classes.ringPositionBlue
                  : ""
            }`}
          >
            {ringPosition}
          </div>

          {controllingFaction && overlaysEnabled && (
            <FactionColorOverlay faction={controllingFaction} opacity={0.3} />
          )}

          {pdsMode && (
            <PdsOverlayLayer
              ringPosition={ringPosition}
              dominantPdsFaction={gameData?.dominantPdsFaction}
              pdsByTile={gameData?.pdsByTile}
            />
          )}

          {isMovingMode || !!distanceMode ? (
            <div
              className={classes.interactiveOverlay}
              style={{ width: TILE_WIDTH, height: TILE_HEIGHT }}
              onMouseEnter={() => {
                setHoveredLocal(true);
                if (onTileHover) onTileHover(ringPosition, true);
              }}
              onMouseLeave={() => {
                setHoveredLocal(false);
                if (onTileHover) onTileHover(ringPosition, false);
              }}
            >
              <TileSelectedOverlay
                isSelected={!!isDistanceSelected || !!isTargetSelected}
                isHovered={isHoveredForDistance || hoveredLocal}
                isDistanceMode
                variant={isOrigin ? "origin" : "blue"}
                alwaysVisible={!!isOrigin}
              />
            </div>
          ) : (
            <TileSelectedOverlay
              isSelected={!!isDistanceSelected || !!isTargetSelected}
              isHovered={isHoveredForDistance || hoveredLocal}
              isDistanceMode={!!distanceMode || !!isTargetSelected}
            />
          )}
        </div>
      </div>
    );
  }
);
