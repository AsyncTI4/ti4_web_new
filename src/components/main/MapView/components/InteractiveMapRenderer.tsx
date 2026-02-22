import type { CSSProperties } from "react";
import type { GameData, Tile } from "@/context/types";
import type { PathResult } from "@/utils/tileDistances";
import { MapRenderLayer } from "./MapRenderLayer";
import {
  getMapContainerOffset,
  getMapScaleStyle,
  type MapLayout,
  type MapLayoutConfig,
} from "../mapLayout";

type Dimensions = {
  width: number;
  height: number;
};

export type InteractiveMapRendererProps = {
  layout: MapLayout;
  mapLayoutConfig: MapLayoutConfig;
  zoom: number;
  isFirefox: boolean;
  contentSize: Dimensions;
  widthOverride?: number;
  heightOverride?: number;
  styleOverrides?: CSSProperties;
  gameData: GameData | undefined;
  tilesList: Tile[];
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
};

export function InteractiveMapRenderer({
  layout,
  mapLayoutConfig,
  zoom,
  isFirefox,
  contentSize,
  widthOverride,
  heightOverride,
  styleOverrides,
  gameData,
  tilesList,
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
}: InteractiveMapRendererProps) {
  const tileContainerStyle: CSSProperties = {
    ...getMapScaleStyle(mapLayoutConfig, zoom, isFirefox),
    ...getMapContainerOffset(mapLayoutConfig, zoom),
    width: widthOverride ?? contentSize.width,
    height: heightOverride ?? contentSize.height,
    ...styleOverrides,
  };

  return (
    <MapRenderLayer
      gameData={gameData}
      tilesList={tilesList}
      contentSize={contentSize}
      tileContainerStyle={tileContainerStyle}
      hoveredTilePosition={hoveredTilePosition}
      selectedTiles={selectedTiles}
      systemsOnPath={systemsOnPath}
      targetSystemId={targetSystemId}
      pathResult={pathResult}
      activePathIndex={activePathIndex}
      showPathVisualization={showPathVisualization}
      onPathIndexChange={onPathIndexChange}
      isMovingMode={isMovingMode}
      isOrigin={isOrigin}
      onTileSelect={onTileSelect}
      onTileHover={onTileHover}
      onUnitMouseOver={onUnitMouseOver}
      onUnitMouseLeave={onUnitMouseLeave}
      onUnitSelect={onUnitSelect}
      onPlanetMouseEnter={onPlanetMouseEnter}
      onPlanetMouseLeave={onPlanetMouseLeave}
      tooltipUnit={tooltipUnit}
      tooltipPlanet={tooltipPlanet}
      mapLayout={layout}
      mapPadding={mapLayoutConfig.mapPadding}
      mapZoom={zoom}
    />
  );
}
