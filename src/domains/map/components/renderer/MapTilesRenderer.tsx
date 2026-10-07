import { MapTile } from "@/domains/map/components/MapTile";
import { PlayerStatsArea } from "@/domains/map/components/PlayerStatsArea";
import type { Tile } from "@/entities/game/types";
import type { PlayerData } from "@/entities/data/types";
import { computeControlOpenSides } from "@/entities/game/controlBorders";
import { memo } from "react";

type Props = {
  tiles: Tile[];
  playerData: PlayerData[] | undefined;
  statTilePositions: Record<string, string[]> | undefined;
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
};

export const MapTilesRenderer = memo(function MapTilesRenderer({
  tiles,
  playerData,
  statTilePositions,
  onUnitMouseOver,
  onUnitMouseLeave,
  onUnitSelect,
  onPlanetMouseEnter,
  onPlanetMouseLeave,
}: Props) {
  const controlOpenSides = computeControlOpenSides(tiles);

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
      {tiles.map((tile, index) => (
        <MapTile
          key={`${tile.position}-${index}`}
          mapTile={tile}
          controlOpenSides={controlOpenSides[tile.position]}
          onUnitMouseOver={onUnitMouseOver}
          onUnitMouseLeave={onUnitMouseLeave}
          onUnitSelect={onUnitSelect}
          onPlanetMouseEnter={onPlanetMouseEnter}
          onPlanetMouseLeave={onPlanetMouseLeave}
        />
      ))}
    </>
  );
});
