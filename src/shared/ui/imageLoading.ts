import type { ImgHTMLAttributes } from "react";

export const boardImageLoadingProps = {
  decoding: "async",
  loading: "eager",
  fetchPriority: "high",
} satisfies ImgHTMLAttributes<HTMLImageElement>;

export const lowPriorityImageProps = {
  decoding: "async",
  loading: "lazy",
  fetchPriority: "low",
} satisfies ImgHTMLAttributes<HTMLImageElement>;
