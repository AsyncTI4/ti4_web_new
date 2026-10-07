import {
  processSecretObjectives,
  createSecretSections,
} from "@/utils/secretObjectiveProcessor";
import { SecretModal } from "@/shared/ui/SecretModal";

type Props = {
  deck: string[];
  discard: string[];
};

export function SecretDeckDetailsCard({ deck, discard }: Props) {
  const sections = createSecretSections(
    processSecretObjectives(deck),
    processSecretObjectives(discard),
    deck,
  );

  return <SecretModal sections={sections} />;
}
