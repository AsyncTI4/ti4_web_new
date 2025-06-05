import { Group, Stack, Text, Image, Box } from "@mantine/core";
import { IconLock } from "@tabler/icons-react";
import { useState } from "react";
import { Shimmer } from "../Shimmer";
import { leaders } from "../../../data/leaders";
import { SmoothPopover } from "../../shared/SmoothPopover";
import { LeaderDetailsCard } from "../LeaderDetailsCard";
import styles from "./Leader.module.css";

type Props = {
  id: string;
  type: "agent" | "commander" | "hero";
  tgCount: number;
  exhausted: boolean;
  locked: boolean;
  active: boolean;
};

export function Leader({ id, type, exhausted, locked }: Props) {
  const [opened, setOpened] = useState(false);
  const leaderData = getLeaderData(id);
  if (!leaderData) return null;

  const shouldShowGreen = !exhausted && !locked;

  const LeaderContent = () => (
    <Group className={styles.leaderGroup}>
      <Image src={`/leaders/${id}.webp`} className={styles.leaderImage} />
      <Stack className={styles.leaderStack}>
        <Text
          className={`${styles.leaderName} ${shouldShowGreen ? styles.leaderNameActive : styles.leaderNameInactive}`}
        >
          {leaderData.name}
        </Text>
        <Text
          className={`${styles.leaderType} ${shouldShowGreen ? styles.leaderTypeActive : styles.leaderTypeInactive}`}
        >
          {type}
        </Text>
      </Stack>
      {locked && (
        <Box className={styles.lockIcon}>
          <IconLock size={16} color="white" stroke={2.5} />
        </Box>
      )}
    </Group>
  );

  return (
    <SmoothPopover opened={opened} onChange={setOpened}>
      <SmoothPopover.Target>
        <div onClick={() => setOpened((o) => !o)}>
          {shouldShowGreen ? (
            <Shimmer
              color="green"
              className={`${styles.leaderCard} ${styles.shimmerCard} ${styles.shimmerContainer}`}
            >
              <LeaderContent />
            </Shimmer>
          ) : (
            <Box
              className={`${styles.leaderCard} ${styles.standardCard} ${styles.standardContainer} ${exhausted ? styles.exhaustedContainer : ""}`}
            >
              <LeaderContent />
            </Box>
          )}
        </div>
      </SmoothPopover.Target>
      <SmoothPopover.Dropdown p={0}>
        <LeaderDetailsCard leaderId={id} />
      </SmoothPopover.Dropdown>
    </SmoothPopover>
  );
}

const getLeaderData = (leaderId: string) => {
  return leaders.find((leader) => leader.id === leaderId);
};
