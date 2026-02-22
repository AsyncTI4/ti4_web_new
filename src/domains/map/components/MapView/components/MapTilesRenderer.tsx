import { MapTile } from "@/domains/map/components/Map/MapTile";
import { PlayerStatsArea } from "@/domains/map/components/Map/PlayerStatsArea";
import { Tile } from "@/app/providers/context/types";
import type { PlayerData } from "@/entities/data/types";
import { computeControlOpenSides } from "@/utils/controlBorders";
import { useMemo } from "react";

type Props = {
  tiles: Tile[];
  playerData: PlayerData[] | undefined;
  statTilePositions: Record<string, string[]> | undefined;
  isMovingMode: boolean;
  isOrigin: (position: string) => boolean;
  selectedTiles: string[];
  isOnPath: (position: string) => boolean;
  isTargetSelected: (systemId: string) => boolean;
  hoveredTilePosition: string | null;
  onUnitMouseOver: (
    faction: string,
    unitId: string,
    x: number,
    y: number
  ) => void;
  onUnitMouseLeave: () => void;
  onUnitSelect: (faction: string) => void;
  onPlanetMouseEnter: (planetId: string, x: number, y: number) => void;
  onPlanetMouseLeave: () => void;
  onTileSelect: (position: string, systemId: string) => void;
  onTileHover: (position: string, isHovered: boolean) => void;
};

export function MapTilesRenderer({
  tiles,
  playerData,
  statTilePositions,
  isMovingMode,
  isOrigin,
  selectedTiles,
  isOnPath,
  isTargetSelected,
  hoveredTilePosition,
  onUnitMouseOver,
  onUnitMouseLeave,
  onUnitSelect,
  onPlanetMouseEnter,
  onPlanetMouseLeave,
  onTileSelect,
  onTileHover,
}: Props) {
  const controlOpenSides = useMemo(
    () => computeControlOpenSides(tiles),
    [tiles]
  );

  return (
    <>
      {playerData &&
        statTilePositions &&
        Object.entries(statTilePositions).map(([faction, statTiles]) => {
          const player = playerData.find((p) => p.faction === faction);
          if (!player) return null;

          return (
            <PlayerStatsArea
              key={faction}
              faction={faction}
              playerData={player}
              statTilePositions={statTiles}
            />
          );
        })}
      {tiles.map((tile, index) => {
        return (
          <MapTile
            key={`${tile.position}-${index}`}
            mapTile={tile}
            controlOpenSides={controlOpenSides[tile.position]}
            isMovingMode={isMovingMode}
            isOrigin={isOrigin(tile.position)}
            selectedTiles={selectedTiles}
            isOnPath={isOnPath(tile.position)}
            isTargetSelected={isTargetSelected(tile.systemId)}
            hoveredTilePosition={hoveredTilePosition}
            onUnitMouseOver={onUnitMouseOver}
            onUnitMouseLeave={onUnitMouseLeave}
            onUnitSelect={onUnitSelect}
            onPlanetMouseEnter={onPlanetMouseEnter}
            onPlanetMouseLeave={onPlanetMouseLeave}
            onTileSelect={onTileSelect}
            onTileHover={onTileHover}
          />
        );
      })}
    </>
  );
}
