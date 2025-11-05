import { CommandCounterStack } from "../CommandCounterStack";

type Props = {
  systemId: string;
  factions: string[] | undefined;
};

export function CommandCounterLayer({ systemId, factions }: Props) {
  if (!factions || factions.length === 0) return null;
  return (
    <CommandCounterStack
      key={`${systemId}-command-stack`}
      factions={factions}
      style={{ position: "absolute", left: "0px", top: "0px", zIndex: 52 }}
    />
  );
}
