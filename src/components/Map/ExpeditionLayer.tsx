import { cdnImage } from "@/data/cdnImage";
import { ExpeditionTokens } from "./ExpeditionTokens";
import { useGameData } from "@/hooks/useGameContext";
import { useMemo } from "react";

type Props = {
  contentSize: {
    width: number;
    height: number;
  };
};

function useExpeditionVisibility() {
  const gameData = useGameData();

  const thundersEdgeOnBoard = useMemo(() => {
    if (!gameData?.mapTiles) return false;
    return gameData.mapTiles.some((tile) =>
      tile.planets?.some((planet) => planet.name === "thundersedge")
    );
  }, [gameData?.mapTiles]);

  const hasIncompleteExpeditions = useMemo(() => {
    if (!gameData?.expeditions) return false;
    return Object.values(gameData.expeditions).some(
      (expedition) => expedition.completedBy == null
    );
  }, [gameData?.expeditions]);

  return {
    shouldShow: hasIncompleteExpeditions && !thundersEdgeOnBoard,
    thundersEdgeOnBoard,
    hasIncompleteExpeditions,
  };
}

function calculateExpeditionPosition(contentSize: {
  width: number;
  height: number;
}) {
  const containerWidth = contentSize.width + 400;
  const expeditionsImageLeft =
    containerWidth >= 1200
      ? containerWidth - 1200 + 200
      : Math.max(0, containerWidth - 300) + 200;
  const expeditionsImageTop =
    contentSize.height >= 800
      ? contentSize.height - 800 + 200
      : Math.max(0, contentSize.height - 300) + 200;

  return {
    left: expeditionsImageLeft,
    top: expeditionsImageTop,
  };
}

export function ExpeditionLayer({ contentSize }: Props) {
  const gameData = useGameData();
  const visibility = useExpeditionVisibility();

  if (!gameData?.expeditions || !visibility.shouldShow) return null;

  const position = calculateExpeditionPosition(contentSize);

  console.log("gameData.expeditions", gameData.expeditions);

  return (
    <>
      <img
        src={cdnImage(`/general/Expeditions.png`)}
        alt="Expeditions"
        style={{
          position: "absolute",
          left: `${position.left}px`,
          top: `${position.top}px`,
          zIndex: 50,
        }}
      />
      <ExpeditionTokens
        expeditionsImageLeft={position.left}
        expeditionsImageTop={position.top}
      />
    </>
  );
}
