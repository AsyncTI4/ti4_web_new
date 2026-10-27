import type { KeyboardEvent } from "react";
import { IconLock } from "@tabler/icons-react";
import { useDisclosure } from "@/hooks/useDisclosure";
import { SmoothPopover } from "@/shared/ui/SmoothPopover";
import { LeaderDetailsCard } from "@/domains/cards/components/LeaderDetailsCard";
import { getLeaderById } from "@/entities/lookup/leaders";
import { getLeaderPortraitUrl } from "@/entities/lookup/leaderPortraits";
import styles from "./Leader.module.css";
import { RankChevrons } from "./RankChevrons";
import { lowPriorityImageProps } from "@/shared/ui/imageLoading";
import { LeaderPortraitImage } from "@/shared/ui/LeaderPortraitImage";
import { searchKey, searchTarget } from "@/domains/search/searchKeys";

type Props = {
  id: string;
  type: "agent" | "commander" | "hero";
  exhausted: boolean;
  locked: boolean;
  active: boolean;
};

function getLeaderState(exhausted: boolean, locked: boolean) {
  if (locked) return "locked";
  if (exhausted) return "exhausted";
  return undefined;
}

/**
 * Leader dossier row: a squared plate with a cut corner and the portrait in an
 * inset well, and rank chevrons (agent 1, commander 2, hero 3) in the top-right
 * corner. Locked leaders have a small padlock after their role; exhausted
 * ones are hatched.
 */
export function LeaderChip({ id, type, exhausted, locked, active }: Props) {
  const { opened, setOpened, toggle } = useDisclosure(false);
  const leaderData = getLeaderById(id);
  if (!leaderData) return null;

  const state = getLeaderState(exhausted, locked);
  const showPortrait = Boolean(getLeaderPortraitUrl(id));
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
          {...searchTarget(searchKey("leader", id))}
          onClick={toggle}
          onKeyDown={handleKeyDown}
        >
          <span className={styles.well}>
            {showPortrait ? (
              <LeaderPortraitImage
                {...lowPriorityImageProps}
                leaderId={id}
              />
            ) : (
              <span aria-hidden="true" />
            )}
          </span>
          <span className={styles.text}>
            <strong>{leaderData.name}</strong>
            <em>
              {type}
              {locked ? (
                <IconLock
                  className={styles.lock}
                  size={11}
                  stroke={2}
                  aria-label="locked"
                />
              ) : (
                exhausted && " · exhausted"
              )}
            </em>
          </span>
          <span className={styles.corner}>
            {active && <span className={styles.onlineDot} />}
            <RankChevrons type={type} />
          </span>
        </div>
      </SmoothPopover.Target>
      <SmoothPopover.Dropdown p={0}>
        <LeaderDetailsCard leaderId={id} />
      </SmoothPopover.Dropdown>
    </SmoothPopover>
  );
}
