import type { OneWayDirection } from "@/entities/lookup/tokens";

/*
 * Mirrors the bot's OneWayWormholeIcon: on an 80px canvas the 64px base token
 * sits in the middle, ringed by three arrows (green counter-clockwise for an
 * entry, red clockwise for an exit) with an IN/OUT badge bottom-right.
 */
const SIZE = 80;
const TOKEN_SIZE = 64;
const CENTER = SIZE / 2;
const RING_RADIUS = 35;
const ARC_EXTENT = 88;
const OUTLINE = "rgba(10, 10, 10, 0.9)";
const COLORS: Record<OneWayDirection, { fill: string; badge: string }> = {
  in: { fill: "rgb(60, 200, 90)", badge: "rgb(42, 140, 63)" },
  out: { fill: "rgb(225, 60, 55)", badge: "rgb(157, 42, 38)" },
};

/** How far the ring reaches past each edge of the base token, as a fraction of it. */
export const ONE_WAY_RING_OVERHANG = (SIZE - TOKEN_SIZE) / 2 / TOKEN_SIZE;

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

const ringPoint = (degrees: number, radius = RING_RADIUS) => ({
  x: CENTER + Math.cos(toRadians(degrees)) * radius,
  y: CENTER - Math.sin(toRadians(degrees)) * radius,
});

function arrow(index: number, counterClockwise: boolean) {
  const start = 90 + index * 120 + (120 - ARC_EXTENT) / 2;
  const from = counterClockwise ? start : start + ARC_EXTENT;
  const to = counterClockwise ? from + ARC_EXTENT : from - ARC_EXTENT;
  const a = ringPoint(from);
  const b = ringPoint(to);
  // Counter-clockwise on screen (y down) is SVG sweep-flag 0.
  const sweep = counterClockwise ? 0 : 1;
  const arc = `M ${a.x} ${a.y} A ${RING_RADIUS} ${RING_RADIUS} 0 0 ${sweep} ${b.x} ${b.y}`;

  const angle = toRadians(to);
  const sign = counterClockwise ? 1 : -1;
  const tangentX = -Math.sin(angle) * sign;
  const tangentY = -Math.cos(angle) * sign;
  const normalX = Math.cos(angle);
  const normalY = -Math.sin(angle);
  const length = 9;
  const halfWidth = 6;
  const head = [
    [b.x + tangentX * length, b.y + tangentY * length],
    [b.x + normalX * halfWidth, b.y + normalY * halfWidth],
    [b.x - normalX * halfWidth, b.y - normalY * halfWidth],
  ]
    .map(([x, y]) => `${x},${y}`)
    .join(" ");

  return { arc, head };
}

type Props = { direction: OneWayDirection };

export function OneWayWormholeRing({ direction }: Props) {
  const counterClockwise = direction === "in";
  const { fill, badge } = COLORS[direction];
  const label = direction === "in" ? "IN" : "OUT";
  const badgeWidth = direction === "in" ? 20 : 31;
  const badgeHeight = 14;
  const badgeX = SIZE - badgeWidth - 1;
  const badgeY = SIZE - badgeHeight - 1;
  const arrows = [0, 1, 2].map((i) => arrow(i, counterClockwise));

  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: `${-ONE_WAY_RING_OVERHANG * 100}%`,
        width: `${(SIZE / TOKEN_SIZE) * 100}%`,
        height: `${(SIZE / TOKEN_SIZE) * 100}%`,
        pointerEvents: "none",
        overflow: "visible",
      }}
    >
      {arrows.map(({ arc }, i) => (
        <path
          key={`o${i}`}
          d={arc}
          fill="none"
          stroke={OUTLINE}
          strokeWidth={7}
        />
      ))}
      {arrows.map(({ head }, i) => (
        <polygon
          key={`h${i}`}
          points={head}
          fill={fill}
          stroke={OUTLINE}
          strokeWidth={2}
          strokeLinejoin="round"
        />
      ))}
      {arrows.map(({ arc }, i) => (
        <path key={`a${i}`} d={arc} fill="none" stroke={fill} strokeWidth={4} />
      ))}
      <rect
        x={badgeX}
        y={badgeY}
        width={badgeWidth}
        height={badgeHeight}
        rx={3}
        fill={badge}
        stroke={OUTLINE}
        strokeWidth={1.5}
      />
      <text
        x={badgeX + badgeWidth / 2}
        y={badgeY + badgeHeight / 2}
        textAnchor="middle"
        dominantBaseline="central"
        fill="#fff"
        fontFamily="sans-serif"
        fontWeight="bold"
        fontSize={12}
      >
        {label}
      </text>
    </svg>
  );
}
