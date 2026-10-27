import { Image } from "@/ds";
import { TECH_COLOR_IMAGES } from "@/entities/data/uiImages";

export type TechType = "biotic" | "propulsion" | "cybernetic" | "warfare";

type Props = {
  techType: TechType;
  size?: number;
};

export const TECH_SKIP_IMAGES = {
  biotic: TECH_COLOR_IMAGES.green,
  propulsion: TECH_COLOR_IMAGES.blue,
  cybernetic: TECH_COLOR_IMAGES.yellow,
  warfare: TECH_COLOR_IMAGES.red,
} as const;

export function TechSkipIcon({ techType, size = 16 }: Props) {
  return (
    <Image src={TECH_SKIP_IMAGES[techType]} alt={techType} w={size} h={size} />
  );
}
