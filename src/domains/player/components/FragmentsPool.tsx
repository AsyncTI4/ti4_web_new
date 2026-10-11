import { FragmentStack } from "./FragmentStack";
import classes from "./FragmentsPool.module.css";

type Props = {
  fragments: string[];
  /**
   * Hold the shelf open when the player has none, so the readouts above it sit at
   * the same height on every seat in the deck.
   */
  reserveSpace?: boolean;
};

const FRAGMENT_TYPES = ["crf", "hrf", "irf", "urf"] as const;

export function FragmentsPool({ fragments, reserveSpace = false }: Props) {
  const fragmentCounts = FRAGMENT_TYPES.map((type) => ({
    type,
    count: fragments.filter((f) => f.startsWith(type)).length,
  }));

  if (fragmentCounts.every(({ count }) => count === 0)) {
    if (!reserveSpace) return null;
    return <span className={classes.emptyLabel}>No fragments</span>;
  }

  return (
    <span className={classes.pool}>
      {fragmentCounts.map(({ type, count }) => (
        <FragmentStack key={type} count={count} type={type} />
      ))}
    </span>
  );
}
