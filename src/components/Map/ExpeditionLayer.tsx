import { cdnImage } from "@/data/cdnImage";
import { ExpeditionTokens } from "./ExpeditionTokens";
import { useGameData } from "@/hooks/useGameContext";
import { useMemo } from "react";
import { useAppStore, useSettingsStore } from "@/utils/appStore";

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

function calculateExpeditionPosition(
  contentSize: {
    width: number;
    height: number;
  },
  isFirefox: boolean,
  zoom: number
) {
  const baseHeight = isFirefox ? contentSize.height / zoom : contentSize.height;
  const expeditionsImageLeft = 100;
  const expeditionsImageTop = baseHeight - 400;
  return {
    left: expeditionsImageLeft,
    top: expeditionsImageTop,
  };
}

export function ExpeditionLayer({ contentSize }: Props) {
  const gameData = useGameData();
  const visibility = useExpeditionVisibility();
  const zoom = useAppStore((state) => state.zoomLevel);
  const settings = useSettingsStore((state) => state.settings);

  if (!gameData?.expeditions || !visibility.shouldShow) return null;

  const position = calculateExpeditionPosition(
    contentSize,
    settings.isFirefox,
    zoom
  );

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
