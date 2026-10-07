import { TILE_HEIGHT, TILE_WIDTH } from "@/domains/map/model/mapgen/tilePositioning";
import { useFactionColors } from "@/hooks/useFactionColors";
import { generateHexagonPoints } from "@/utils/hexagonUtils";
import { toRgba } from "@/entities/lookup/colors";

type FactionColorOverlayProps = {
  faction: string;
  opacity?: number;
};

const HEX_POINTS = generateHexagonPoints(TILE_WIDTH / 2, TILE_HEIGHT / 2, TILE_WIDTH / 2)
  .map((p) => `${p.x},${p.y}`)
  .join(" ");

export const FactionColorOverlay = ({
  faction,
  opacity = 0.15,
}: FactionColorOverlayProps) => {
  const factionColorMap = useFactionColors();
  const optimizedColor = factionColorMap?.[faction]?.optimizedColor;

  if (!optimizedColor) return null;


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
      <polygon points={HEX_POINTS} fill={toRgba(optimizedColor, opacity)} />
    </svg>
  );
};
