import { Image, ImageProps } from "@mantine/core";
import { useFactionImageUrl } from "@/hooks/useFactionImages";
import { lowPriorityImageProps } from "@/shared/ui/imageLoading";

type Props = {
  faction: string;
  factionImageOverride?: string | null;
  factionImageTypeOverride?: string | null;
  alt?: string;
} & Omit<ImageProps, "src">;

export function FactionIcon({
  faction,
  factionImageOverride,
  factionImageTypeOverride,
  ...imageProps
}: Props) {
  const factionUrl = useFactionImageUrl(
    faction,
    factionImageOverride,
    factionImageTypeOverride,
  );

  if (!factionUrl) return null;

  return <Image {...lowPriorityImageProps} src={factionUrl} {...imageProps} />;
}
