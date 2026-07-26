import { Group } from "@mantine/core";
import { FragmentStack } from "./FragmentStack";
import classes from "./FragmentsPool.module.css";

type Props = {
  fragments: string[];
  /**
   * Hold the shelf open when the player has none, so the readouts above it sit at
   * the same height on every card in the band.
   */
  reserveSpace?: boolean;
};

export function FragmentsPool({ fragments, reserveSpace = false }: Props) {
  // Count fragments by type
  const fragmentCounts = {
    cultural: fragments.filter((f: string) => f.startsWith("crf")).length,
    hazardous: fragments.filter((f: string) => f.startsWith("hrf")).length,
    industrial: fragments.filter((f: string) => f.startsWith("irf")).length,
    unknown: fragments.filter((f: string) => f.startsWith("urf")).length,
  };

  if (
    fragmentCounts.hazardous === 0 &&
    fragmentCounts.industrial === 0 &&
    fragmentCounts.unknown === 0 &&
    fragmentCounts.cultural === 0
  ) {
    if (!reserveSpace) return null;

    return (
      <Group gap="xs" p="xs" justify="center" className={classes.empty}>
        <span className={classes.emptyLabel}>No fragments</span>
      </Group>
    );
  }

  return (
    <Group gap="xs" p="xs">
      <FragmentStack count={fragmentCounts.cultural} type="crf" />
      <FragmentStack count={fragmentCounts.hazardous} type="hrf" />
      <FragmentStack count={fragmentCounts.industrial} type="irf" />
      <FragmentStack count={fragmentCounts.unknown} type="urf" />
    </Group>
  );
}
