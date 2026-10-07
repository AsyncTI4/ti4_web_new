import { Image } from "@mantine/core";
import styles from "./CircularFactionIcon.module.css";
import cx from "clsx";
import { useFactionImageUrl } from "@/hooks/useFactionImages";
import { lowPriorityImageProps } from "@/shared/ui/imageLoading";

type Props = {
  faction: string;
  size?: number;
  className?: string;
  factionImageOverride?: string | null;
  factionImageTypeOverride?: string | null;
};

export function CircularFactionIcon({
  faction,
  size = 28,
  className,
  factionImageOverride,
  factionImageTypeOverride,
}: Props) {
  const factionUrl = useFactionImageUrl(
    faction,
    factionImageOverride,
    factionImageTypeOverride,
  );

  return (
    <Image
      {...lowPriorityImageProps}
      src={factionUrl}
      alt={faction}
      w={size}
      h={size}
      className={cx(styles.factionIcon, className)}
    />
  );
}
