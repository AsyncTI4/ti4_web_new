import { SimpleGrid } from "@mantine/core";
import React from "react";
import PlayerCard2Mid from "./PlayerCard2Mid";


const MemoizedPlayerCard2Mid = React.memo(PlayerCard2Mid);

export function PlayerAreasGrid({
  playerData,
  colorToFaction,
  factionToColor,
  planetAttachments,
}: {
  playerData: any[];
  colorToFaction: Record<string, string>;
  factionToColor: Record<string, string>;
  planetAttachments: Record<string, string[]>;
}) {
  return (
    <SimpleGrid cols={{ base: 1, xl3: 2 }} spacing="md">
      {playerData.map((player) => (
        <MemoizedPlayerCard2Mid
          key={player.color}
          playerData={player}
          colorToFaction={colorToFaction}
          factionToColor={factionToColor}
          planetAttachments={planetAttachments}
        />
      ))}
    </SimpleGrid>
  );
}

export const MemoizedPlayerAreasGrid = React.memo(PlayerAreasGrid, (prevProps, nextProps) => {
  return (
    JSON.stringify(prevProps.playerData) === JSON.stringify(nextProps.playerData) &&
    JSON.stringify(prevProps.colorToFaction) === JSON.stringify(nextProps.colorToFaction) &&
    JSON.stringify(prevProps.factionToColor) === JSON.stringify(nextProps.factionToColor) &&
    JSON.stringify(prevProps.planetAttachments) === JSON.stringify(nextProps.planetAttachments)
  );
});