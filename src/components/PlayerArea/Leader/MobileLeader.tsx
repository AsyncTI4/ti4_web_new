import { Group, Text, Image, Box } from "@mantine/core";
import { IconLock } from "@tabler/icons-react";
import { useState } from "react";
import { leaders } from "../../../data/leaders";
import { SmoothPopover } from "../../shared/SmoothPopover";
import { LeaderDetailsCard } from "../LeaderDetailsCard";
import styles from "./Leader.module.css";
import { Chip } from "@/components/shared/primitives/Chip";
import { showLeader } from "./showLeader";
import cx from "clsx";

type Props = {
  id: string;
  type: "agent" | "commander" | "hero";
  tgCount: number;
  exhausted: boolean;
  locked: boolean;
  active: boolean;
};

export function MobileLeader({ id, type, exhausted, locked, active }: Props) {
  const [opened, setOpened] = useState(false);
  const leaderData = getLeaderData(id);
  if (!leaderData) return null;

  const shouldShowGreen = !exhausted && !locked;
  const accentColor = shouldShowGreen ? "green" : "gray";
  const showLeaderImage = showLeader(leaderData.source);

  return (
    <SmoothPopover opened={opened} onChange={setOpened}>
      <SmoothPopover.Target>
        <Chip
          accent={accentColor}
          onClick={() => setOpened((o) => !o)}
          className={styles.mobile}
        >
          <Group gap={8} className={styles.leaderGroup}>
            {showLeaderImage && (
              <div className={styles.leaderImageContainer}>
                <Image src={`/leaders/${id}.webp`} className={styles.leaderImage} />
              </div>
            )}

            <Text
              className={cx(
                styles.leaderType,
                shouldShowGreen ? styles.leaderTypeActive : styles.leaderTypeInactive
              )}
            >
              {type}
            </Text>

            {active && <Box className={styles.onlineDot} />}
            {locked && (
              <Box className={styles.lockIcon}>
                <IconLock size={12} color="white" stroke={2} />
              </Box>
            )}
          </Group>
        </Chip>
      </SmoothPopover.Target>
      <SmoothPopover.Dropdown p={0}>
        <LeaderDetailsCard leaderId={id} />
      </SmoothPopover.Dropdown>
    </SmoothPopover>
  );
}

function getLeaderData(leaderId: string) {
  return leaders.find((leader) => leader.id === leaderId);
}
