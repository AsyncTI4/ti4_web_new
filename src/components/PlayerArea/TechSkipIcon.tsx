import { Image } from "@mantine/core";

export type TechType = "biotic" | "propulsion" | "cybernetic" | "warfare";

type Props = {
  techType: TechType;
  size?: number;
};

const TECH_SKIP_IMAGES = {
  biotic: "/green.png",
  propulsion: "/blue.png",
  cybernetic: "/yellow.png",
  warfare: "/red.png",
} as const;

export function TechSkipIcon({ techType, size = 16 }: Props) {
  return (
    <Image src={TECH_SKIP_IMAGES[techType]} alt={techType} w={size} h={size} />
  );
}
