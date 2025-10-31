import { useGameData } from "@/hooks/useGameContext";
import { useFactionColors } from "@/hooks/useFactionColors";
import { getColorAlias } from "@/lookup/colors";
import { ControlToken } from "./ControlToken";

type ExpeditionPosition = {
  key: keyof import("@/data/types").Expeditions;
  offsetX: number;
  offsetY: number;
};

const EXPEDITION_POSITIONS: ExpeditionPosition[] = [
  { key: "tradeGoods", offsetX: 47, offsetY: 101 },
  { key: "fiveRes", offsetX: 114, offsetY: 5 },
  { key: "actionCards", offsetX: 182, offsetY: 101 },
  { key: "techSkip", offsetX: 47, offsetY: 150 },
  { key: "secret", offsetX: 114, offsetY: 243 },
  { key: "fiveInf", offsetX: 182, offsetY: 150 },
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
              transform: "translate(0%, -100%) rotate(90deg)",
              zIndex: 100,
            }}
          />
        );
      })}
    </>
  );
}
