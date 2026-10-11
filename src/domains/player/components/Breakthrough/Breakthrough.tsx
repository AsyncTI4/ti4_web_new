import type { CSSProperties } from "react";
import cx from "clsx";
import { useDisclosure } from "@/hooks/useDisclosure";
import { SmoothPopover } from "@/shared/ui/SmoothPopover";
import { getBreakthroughData } from "@/entities/lookup/breakthroughs";
import { TECH_TYPE_COLOR, type TechColor } from "@/entities/lookup/tech";
import { BreakthroughCard } from "@/domains/cards/components/BreakthroughCard";
import {
  ObjectLabel,
  ObjectShell,
} from "@/domains/player/components/silhouettes/ObjectShell";
import styles from "./Breakthrough.module.css";

type Props = {
  breakthroughId: string;
  exhausted?: boolean;
  tradeGoodsStored?: number;
  unlocked?: boolean;
  /** Accepted for API parity; the capsule has one weight. */
  strong?: boolean;
  className?: string;
  chipClassName?: string;
};

/** The breakthrough's two synergy tech colours, falling back to grey. */
function getSynergyColors(synergy: string[] | undefined): [string, string] {
  const colors = (synergy ?? [])
    .map((s) => TECH_TYPE_COLOR[s])
    .filter((c): c is TechColor => Boolean(c));
  const first = colors[0] ?? "gray";
  return [first, colors[1] ?? first];
}

/** The reactor core's glyph: a closed cycle, the synergy loop. */
function CycleGlyph() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M13.5 6.5A5.6 5.6 0 0 0 3.2 5M2.5 9.5A5.6 5.6 0 0 0 12.8 11"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M3 2v3.3h3.3M13 14v-3.3H9.7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Reactor capsule: the only fully rounded object in the deck. Edge and fill
 * run between its two synergy tech colours, the core glows in the first, and
 * the pair repeats as two pips on the right after any stored trade goods.
 */
export function Breakthrough({
  breakthroughId,
  exhausted = false,
  tradeGoodsStored,
  unlocked = true,
  className,
  chipClassName,
}: Props) {
  const { opened, setOpened, toggle } = useDisclosure(false);
  const data = getBreakthroughData(breakthroughId);

  if (!data) return null;

  const [s1, s2] = getSynergyColors(data.synergy);
  const title = data.displayName || data.name;
  const state = !unlocked ? "locked" : exhausted ? "exhausted" : undefined;
  const stored = tradeGoodsStored ?? 0;
  const label = [
    title,
    `${s1} / ${s2} synergy`,
    !unlocked && "locked",
    exhausted && "exhausted",
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <SmoothPopover opened={opened} onChange={setOpened}>
      <SmoothPopover.Target>
        <ObjectShell
          className={cx(styles.brk, className, chipClassName)}
          state={state}
          label={label}
          onClick={toggle}
          style={
            {
              "--s1": `var(--gd-${s1})`,
              "--s2": `var(--gd-${s2})`,
            } as CSSProperties
          }
        >
          <span className={styles.core}>
            <CycleGlyph />
          </span>
          <ObjectLabel>{title}</ObjectLabel>
          {stored > 0 && <span className={styles.tgs}>{stored} TG</span>}
          <span className={styles.syn} aria-hidden="true">
            <i style={{ "--c": `var(--gd-${s1})` } as CSSProperties} />
            <i style={{ "--c": `var(--gd-${s2})` } as CSSProperties} />
          </span>
        </ObjectShell>
      </SmoothPopover.Target>
      <SmoothPopover.Dropdown p={0}>
        <BreakthroughCard breakthroughId={breakthroughId} />
      </SmoothPopover.Dropdown>
    </SmoothPopover>
  );
}
