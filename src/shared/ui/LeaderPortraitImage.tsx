import { Image, type ImageProps } from "@/ds";
import type { ImgHTMLAttributes } from "react";

const EMPTY_PORTRAIT =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1" height="1"/%3E';

type Props = Omit<ImageProps, "src" | "fallbackSrc"> &
  Pick<
    ImgHTMLAttributes<HTMLImageElement>,
    "loading" | "decoding" | "fetchPriority"
  > & {
    leaderId: string;
  };

export function LeaderPortraitImage({ leaderId, ...imageProps }: Props) {
  return (
    <Image
      key={leaderId}
      alt=""
      {...imageProps}
      src={`/leaders/${leaderId}.webp`}
      fallbackSrc={EMPTY_PORTRAIT}
    />
  );
}
