import { useDisclosure } from "@/hooks/useDisclosure";
import { Box } from "@mantine/core";
import { Chip } from "@/shared/ui/primitives/Chip";
import { SmoothPopover } from "@/shared/ui/SmoothPopover";
import { getBreakthroughData } from "@/entities/lookup/breakthroughs";
import {
  getTechSynergyPair,
  TECH_TYPE_COLOR,
  type TechColor,
} from "@/entities/lookup/tech";
import { BreakthroughCard } from "@/domains/cards/components/BreakthroughCard";
import { IconLock, IconX } from "@tabler/icons-react";
import { cdnImage } from "@/entities/data/cdnImage";
import cx from "clsx";
import styles from "./Breakthrough.module.css";

type Props = {
  breakthroughId: string;
  exhausted?: boolean;
  tradeGoodsStored?: number;
  unlocked?: boolean;
  strong?: boolean;
  className?: string;
  chipClassName?: string;
};

function getAccentFromSynergy(synergy: string[] | undefined) {
  const colors = (synergy ?? [])
    .map((s) => TECH_TYPE_COLOR[s])
    .filter((c): c is TechColor => Boolean(c));

  if (colors.length < 2) return colors[0] ?? ("gray" as const);
  return getTechSynergyPair(colors.slice(0, 2)) ?? ("gray" as const);
}

export function Breakthrough({
  breakthroughId,
  exhausted = false,
  tradeGoodsStored,
  unlocked = true,
  strong = true,
  className,
  chipClassName,
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
          className={cx(
            styles.container,
            exhausted && styles.exhausted,
            !unlocked && styles.locked,
            className
          )}
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
            className={cx(exhausted && styles.exhaustedChip, chipClassName)}
            leftIconSrc={cdnImage("/general/synergy.png")}
            leftIconSize="22px"
            leftIconClassName={cx(
              styles.synergyIcon,
              exhausted && styles.exhaustedIcon
            )}
          >
            {(tradeGoodsStored ?? 0) > 0 && (
              <Box className={styles.tradeGoodsText}>
                +{tradeGoodsStored} TG
              </Box>
            )}
          </Chip>
          {!unlocked && (
            <Box className={styles.lockIcon}>
              <IconLock size={12} color="white" stroke={2} />
            </Box>
          )}
          {exhausted && (
            <Box className={styles.exhaustedBadge}>
              <IconX
                size={16}
                color="var(--mantine-color-red-1)"
                stroke={2.75}
              />
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
