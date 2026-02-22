import { Image, type ImageProps } from "@mantine/core";

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
      src="/so_icon.png"
      w={w ?? size}
      h={h ?? size}
      {...props}
    />
  );
}
