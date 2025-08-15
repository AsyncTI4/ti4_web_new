import { TILE_HEIGHT, TILE_WIDTH } from "@/mapgen/tilePositioning";
import { useContext, useMemo } from "react";
import { EnhancedDataContext } from "@/context/GameContextProvider";

type FactionColorOverlayProps = {
  faction: string; // faction id
  opacity?: number;
};

export const FactionColorOverlay = ({
  faction,
  opacity = 0.15,
}: FactionColorOverlayProps) => {
  const enhancedData = useContext(EnhancedDataContext);
  const optimizedColor = useMemo(() => {
    const colorAlias = enhancedData?.data?.factionColorMap?.[faction]?.color;
    const rgb = enhancedData?.data?.factionColorMap?.[faction]?.optimizedColor;
    return rgb || undefined;
  }, [enhancedData, faction]);

  if (!optimizedColor) {
    return null;
  }

  // Calculate hex dimensions to fit tile
  const radius = TILE_WIDTH / 2; // 172.5px for 345px width
  const centerX = TILE_WIDTH / 2;
  const centerY = TILE_HEIGHT / 2;

  // Generate hexagon points for flat-top hexagon
  const generateHexagonPoints = (cx: number, cy: number, r: number) => {
    const points = [];
    for (let i = 0; i < 6; i++) {
      const angle = i * 60 * (Math.PI / 180); // Start at 0° for flat-top orientation
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      points.push({ x, y });
    }
    return points;
  };

  const hexPoints = generateHexagonPoints(centerX, centerY, radius);
  const pointsString = hexPoints.map((p) => `${p.x},${p.y}`).join(" ");

  const primaryColor = `rgba(${optimizedColor.red}, ${optimizedColor.green}, ${optimizedColor.blue}, ${opacity})`;

  return (
    <svg
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: TILE_WIDTH,
        height: TILE_HEIGHT,
        zIndex: 1,
        pointerEvents: "none",
      }}
      viewBox={`0 0 ${TILE_WIDTH} ${TILE_HEIGHT}`}
    >
      <polygon points={pointsString} fill={primaryColor} />
    </svg>
  );
};
