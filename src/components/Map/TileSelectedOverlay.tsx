import { HEX_VERTICES } from "../../utils/unitPositioning";

type TileSelectedOverlayProps = {
  isSelected: boolean;
  isHovered?: boolean;
  isDistanceMode?: boolean;
};

const TILE_WIDTH = 345;
const TILE_HEIGHT = 299;

export const TileSelectedOverlay = ({
  isSelected,
  isHovered = false,
  isDistanceMode = false,
}: TileSelectedOverlayProps) => {
  // Show overlay if tile is selected, OR if it's hovered during distance mode
  const shouldShowOverlay = isSelected || (isHovered && isDistanceMode);

  if (!shouldShowOverlay) return null;

  // Convert HEX_VERTICES to SVG path format
  const hexPath = `
    M ${HEX_VERTICES[0].x} ${HEX_VERTICES[0].y}
    L ${HEX_VERTICES[1].x} ${HEX_VERTICES[1].y}
    L ${HEX_VERTICES[2].x} ${HEX_VERTICES[2].y}
    L ${HEX_VERTICES[3].x} ${HEX_VERTICES[3].y}
    L ${HEX_VERTICES[4].x} ${HEX_VERTICES[4].y}
    L ${HEX_VERTICES[5].x} ${HEX_VERTICES[5].y}
    Z
  `;

  // Use different colors/opacity for selected vs hovered
  const fillColor = "var(--mantine-color-blue-6)";
  const opacity = isSelected ? 0.3 : 0.5;

  return (
    <svg
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: TILE_WIDTH,
        height: TILE_HEIGHT,
        pointerEvents: "none",
        zIndex: 2,
      }}
    >
      <path d={hexPath} fill={fillColor} opacity={opacity} />
    </svg>
  );
};
