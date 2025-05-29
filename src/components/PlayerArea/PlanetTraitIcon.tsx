import { Image } from "@mantine/core";

type Props = {
  trait: "cultural" | "hazardous" | "industrial";
  size?: number;
};

export function PlanetTraitIcon({ trait, size = 24 }: Props) {
  return (
    <Image
      src={`/planet_attributes/pc_attribute_${trait}.png`}
      alt={trait}
      w={size}
      h={size}
    />
  );
}
