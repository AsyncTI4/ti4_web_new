import { Image } from "@mantine/core";
import cx from "clsx";
import { cdnImage } from "@/entities/data/cdnImage";
import styles from "./FragmentStack.module.css";
import { lowPriorityImageProps } from "@/shared/ui/imageLoading";

type FragmentType = "crf" | "hrf" | "irf" | "urf";

type Props = {
  count: number;
  type: FragmentType;
};

/** Three of a kind buys a relic. */
const RELIC_EXCHANGE_COUNT = 3;

const FRAGMENT_LABELS: Record<FragmentType, string> = {
  crf: "cultural",
  hrf: "hazardous",
  irf: "industrial",
  urf: "frontier",
};

const FRAGMENT_SOURCES: Record<FragmentType, string> = {
  crf: cdnImage("/player_area/pa_fragment_crf.png"),
  hrf: cdnImage("/player_area/pa_fragment_hrf.png"),
  irf: cdnImage("/player_area/pa_fragment_irf.png"),
  urf: cdnImage("/player_area/pa_fragment_urf.png"),
};

export function FragmentStack({ count, type }: Props) {
  if (count === 0) return null;

  const relicReady = count >= RELIC_EXCHANGE_COUNT;
  const kind = FRAGMENT_LABELS[type];

  return (
    <div
      className={cx(styles.stack, relicReady && styles.ready)}
      title={
        relicReady
          ? `${count} ${kind} fragments — enough to purge for a relic`
          : `${count} ${kind} fragment${count === 1 ? "" : "s"}`
      }
    >
      {Array.from({ length: count }, (_, index) => (
        <Image
          {...lowPriorityImageProps}
          key={index}
          src={FRAGMENT_SOURCES[type]}
          alt=""
          className={cx(styles.fragment, index > 0 && styles.stacked)}
        />
      ))}
      {relicReady && <span className={styles.readyCount}>{count}</span>}
    </div>
  );
}
