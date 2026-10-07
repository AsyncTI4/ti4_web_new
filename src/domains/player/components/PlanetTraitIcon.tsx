import { Image } from "@mantine/core";
import {
  getPlanetTraitIconSrc,
  mergePlanetTraits,
  type PlanetTrait,
} from "@/utils/planetTraits";
import { lowPriorityImageProps } from "@/shared/ui/imageLoading";

type Props =
  | { trait: PlanetTrait; traits?: never; size?: number }
  | { trait?: never; traits: PlanetTrait[]; size?: number };

export function PlanetTraitIcon(props: Props) {
  const size = props.size || 24;
  const traitSources = props.traits?.length
    ? props.traits
    : props.trait
      ? [props.trait]
      : undefined;

  const traits = mergePlanetTraits(traitSources);
  if (traits.length === 0) return null;

  const src = getPlanetTraitIconSrc(traits);
  if (!src) return null;

  const alt =
    traits.length === 1 ? traits[0] : `traits:${traits.join("").toUpperCase()}`;

  return (
    <Image {...lowPriorityImageProps} src={src} alt={alt} w={size} h={size} />
  );
}
