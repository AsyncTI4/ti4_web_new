import { TILE_HEIGHT, TILE_WIDTH } from "@/domains/map/model/mapgen/tilePositioning";
import { useFactionColors } from "@/hooks/useFactionColors";
import { generateHexagonPoints } from "@/utils/hexagonUtils";

type FactionColorOverlayProps = {
  faction: string; // faction id
  opacity?: number;
};

const radius = TILE_WIDTH / 2; // 172.5px for 345px width
const centerX = TILE_WIDTH / 2;
const centerY = TILE_HEIGHT / 2;

export const FactionColorOverlay = ({
  faction,
  opacity = 0.15,
}: FactionColorOverlayProps) => {
  const factionColorMap = useFactionColors();
  const optimizedColor = factionColorMap?.[faction]?.optimizedColor;

  if (!optimizedColor) return null;

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
