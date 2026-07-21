import type { CSSProperties } from "react";
import { useGameData } from "@/hooks/useGameContext";
import { useFactionColors } from "@/hooks/useFactionColors";
import { getColorAlias } from "@/entities/lookup/colors";
import { ControlToken } from "./ControlToken";

type ExpeditionPosition = {
  key: keyof import("@/entities/data/types").Expeditions;
  offsetX: number;
  offsetY: number;
};

const CENTER_X = 90;
const CENTER_Y = 90;
const RADIUS = 90;

function calculatePosition(angleDegrees: number) {
  const angleRadians = (angleDegrees * Math.PI) / 180;
  return {
    offsetX: CENTER_X + RADIUS * Math.cos(angleRadians),
    offsetY: CENTER_Y - RADIUS * Math.sin(angleRadians),
  };
}

const EXPEDITION_POSITIONS: ExpeditionPosition[] = [
  { key: "actionCards", ...calculatePosition(30) }, // 2 o'clock 30
  { key: "fiveInf", ...calculatePosition(-30) }, // 4 o'clock 210
  { key: "secret", ...calculatePosition(-90) }, // 6 o'clock 150
  { key: "techSkip", ...calculatePosition(-150) }, // 8 o'clock 90
  { key: "tradeGoods", ...calculatePosition(150) }, // 10 o'clock -90
  { key: "fiveRes", ...calculatePosition(90) }, // 12 o'clock -30
];

type Props = {
  expeditionsImageLeft: number;
  expeditionsImageTop: number;
};

export function ExpeditionTokens({
  expeditionsImageLeft,
  expeditionsImageTop,
}: Props) {
  const gameData = useGameData();
  const factionColorMap = useFactionColors();
  if (!gameData?.expeditions) return null;

  return (
    <>
      {EXPEDITION_POSITIONS.map(({ key, offsetX, offsetY }) => {
        const expedition = gameData.expeditions[key];
        if (!expedition || !expedition.completedBy) return null;

        // completedBy is always the real color (the backend never redacts it) - whether we can
        // identify who it belongs to is derived here from playerData (via factionColorMap,
        // keyed by faction), which already omits players the viewer can't identify. factionColorMap
        // is keyed by faction, not color, so search its entries for the matching color.
        const identified = Object.values(factionColorMap).find(
          (entry) => entry.color === expedition.completedBy
        );

        const x = expeditionsImageLeft + offsetX;
        const y = expeditionsImageTop + offsetY;
        const style: CSSProperties = {
          position: "absolute",
          left: `${x}px`,
          top: `${y}px`,
          transform: "translate(25%, 50%) rotate(90deg)",
          zIndex: 100,
        };

        return identified ? (
          <ControlToken
            key={key}
            colorAlias={getColorAlias(identified.color)}
            faction={identified.faction}
            style={style}
          />
        ) : (
          // Completed by a player we can't identify: show a generic grey token (same fallback
          // alias used elsewhere for unknown color) rather than hiding that it was completed.
          <ControlToken key={key} colorAlias={getColorAlias(undefined)} style={style} />
        );
      })}
    </>
  );
}
