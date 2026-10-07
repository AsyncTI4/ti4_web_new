import { cdnImage } from "@/entities/data/cdnImage";
import { ExpeditionTokens } from "./ExpeditionTokens";
import { useGameData } from "@/state/useGameContext";

type Props = {
  contentSize: {
    width: number;
    height: number;
  };
};

export function ExpeditionLayer({ contentSize }: Props) {
  const gameData = useGameData();
  const hasIncompleteExpeditions = Object.values(
    gameData?.expeditions ?? {},
  ).some((expedition) => expedition.completedBy == null);

  if (!hasIncompleteExpeditions) return null;

  const left = 100;
  const top = contentSize.height - 400;

  return (
    <>
      <img
        src={cdnImage(`/general/Expeditions.png`)}
        alt="Expeditions"
        style={{ position: "absolute", left, top, zIndex: 50 }}
      />
      <ExpeditionTokens expeditionsImageLeft={left} expeditionsImageTop={top} />
    </>
  );
}
