import { Image } from "@mantine/core";
import {
  getPlanetTraitIconSrc,
  mergePlanetTraits,
  type PlanetTrait,
} from "@/utils/planetTraits";

type Props =
  | { trait: PlanetTrait; traits?: never; size?: number }
  | { trait?: never; traits: PlanetTrait[]; size?: number };

export function PlanetTraitIcon(props: Props) {
  const size = ("size" in props && props.size) || 24;

  const traitSources =
    "traits" in props && props.traits && props.traits.length > 0
      ? props.traits
      : "trait" in props && props.trait
        ? [props.trait]
        : undefined;

  const traits = mergePlanetTraits(traitSources);
  if (traits.length === 0) return null;

  const src = getPlanetTraitIconSrc(traits);
  if (!src) return null;

  const alt =
    traits.length === 1 ? traits[0] : `traits:${traits.join("").toUpperCase()}`;

  return <Image src={src} alt={alt} w={size} h={size} />;
}
