import { cdnImage } from "@/data/cdnImage";
import { ExpeditionTokens } from "./ExpeditionTokens";
import { useGameData } from "@/hooks/useGameContext";

type Props = {
  contentSize: {
    width: number;
    height: number;
  };
};
export function ExpeditionLayer({ contentSize }: Props) {
  const gameData = useGameData();
  if (!gameData?.expeditions) return null;

  const hasIncompleteExpeditions = Object.values(gameData.expeditions).some(
    (expedition) => expedition.completedBy === null
  );
  if (!hasIncompleteExpeditions) return null;

  return (
    <>
      <img
        src={cdnImage(`/general/Expeditions.png`)}
        alt="Expeditions"
        style={{
          position: "absolute",
          left: contentSize.width,
          top: contentSize.height - 800,
        }}
      />
      <ExpeditionTokens
        expeditionsImageLeft={contentSize.width}
        expeditionsImageTop={contentSize.height - 800}
      />
    </>
  );
}
