import type { KeyboardEvent } from "react";
import { useDisclosure } from "@/hooks/useDisclosure";
import { SmoothPopover } from "@/shared/ui/SmoothPopover";
import { LeaderDetailsCard } from "@/domains/cards/components/LeaderDetailsCard";
import { getLeaderById } from "@/entities/lookup/leaders";
import { showLeader } from "@/entities/lookup/showLeader";
import styles from "./Leader.module.css";
import { lowPriorityImageProps } from "@/shared/ui/imageLoading";

type Props = {
  id: string;
  type: "agent" | "commander" | "hero";
  exhausted: boolean;
  locked: boolean;
  active: boolean;
};

const LEADER_RANK: Record<Props["type"], number> = {
  agent: 1,
  commander: 2,
  hero: 3,
};

/** Rank chevrons: one for an agent, two for a commander, three for a hero. */
function RankChevrons({ type }: { type: Props["type"] }) {
  const rank = LEADER_RANK[type] ?? 0;
  return (
    <span className={styles.rank} aria-hidden="true">
      {[1, 2, 3].map((step) => (
        <svg key={step} viewBox="0 0 10 5" data-on={step <= rank || undefined}>
          <path d="M1 4.2 5 1l4 3.2" />
        </svg>
      ))}
    </span>
  );
}

function getLeaderState(exhausted: boolean, locked: boolean) {
  if (locked) return "locked";
  if (exhausted) return "exhausted";
  return undefined;
}

/**
 * Leader dossier row: a squared plate with a cut corner and the portrait in an
 * inset well. Locked leaders are sockets with a + seat; exhausted ones are
 * hatched.
 */
export function LeaderChip({ id, type, exhausted, locked, active }: Props) {
  const { opened, setOpened, toggle } = useDisclosure(false);
  const leaderData = getLeaderById(id);
  if (!leaderData) return null;

  const state = getLeaderState(exhausted, locked);
  const showPortrait = !locked && showLeader(leaderData.source);
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    toggle();
  };

  return (
    <SmoothPopover opened={opened} onChange={setOpened}>
      <SmoothPopover.Target>
        <div
          role="button"
          tabIndex={0}
          className={styles.lead}
          data-s={state}
          title={leaderData.name}
          onClick={toggle}
          onKeyDown={handleKeyDown}
        >
          <span className={styles.well}>
            {showPortrait ? (
              <img
                {...lowPriorityImageProps}
                src={`/leaders/${id}.webp`}
                alt=""
              />
            ) : (
              <span aria-hidden="true">{locked ? "+" : ""}</span>
            )}
          </span>
          <span className={styles.text}>
            <strong>{leaderData.name}</strong>
            <em>
              {type}
              {exhausted && !locked && " · exhausted"}
            </em>
          </span>
          <RankChevrons type={type} />
          {active && <span className={styles.onlineDot} />}
        </div>
      </SmoothPopover.Target>
      <SmoothPopover.Dropdown p={0}>
        <LeaderDetailsCard leaderId={id} />
      </SmoothPopover.Dropdown>
    </SmoothPopover>
  );
}
