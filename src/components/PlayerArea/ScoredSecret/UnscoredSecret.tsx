import { Chip } from "@/components/shared/primitives/Chip";
import { SecretObjectiveIcon } from "@/components/shared/SecretObjectiveIcon";

export function UnscoredSecret() {
  return (
    <Chip
      accent="deepRed"
      leftSection={<SecretObjectiveIcon />}
      title="Unscored Secret"
      style={{ minWidth: 160 }}
    />
  );
}
