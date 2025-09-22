import { Image } from "@mantine/core";
import { SmoothPopover } from "@/components/shared/SmoothPopover";
import { LeaderDetailsCard } from "../LeaderDetailsCard";
import styles from "./CompactLeader.module.css";
import { useState } from "react";

type Props = {
  id: string;
  exhausted: boolean;
  locked: boolean;
  active: boolean;
};

export function CompactLeader({ id, exhausted, locked }: Props) {
  const [opened, setOpened] = useState(false);
  const shouldShowGreen = !exhausted && !locked;

  return (
    <SmoothPopover opened={opened} onChange={setOpened}>
      <SmoothPopover.Target>
        <div
          className={`${styles.compact} ${shouldShowGreen ? styles.active : styles.inactive}`}
          onClick={() => setOpened((o) => !o)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setOpened((o) => !o);
            }
          }}
        >
          <div className={styles.imageFrame}>
            <Image src={`/leaders/${id}.webp`} className={styles.image} />
          </div>
        </div>
      </SmoothPopover.Target>
      <SmoothPopover.Dropdown p={0}>
        <LeaderDetailsCard leaderId={id} />
      </SmoothPopover.Dropdown>
    </SmoothPopover>
  );
}
