import { Group, Image } from "@mantine/core";
import cx from "clsx";
import { cdnImage } from "../../../data/cdnImage";
import styles from "./FragmentStack.module.css";

type FragmentType = "crf" | "hrf" | "irf" | "urf";

type Props = {
  count: number;
  type: FragmentType;
};

export function FragmentStack({ count, type }: Props) {
  const fragmentSrc = getFragmentSrc(type);

  if (count === 0) return null;

  return (
    <Group gap={0}>
      {Array.from({ length: count }, (_, index) => (
        <Image
          key={index}
          src={fragmentSrc}
          className={cx(styles.fragment, index > 0 && styles.stacked)}
        />
      ))}
    </Group>
  );
}

const FRAGMENT_SOURCES: Record<FragmentType, string> = {
  crf: cdnImage("/player_area/pa_fragment_crf.png"),
  hrf: cdnImage("/player_area/pa_fragment_hrf.png"),
  irf: cdnImage("/player_area/pa_fragment_irf.png"),
  urf: cdnImage("/player_area/pa_fragment_urf.png"),
};

const getFragmentSrc = (type: FragmentType) => FRAGMENT_SOURCES[type] || FRAGMENT_SOURCES.crf;
