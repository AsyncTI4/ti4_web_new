import { useDisclosure } from "@/hooks/useDisclosure";
import { Box } from "@mantine/core";
import { Chip } from "@/shared/ui/primitives/Chip";
import { SmoothPopover } from "@/shared/ui/SmoothPopover";
import { getBreakthroughData } from "@/entities/lookup/breakthroughs";
import type { ColorKey } from "@/domains/player/components/gradientClasses";
import { BreakthroughCard } from "./BreakthroughCard.tsx";
import { IconLock } from "@tabler/icons-react";
import { cdnImage } from "@/entities/data/cdnImage.ts";
import styles from "./Breakthrough.module.css";

type Props = {
  breakthroughId: string;
  exhausted?: boolean;
  tradeGoodsStored?: number;
  unlocked?: boolean;
  strong?: boolean;
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
  unlocked = true,
  strong = true,
}: Props) {
  const { opened, setOpened, toggle } = useDisclosure(false);
  const data = getBreakthroughData(breakthroughId);

  if (!data) return null;

  const accent = getAccentFromSynergy(data.synergy);
  const title = data.displayName || data.name;

  return (
    <SmoothPopover opened={opened} onChange={setOpened}>
      <SmoothPopover.Target>
        <Box
          className={`${styles.container} ${!unlocked ? styles.locked : ""}`}
        >
          <Chip
            accent={accent}
            breakthrough
            onClick={toggle}
            title={title}
            px={8}
            py={4}
            strong={strong}
            accentLine={exhausted}
            leftSection={
              <img
                src={cdnImage("/general/synergy.png")}
                className={styles.synergyIcon}
              />
            }
          >
            {tradeGoodsStored && tradeGoodsStored > 0 ? (
              <Box className={styles.tradeGoodsText}>
                +{tradeGoodsStored} TG
              </Box>
            ) : null}
          </Chip>
          {!unlocked && (
            <Box className={styles.lockIcon}>
              <IconLock size={12} color="white" stroke={2} />
            </Box>
          )}
        </Box>
      </SmoothPopover.Target>
      <SmoothPopover.Dropdown p={0}>
        <BreakthroughCard breakthroughId={breakthroughId} />
      </SmoothPopover.Dropdown>
    </SmoothPopover>
  );
}
