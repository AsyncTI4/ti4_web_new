import { Box, Text } from "@mantine/core";
import { PathResult } from "../utils/tileDistances";

type DistanceDisplayProps = {
  selectedTiles: string[];
  pathResult: PathResult | null;
  systemIdToPosition: Record<string, string>;
};

export const DistanceDisplay = ({
  selectedTiles,
  pathResult,
  systemIdToPosition,
}: DistanceDisplayProps) => {
  if (selectedTiles.length !== 2 || !pathResult) {
    return null;
  }

  // Get positions for calculation of display location
  const tileAPosition = systemIdToPosition[selectedTiles[0]];
  const tileBPosition = systemIdToPosition[selectedTiles[1]];

  if (!tileAPosition || !tileBPosition) {
    return null;
  }

  return (
    <Box
      style={{
        position: "fixed",
        top: "100px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1001,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        color: "white",
        padding: "12px 24px",
        borderRadius: "8px",
        border: "2px solid var(--mantine-color-orange-6)",
        fontFamily: "'Slider', system-ui, -apple-system, sans-serif",
        pointerEvents: "none",
      }}
    >
      <Text
        size="xl"
        fw={700}
        ta="center"
        style={{
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
        }}
      >
        Distance: {pathResult.distance}
      </Text>
      <Text
        size="sm"
        ta="center"
        style={{
          opacity: 0.8,
          marginTop: "4px",
        }}
      >
        {selectedTiles[0]} ↔ {selectedTiles[1]}
      </Text>
      {pathResult.paths.length > 1 && (
        <Text
          size="xs"
          ta="center"
          style={{
            opacity: 0.7,
            marginTop: "2px",
          }}
        >
          ({pathResult.paths.length} optimal paths found)
        </Text>
      )}
    </Box>
  );
};
