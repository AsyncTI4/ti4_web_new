import { Image, type ImageProps } from "@mantine/core";
import { lowPriorityImageProps } from "@/shared/ui/imageLoading";

export type SecretObjectiveIconProps = Omit<ImageProps, "src"> & {
  size?: number;
};

export function SecretObjectiveIcon({
  size,
  w,
  h,
  ...props
}: SecretObjectiveIconProps) {
  return (
    <Image
      {...lowPriorityImageProps}
      src="/so_icon.png"
      w={w ?? size}
      h={h ?? size}
      {...props}
    />
  );
}
