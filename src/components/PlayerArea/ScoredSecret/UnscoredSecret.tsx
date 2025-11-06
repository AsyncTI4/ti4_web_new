import { Image } from "@mantine/core";
import { Chip } from "@/components/shared/primitives/Chip";

export function UnscoredSecret() {
  return (
    <Chip
      accent="deepRed"
      leftSection={<Image src="/so_icon.png" />}
      title="Unscored Secret"
      style={{ minWidth: 160 }}
    />
  );
}
