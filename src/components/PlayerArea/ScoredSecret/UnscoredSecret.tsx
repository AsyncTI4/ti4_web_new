import { Image } from "@mantine/core";
import { Chip } from "@/components/shared/primitives/Chip";
import { isMobileDevice } from "@/utils/isTouchDevice";

export function UnscoredSecret() {
  return (
    <Chip
      accent="deepRed"
      leftSection={!isMobileDevice() ? <Image src="/so_icon.png" /> : undefined}
      title="Unscored Secret"
    />
  );
}
