import { useGameData } from "@/state/useGameContext";
import { useFactionColors } from "@/hooks/useFactionColors";
import { getColorAlias } from "@/entities/lookup/colors";
import type { Expeditions } from "@/entities/data/types";
import { ControlToken } from "@/shared/ui/ControlToken";

type ExpeditionPosition = {
  key: keyof Expeditions;
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
  { key: "actionCards", ...calculatePosition(30) }, // 2 o'clock
  { key: "fiveInf", ...calculatePosition(-30) }, // 4 o'clock
  { key: "secret", ...calculatePosition(-90) }, // 6 o'clock
  { key: "techSkip", ...calculatePosition(-150) }, // 8 o'clock
  { key: "tradeGoods", ...calculatePosition(150) }, // 10 o'clock
  { key: "fiveRes", ...calculatePosition(90) }, // 12 o'clock
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
        if (!expedition?.completedBy) return null;

        const faction = factionColorMap[expedition.completedBy];
        if (!faction) return null;
        const colorAlias = getColorAlias(faction.color);

        return (
          <ControlToken
            key={key}
            colorAlias={colorAlias}
            faction={faction.faction}
            style={{
              position: "absolute",
              left: `${expeditionsImageLeft + offsetX}px`,
              top: `${expeditionsImageTop + offsetY}px`,
              transform: "translate(25%, 50%) rotate(90deg)",
              zIndex: 100,
            }}
          />
        );
      })}
    </>
  );
}
