import { Group, Image } from "@mantine/core";
import { cdnImage } from "../../../data/cdnImage";
type FragmentType = "crf" | "hrf" | "irf" | "urf";

type Props = {
  count: number;
  type: FragmentType;
};

export function FragmentStack({ count, type }: Props) {
  const fragmentSrc = getFragmentSrc(type);

  // Don't render anything if count is 0
  if (count === 0) return null;

  return (
    <Group gap={0}>
      {Array.from({ length: count }, (_, index) => (
        <Image
          key={index}
          src={fragmentSrc}
          style={{
            width: 28,
            marginLeft: index === 0 ? 0 : -8,
          }}
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

const getFragmentSrc = (type: FragmentType) => {
  return FRAGMENT_SOURCES[type] || FRAGMENT_SOURCES.crf;
};
