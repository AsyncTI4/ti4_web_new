import { useState } from "react";
import { Box } from "@mantine/core";
import { Chip } from "@/components/shared/primitives/Chip";
import { SmoothPopover } from "@/components/shared/SmoothPopover";
import { getBreakthroughData } from "@/lookup/breakthroughs";
import type { ColorKey } from "@/components/PlayerArea/gradientClasses";
import { BreakthroughCard } from "./BreakthroughCard.tsx";

type Props = {
  breakthroughId: string;
  exhausted?: boolean;
  tradeGoodsStored?: number;
};

const synergyToColor: Record<string, ColorKey> = {
  BIOTIC: "green",
  PROPULSION: "blue",
  CYBERNETIC: "yellow",
  WARFARE: "red",
};

function getAccentFromSynergy(synergy: string[] | undefined) {
  if (!synergy || synergy.length === 0) return "gray" as const;
  const colors = synergy
    .map((s) => synergyToColor[s])
    .filter((c): c is ColorKey => Boolean(c));

  if (colors.length < 2) return colors[0] ?? ("gray" as const);

  const [a, b] = colors;
  if ((a === "blue" && b === "red") || (a === "red" && b === "blue"))
    return "blueRed" as const;
  if ((a === "blue" && b === "green") || (a === "green" && b === "blue"))
    return "blueGreen" as const;
  if ((a === "blue" && b === "yellow") || (a === "yellow" && b === "blue"))
    return "blueYellow" as const;
  if ((a === "green" && b === "red") || (a === "red" && b === "green"))
    return "greenRed" as const;
  if ((a === "green" && b === "yellow") || (a === "yellow" && b === "green"))
    return "greenYellow" as const;
  if ((a === "yellow" && b === "red") || (a === "red" && b === "yellow"))
    return "yellowRed" as const;

  return "gray" as const;
}

export function Breakthrough({
  breakthroughId,
  exhausted = false,
  tradeGoodsStored,
}: Props) {
  const [opened, setOpened] = useState(false);
  const data = getBreakthroughData(breakthroughId);

  if (!data) return null;

  const accent = getAccentFromSynergy(data.synergy);
  const title = data.displayName || data.name;

  return (
    <SmoothPopover opened={opened} onChange={setOpened}>
      <SmoothPopover.Target>
        <Box>
          <Chip
            accent={accent}
            breakthrough
            onClick={() => setOpened((o) => !o)}
            title={title}
            px={8}
            py={4}
            strong
            accentLine={exhausted}
          >
            {tradeGoodsStored && tradeGoodsStored > 0 ? (
              <Box style={{ marginLeft: 6 }}>+{tradeGoodsStored} TG</Box>
            ) : null}
          </Chip>
        </Box>
      </SmoothPopover.Target>
      <SmoothPopover.Dropdown p={0}>
        <BreakthroughCard breakthroughId={breakthroughId} />
      </SmoothPopover.Dropdown>
    </SmoothPopover>
  );
}
