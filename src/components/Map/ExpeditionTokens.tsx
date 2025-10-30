import { useGameData } from "@/hooks/useGameContext";
import { useFactionColors } from "@/hooks/useFactionColors";
import { getColorAlias } from "@/lookup/colors";
import { ControlToken } from "./ControlToken";

type ExpeditionPosition = {
  key: keyof import("@/data/types").Expeditions;
  angle: number;
};

const EXPEDITION_POSITIONS: ExpeditionPosition[] = [
  { key: "fiveRes", angle: 0 }, // 12 o'clock
  { key: "actionCards", angle: 60 }, // 2 o'clock
  { key: "fiveInf", angle: 120 }, // 4 o'clock
  { key: "secret", angle: 180 }, // 6 o'clock
  { key: "techSkip", angle: 240 }, // 8 o'clock
  { key: "tradeGoods", angle: 300 }, // 10 o'clock
];

const RADIUS = 100;
const CENTER_X = 180 * 0.5;
const CENTER_Y = 180 * 0.5;

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
      {EXPEDITION_POSITIONS.map(({ key, angle }) => {
        const expedition = gameData.expeditions[key];
        if (!expedition.completedBy) return null;

        const faction = gameData.playerData.find(
          (p) => p.color === expedition.completedBy
        )?.faction;
        if (!faction) return null;

        const colorAlias = getColorAlias(factionColorMap?.[faction]?.color);

        const angleRadians = (angle * Math.PI) / 180;
        const x =
          expeditionsImageLeft + CENTER_X + RADIUS * Math.sin(angleRadians);
        const y =
          expeditionsImageTop + CENTER_Y - RADIUS * Math.cos(angleRadians);

        return (
          <ControlToken
            key={key}
            colorAlias={colorAlias}
            faction={faction}
            style={{
              position: "absolute",
              left: `${x}px`,
              top: `${y}px`,
              transform: "translate(25%, 75%) rotate(90deg)",
              zIndex: "var(--z-control-token)",
            }}
          />
        );
      })}
    </>
  );
}
