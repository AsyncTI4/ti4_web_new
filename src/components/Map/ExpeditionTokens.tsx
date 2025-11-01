import { useGameData } from "@/hooks/useGameContext";
import { useFactionColors } from "@/hooks/useFactionColors";
import { getColorAlias } from "@/lookup/colors";
import { ControlToken } from "./ControlToken";

type ExpeditionPosition = {
  key: keyof import("@/data/types").Expeditions;
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
  { key: "tradeGoods", ...calculatePosition(-90) }, // 12 o'clock
  { key: "fiveRes", ...calculatePosition(-30) }, // 2 o'clock
  { key: "actionCards", ...calculatePosition(30) }, // 4 o'clock
  { key: "techSkip", ...calculatePosition(90) }, // 6 o'clock
  { key: "secret", ...calculatePosition(150) }, // 8 o'clock
  { key: "fiveInf", ...calculatePosition(210) }, // 10 o'clock
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
        console.log(key, expedition);
        if (!expedition || !expedition.completedBy) return null;

        const faction = factionColorMap[expedition.completedBy];
        if (!faction) return null;
        const colorAlias = getColorAlias(faction.color);

        const x = expeditionsImageLeft + offsetX;
        const y = expeditionsImageTop + offsetY;

        return (
          <ControlToken
            key={key}
            colorAlias={colorAlias}
            faction={faction.faction}
            style={{
              position: "absolute",
              left: `${x}px`,
              top: `${y}px`,
              transform: "translate(25%, 50%) rotate(90deg)",
              zIndex: 100,
            }}
          />
        );
      })}
    </>
  );
}
