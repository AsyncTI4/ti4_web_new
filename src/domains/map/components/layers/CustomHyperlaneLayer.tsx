import { useId, useMemo } from "react";
import {
  ARROW_OUTLINE,
  buildHyperlaneDrawing,
  HL_TILE_HEIGHT,
  HL_TILE_WIDTH,
  type HyperlaneStroke,
  type HyperlaneStyle,
} from "@/entities/game/customHyperlanes";
import classes from "./CustomHyperlaneLayer.module.css";

type Props = {
  matrix: string | undefined;
  style: HyperlaneStyle;
};

const HEX_OUTLINE = `M${HL_TILE_WIDTH / 4} 0L${(HL_TILE_WIDTH * 3) / 4} 0L${HL_TILE_WIDTH} ${HL_TILE_HEIGHT / 2}L${(HL_TILE_WIDTH * 3) / 4} ${HL_TILE_HEIGHT}L${HL_TILE_WIDTH / 4} ${HL_TILE_HEIGHT}L0 ${HL_TILE_HEIGHT / 2}Z`;
const ARROW_HEAD = "M14 0L-10 -12L-4 0L-10 12Z";

const renderStroke = (stroke: HyperlaneStroke, key: number) => (
  <path
    key={key}
    d={stroke.d}
    stroke={stroke.color}
    strokeOpacity={stroke.opacity}
    strokeWidth={stroke.width}
    strokeDasharray={stroke.dash}
    strokeLinejoin="round"
    fill="none"
  />
);

/** Lanes of a custom ("hl") hyperlane tile, drawn over its empty background. */
export function CustomHyperlaneLayer({ matrix, style }: Props) {
  const id = useId().replace(/:/g, "");
  const drawing = useMemo(
    () => buildHyperlaneDrawing(matrix, style),
    [matrix, style],
  );
  const gapMaskId = `hl-gap-${id}`;
  const clipId = `hl-clip-${id}`;
  const nodeGradientId = `hl-node-${id}`;

  return (
    <svg
      className={classes.lanes}
      viewBox={`0 0 ${HL_TILE_WIDTH} ${HL_TILE_HEIGHT}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <mask
          id={gapMaskId}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width={HL_TILE_WIDTH}
          height={HL_TILE_HEIGHT}
        >
          <rect width={HL_TILE_WIDTH} height={HL_TILE_HEIGHT} fill="white" />
          {drawing.gaps.map((d, i) => (
            <path
              key={i}
              d={d}
              stroke="black"
              strokeWidth={10}
              strokeLinejoin="round"
              fill="none"
            />
          ))}
        </mask>
        {drawing.clipToHex && (
          <clipPath id={clipId}>
            <path d={HEX_OUTLINE} />
          </clipPath>
        )}
        {drawing.nodes.length > 0 && (
          <radialGradient id={nodeGradientId}>
            <stop offset="0" stopColor="rgb(255,255,255)" stopOpacity={235 / 255} />
            <stop offset="0.35" stopColor="rgb(150,220,255)" stopOpacity={170 / 255} />
            <stop offset="1" stopColor="rgb(0,160,255)" stopOpacity={0} />
          </radialGradient>
        )}
      </defs>
      <g clipPath={drawing.clipToHex ? `url(#${clipId})` : undefined}>
        <g mask={`url(#${gapMaskId})`}>{drawing.glows.map(renderStroke)}</g>
        {drawing.cores.map(renderStroke)}
        {drawing.nodes.map((node, i) => (
          <circle
            key={i}
            cx={node.x}
            cy={node.y}
            r={20}
            fill={`url(#${nodeGradientId})`}
          />
        ))}
        {drawing.arrows.map((arrow, i) => (
          <path
            key={i}
            d={ARROW_HEAD}
            transform={`translate(${arrow.x} ${arrow.y}) rotate(${arrow.angle}) scale(0.7)`}
            fill={arrow.color}
            stroke={ARROW_OUTLINE}
            strokeWidth={3.4}
            strokeLinejoin="round"
            strokeLinecap="round"
            paintOrder="stroke"
          />
        ))}
      </g>
    </svg>
  );
}
