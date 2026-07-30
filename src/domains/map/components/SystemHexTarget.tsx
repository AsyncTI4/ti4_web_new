import { useRef } from "react";
import { HEX_VERTICES } from "@/utils/unitPositioning";
import classes from "./SystemHexTarget.module.css";

const HEX_PATH = `${HEX_VERTICES.map(
  ({ x, y }, index) => `${index === 0 ? "M" : "L"} ${x} ${y}`
).join(" ")} Z`;

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
      viewBox="0 0 345 299"
      width={345}
      height={299}
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
