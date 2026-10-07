import { useRef } from "react";
import {
  HEX_PATH,
  TILE_HEIGHT,
  TILE_WIDTH,
} from "@/domains/map/model/mapgen/tilePositioning";
import classes from "./SystemHexTarget.module.css";

type Props = {
  onOpen: () => void;
};

/**
 * The hex's own hit target: the click that opens the system dossier. The
 * path, not the bounding box, receives events, so the tile's corners stay
 * dead space; it sits just above the tile art and below every layer with its
 * own pointer semantics (planet circles, units, tokens), so nothing the map
 * already does changes. The hover wash lives in MapTile.module.css on the
 * container's :hover — no React state, no re-render under a moving cursor.
 */
export function SystemHexTarget({ onOpen }: Props) {
  const pointerDown = useRef<{ x: number; y: number } | null>(null);

  return (
    <svg
      className={`system-hex-target ${classes.target}`}
      viewBox={`0 0 ${TILE_WIDTH} ${TILE_HEIGHT}`}
      width={TILE_WIDTH}
      height={TILE_HEIGHT}
      aria-hidden="true"
    >
      <path
        d={HEX_PATH}
        className={classes.hex}
        onPointerDown={(event) => {
          pointerDown.current = { x: event.clientX, y: event.clientY };
        }}
        onClick={(event) => {
          /* The pannable view drags to scroll; a pan that ends over a hex
             still fires click, so anything that traveled isn't a click. */
          const down = pointerDown.current;
          pointerDown.current = null;
          if (down) {
            const travel = Math.hypot(
              event.clientX - down.x,
              event.clientY - down.y
            );
            if (travel > 6) return;
          }
          onOpen();
        }}
      />
    </svg>
  );
}
