import { Group, Image } from "@mantine/core";
import { cdnImage } from "../../../data/cdnImage";
type FragmentType = "crf" | "hrf" | "urf";

type Props = {
  count: number;
  type: FragmentType;
};

export function FragmentStack({ count, type }: Props) {
  const getFragmentSrc = () => {
    switch (type) {
      case "crf":
        return cdnImage("/player_area/pa_fragment_crf.png");
      case "hrf":
        return cdnImage("/player_area/pa_fragment_hrf.png");
      case "urf":
        return cdnImage("/player_area/pa_fragment_urf.png");
      default:
        return cdnImage("/player_area/pa_fragment_crf.png");
    }
  };

  const getFragmentSize = () => {
    // HRF fragments are slightly smaller
    return type === "hrf" ? "20px" : "25px";
  };

  const fragmentSrc = getFragmentSrc();
  const fragmentSize = getFragmentSize();

  // Don't render anything if count is 0
  if (count === 0) {
    return null;
  }

  // Render up to 3 fragments max for visual clarity
  const fragmentsToShow = Math.min(count, 3);

  return (
    <Group gap={0}>
      {Array.from({ length: fragmentsToShow }, (_, index) => (
        <Image
          key={index}
          src={fragmentSrc}
          style={{
            width: fragmentSize,
            marginLeft: index === 0 ? 0 : -8,
          }}
        />
      ))}
    </Group>
  );
}
