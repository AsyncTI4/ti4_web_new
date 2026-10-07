import {
  Profiler,
  type ComponentProps,
  type CSSProperties,
  type ProfilerOnRenderCallback,
} from "react";
import type { GameData, Tile } from "@/entities/game/types";
import { recordPerformanceMeasure } from "@/utils/performanceMarks";
import { MapRenderLayer } from "./MapRenderLayer";
import {
  getMapContainerOffset,
  getMapScaleStyle,
  type MapLayoutConfig,
} from "../mapLayout";

type Dimensions = {
  width: number;
  height: number;
};

const recordInteractiveMapRender: ProfilerOnRenderCallback = (
  id,
  phase,
  actualDuration,
  baseDuration,
  startTime,
  commitTime,
) => {
  recordPerformanceMeasure(
    "ti4.reactProfiler.InteractiveMapRenderer",
    startTime,
    commitTime,
    {
      id,
      phase,
      actualDuration,
      baseDuration,
      startTime,
      commitTime,
    },
  );
};

type InteractiveMapRendererProps = {
  mapLayoutConfig: MapLayoutConfig;
  zoom: number;
  isFirefox: boolean;
  contentSize: Dimensions;
  layoutWidthOverride?: number;
  layoutHeightOverride?: number;
  widthOverride?: number;
  heightOverride?: number;
  styleOverrides?: CSSProperties;
  gameData: GameData | undefined;
  tilesList: Tile[];
  onUnitMouseOver: (
    faction: string,
    unitId: string,
    x: number,
    y: number,
  ) => void;
  onUnitMouseLeave: () => void;
  onUnitSelect: (faction: string) => void;
  onPlanetMouseEnter: (planetId: string, x: number, y: number) => void;
  onPlanetMouseLeave: () => void;
  tooltipUnit: ComponentProps<typeof MapRenderLayer>["tooltipUnit"];
  tooltipPlanet: ComponentProps<typeof MapRenderLayer>["tooltipPlanet"];
};

export function InteractiveMapRenderer({
  mapLayoutConfig,
  zoom,
  isFirefox,
  contentSize,
  layoutWidthOverride,
  layoutHeightOverride,
  widthOverride,
  heightOverride,
  styleOverrides,
  gameData,
  tilesList,
  onUnitMouseOver,
  onUnitMouseLeave,
  onUnitSelect,
  onPlanetMouseEnter,
  onPlanetMouseLeave,
  tooltipUnit,
  tooltipPlanet,
}: InteractiveMapRendererProps) {
  const { layout } = mapLayoutConfig;
  const hasLayoutOverride =
    typeof layoutWidthOverride === "number" ||
    typeof layoutHeightOverride === "number";
  const tileContainerStyle: CSSProperties = {
    ...getMapScaleStyle(mapLayoutConfig, zoom, isFirefox),
    ...getMapContainerOffset(mapLayoutConfig, zoom),
    width: widthOverride ?? contentSize.width,
    height: heightOverride ?? contentSize.height,
    ...(hasLayoutOverride ? {} : styleOverrides),
  };

  const renderLayer = (
    <MapRenderLayer
      gameData={gameData}
      tilesList={tilesList}
      contentSize={contentSize}
      tileContainerStyle={tileContainerStyle}
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
  const profiledRenderLayer = (
    <Profiler
      id={`InteractiveMapRenderer:${layout}`}
      onRender={recordInteractiveMapRender}
    >
      {renderLayer}
    </Profiler>
  );

  if (!hasLayoutOverride) {
    return profiledRenderLayer;
  }

  return (
    <div
      style={{
        position: "relative",
        width: layoutWidthOverride ?? widthOverride ?? contentSize.width,
        height: layoutHeightOverride ?? heightOverride ?? contentSize.height,
        ...styleOverrides,
      }}
    >
      {profiledRenderLayer}
    </div>
  );
}
