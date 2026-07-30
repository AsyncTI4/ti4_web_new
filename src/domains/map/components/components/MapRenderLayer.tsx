import { Box } from "@mantine/core";
import type { CSSProperties } from "react";
import { ExpeditionLayer } from "@/domains/map/components/ExpeditionLayer";
import { MapTilesRenderer } from "./MapTilesRenderer";
import { MapUnitDetailsCard } from "@/domains/game-shell/components/MapUnitDetailsCard";
import { MapPlanetDetailsCard } from "@/domains/game-shell/components/MapPlanetDetailsCard";
import type { GameData } from "@/app/providers/context/types";
import type { Tile } from "@/app/providers/context/types";
import classes from "@/shared/ui/map/MapUI.module.css";
import type { MapLayout } from "../mapLayout";
import { MapUnitTransitionLayer } from "../layers/MapUnitTransitionLayer";
import { isMobileDevice } from "@/utils/isTouchDevice";

type Props = {
  gameData: GameData | undefined;
  tilesList: Tile[];
  contentSize: { width: number; height: number };
  tileContainerStyle: CSSProperties;
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
  const replayAnimationsEnabled = !isMobileDevice();

  return (
    <>
      <Box className={classes.tileRenderingContainer} style={tileContainerStyle}>
        <MapTilesRenderer
          tiles={tilesList}
          playerData={gameData.playerData}
          statTilePositions={gameData.statTilePositions}
          onUnitMouseOver={onUnitMouseOver}
          onUnitMouseLeave={onUnitMouseLeave}
          onUnitSelect={onUnitSelect}
          onPlanetMouseEnter={onPlanetMouseEnter}
          onPlanetMouseLeave={onPlanetMouseLeave}
        />
        {replayAnimationsEnabled && <MapUnitTransitionLayer />}
        <ExpeditionLayer contentSize={contentSize} />
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
