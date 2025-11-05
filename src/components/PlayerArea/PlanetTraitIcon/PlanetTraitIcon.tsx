import { Image } from "@mantine/core";
import { cdnImage } from "../../../data/cdnImage";

type SingleTrait = "cultural" | "hazardous" | "industrial";

type Props =
  | { trait: SingleTrait; traits?: never; size?: number }
  | { trait?: never; traits: SingleTrait[]; size?: number };

export function PlanetTraitIcon(props: Props) {
  const size = ("size" in props && props.size) || 24;

  const traits: SingleTrait[] = Array.from(
    new Set(
      ("traits" in props && props.traits && props.traits.length > 0
        ? props.traits
        : "trait" in props && props.trait
          ? [props.trait]
          : []) as SingleTrait[]
    )
  );

  if (traits.length <= 1) {
    const trait = traits[0];
    return trait ? (
      <Image
        src={`/planet_attributes/pc_attribute_${trait}.png`}
        alt={trait}
        w={size}
        h={size}
      />
    ) : null;
  }

  const hasC = traits.includes("cultural");
  const hasH = traits.includes("hazardous");
  const hasI = traits.includes("industrial");

  const allThree = hasC && hasH && hasI;
  const suffix = allThree
    ? "CHI"
    : `${hasC ? "C" : ""}${hasH ? "H" : ""}${hasI ? "I" : ""}`;

  const src = cdnImage(`/planet_cards/pc_attribute_combo_${suffix}.png`);
  return <Image src={src} alt={`traits:${suffix}`} w={size} h={size} />;
}
