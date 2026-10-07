import {
  processSecretObjectives,
  createSecretSections,
} from "@/domains/cards/model/secretObjectiveProcessor";
import { SecretModal } from "@/domains/cards/components/SecretModal/SecretModal";

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
