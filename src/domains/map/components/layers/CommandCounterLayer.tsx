import { CommandCounterStack } from "../CommandCounterStack";
import { useMapReplay } from "@/hooks/useGameContext";

type Props = {
  systemId: string;
  position: string;
  factions: string[] | undefined;
};

export function CommandCounterLayer({ systemId, position, factions }: Props) {
  const replay = useMapReplay();
  if (!factions || factions.length === 0) return null;
  const hiddenIndices = replay.active
    ? new Set(
        replay.commandTokens
          .filter(
            (token) => token.position === position && token.kind !== "removed",
          )
          .map((token) => token.index),
      )
    : undefined;
  return (
    <CommandCounterStack
      key={`${systemId}-command-stack`}
      factions={factions}
      hiddenIndices={hiddenIndices}
      style={{ position: "absolute", left: "0px", top: "0px", zIndex: 52 }}
    />
  );
}
