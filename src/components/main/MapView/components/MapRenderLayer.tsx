import { Box } from "@mantine/core";
import type { CSSProperties } from "react";
import { ExpeditionLayer } from "@/components/Map/ExpeditionLayer";
import { MapTilesRenderer } from "./MapTilesRenderer";
import { PathVisualization } from "@/components/PathVisualization";
import { MapUnitDetailsCard } from "@/components/main/MapUnitDetailsCard";
import { MapPlanetDetailsCard } from "@/components/main/MapPlanetDetailsCard";
import type { GameData } from "@/context/types";
import type { PathResult } from "@/utils/tileDistances";
import type { Tile } from "@/context/types";
import classes from "@/components/MapUI.module.css";
import type { MapLayout } from "../mapLayout";

type Props = {
  gameData: GameData | undefined;
  tilesList: Tile[];
  contentSize: { width: number; height: number };
  tileContainerStyle: CSSProperties;
  hoveredTilePosition: string | null;
  selectedTiles: string[];
  systemsOnPath: Set<string>;
  targetSystemId?: string | null;
  pathResult: PathResult | null;
  activePathIndex: number;
  showPathVisualization: boolean;
  onPathIndexChange: (index: number) => void;
  isMovingMode: boolean;
  isOrigin: (position: string) => boolean;
  onTileSelect: (position: string, systemId: string) => void;
  onTileHover: (position: string, isHovered: boolean) => void;
  onUnitMouseOver: (faction: string, unitId: string, x: number, y: number) => void;
  onUnitMouseLeave: () => void;
  onUnitSelect: (faction: string) => void;
  onPlanetMouseEnter: (planetId: string, x: number, y: number) => void;
  onPlanetMouseLeave: () => void;
  tooltipUnit: unknown;
  tooltipPlanet: unknown;
  mapLayout: MapLayout;
  mapPadding: number;
  mapZoom: number;
};

export function MapRenderLayer({
  gameData,
  tilesList,
  contentSize,
  tileContainerStyle,
  hoveredTilePosition,
  selectedTiles,
  systemsOnPath,
  targetSystemId,
  pathResult,
  activePathIndex,
  showPathVisualization,
  onPathIndexChange,
  isMovingMode,
  isOrigin,
  onTileSelect,
  onTileHover,
  onUnitMouseOver,
  onUnitMouseLeave,
  onUnitSelect,
  onPlanetMouseEnter,
  onPlanetMouseLeave,
  tooltipUnit,
  tooltipPlanet,
  mapLayout,
  mapPadding,
  mapZoom,
}: Props) {
  if (!gameData) return null;

  const isOnPath = (position: string) =>
    targetSystemId ? true : systemsOnPath.has(position);
  const isTargetSelected = (systemId: string) =>
    targetSystemId ? systemId === targetSystemId : false;

  return (
    <>
      <Box className={classes.tileRenderingContainer} style={tileContainerStyle}>
        <MapTilesRenderer
          tiles={tilesList}
          playerData={gameData.playerData}
          statTilePositions={gameData.statTilePositions}
          isMovingMode={isMovingMode}
          isOrigin={isOrigin}
          selectedTiles={selectedTiles}
          isOnPath={isOnPath}
          isTargetSelected={isTargetSelected}
          hoveredTilePosition={hoveredTilePosition}
          onUnitMouseOver={onUnitMouseOver}
          onUnitMouseLeave={onUnitMouseLeave}
          onUnitSelect={onUnitSelect}
          onPlanetMouseEnter={onPlanetMouseEnter}
          onPlanetMouseLeave={onPlanetMouseLeave}
          onTileSelect={onTileSelect}
          onTileHover={onTileHover}
        />
        <ExpeditionLayer contentSize={contentSize} />
        {showPathVisualization && (
          <PathVisualization
            pathResult={pathResult}
            activePathIndex={activePathIndex}
            onPathIndexChange={onPathIndexChange}
            mapLayout={mapLayout}
            mapZoom={mapZoom}
            containerMode="tileContainer"
            renderSelectorInPortal
          />
        )}
      </Box>

      <MapUnitDetailsCard
        tooltipUnit={tooltipUnit}
        mapPadding={mapPadding}
        mapZoom={mapZoom}
        mapLayout={mapLayout}
      />
      <MapPlanetDetailsCard
        tooltipPlanet={tooltipPlanet}
        mapPadding={mapPadding}
        mapZoom={mapZoom}
        mapLayout={mapLayout}
      />
    </>
  );
}
