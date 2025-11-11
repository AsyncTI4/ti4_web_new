import { MapTile } from "@/components/Map/MapTile";
import { PlayerStatsArea } from "@/components/Map/PlayerStatsArea";
import { Tile } from "@/context/types";
import type { PlayerData } from "@/data/types";

type Props = {
  tiles: Tile[];
  playerData: PlayerData[] | undefined;
  statTilePositions: Record<string, string[]> | undefined;
  isMovingMode: boolean;
  isOrigin: (position: string) => boolean;
  selectedTiles: string[];
  isOnPath: (systemId: string) => boolean;
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
            isMovingMode={isMovingMode}
            isOrigin={isOrigin(tile.position)}
            selectedTiles={selectedTiles}
            isOnPath={isOnPath(tile.position)}
            isTargetSelected={isTargetSelected(tile.position)}
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
