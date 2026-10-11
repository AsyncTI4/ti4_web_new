import cx from "clsx";
import { cdnImage } from "@/entities/data/cdnImage";
import styles from "./FragmentStack.module.css";

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

/**
 * One kind of relic fragment, the sprites overlapping. At three of a kind the
 * stack seats itself in a relic-gold cradle with the count stamped on it.
 */
export function FragmentStack({ count, type }: Props) {
  if (count === 0) return null;

  const relicReady = count >= RELIC_EXCHANGE_COUNT;
  const kind = FRAGMENT_LABELS[type];
  const src = cdnImage(`/player_area/pa_fragment_${type}.png`);

  return (
    <span
      className={cx(styles.stack, relicReady && styles.ready)}
      data-ready={relicReady ? count : undefined}
      title={
        relicReady
          ? `${count} ${kind} fragments — enough to purge for a relic`
          : `${count} ${kind} fragment${count === 1 ? "" : "s"}`
      }
    >
      {Array.from({ length: count }, (_, index) => (
        <img key={index} src={src} alt="" loading="lazy" />
      ))}
    </span>
  );
}
