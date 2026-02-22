import { Chip } from "@/shared/ui/primitives/Chip";
import { SecretObjectiveIcon } from "@/shared/ui/SecretObjectiveIcon";

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
