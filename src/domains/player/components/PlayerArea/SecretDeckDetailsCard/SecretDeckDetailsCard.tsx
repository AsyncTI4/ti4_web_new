import { useMemo } from "react";
import {
  processSecretObjectives,
  createSecretSections,
} from "@/utils/secretObjectiveProcessor";
import { SecretModal } from "@/shared/ui/SecretModal";
import { PlayerData } from "@/entities/data/types";

type Props = {
  deck: string[];
  discard: string[];
  playerData: PlayerData[];
};

export function SecretDeckDetailsCard({ deck, discard, playerData }: Props) {
  // Memoized data processing using the specialized secret processor
  const sections = useMemo(() => {
    const deckData = processSecretObjectives(deck, playerData);
    const discardData = processSecretObjectives(discard, playerData);

    return createSecretSections(deckData, discardData, deck);
  }, [deck, discard, playerData]);

  return <SecretModal sections={sections} />;
}
