import { Group, SimpleGrid } from "@mantine/core";
import { FragmentStack } from "../FragmentStack";

type Props = {
  fragments: string[];
};

export function FragmentsPool({ fragments }: Props) {
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
    return null;
  }

  return (
    <SimpleGrid cols={2} spacing={0}>
      <FragmentStack count={fragmentCounts.cultural} type="crf" />
      <FragmentStack count={fragmentCounts.hazardous} type="hrf" />
      <FragmentStack count={fragmentCounts.industrial} type="irf" />
      <FragmentStack count={fragmentCounts.unknown} type="urf" />
    </SimpleGrid>
  );
}
