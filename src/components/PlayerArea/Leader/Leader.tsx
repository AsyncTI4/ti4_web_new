import { Group, Stack, Text, Image, Box } from "@mantine/core";
import { IconLock } from "@tabler/icons-react";
import { useState } from "react";
import { leaders } from "../../../data/leaders";
import { SmoothPopover } from "../../shared/SmoothPopover";
import { LeaderDetailsCard } from "../LeaderDetailsCard";
import styles from "./Leader.module.css";
import { Chip } from "@/components/shared/primitives/Chip";

type Props = {
  id: string;
  type: "agent" | "commander" | "hero";
  tgCount: number;
  exhausted: boolean;
  locked: boolean;
  active: boolean;
};

export function Leader({ id, type, exhausted, locked, active }: Props) {
  const [opened, setOpened] = useState(false);
  const leaderData = getLeaderData(id);
  if (!leaderData) return null;

  const shouldShowGreen = !exhausted && !locked;
  const accentColor = shouldShowGreen ? "green" : "gray";
  const showLeaderImage =
    leaderData.source === "base" || leaderData.source === "pok";

  return (
    <SmoothPopover opened={opened} onChange={setOpened}>
      <SmoothPopover.Target>
        <Chip accent={accentColor} onClick={() => setOpened((o) => !o)}>
          <Group gap={8}>
            {showLeaderImage ? (
              <div className={styles.leaderImageContainer}>
                <Image
                  src={`/leaders/${id}.webp`}
                  className={styles.leaderImage}
                />
              </div>
            ) : undefined}
            <Stack gap={0}>
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
            {active && <Box className={styles.onlineDot} />}
            {locked && (
              <Box className={styles.lockIcon}>
                <IconLock size={16} color="white" stroke={2.5} />
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

const getLeaderData = (leaderId: string) => {
  return leaders.find((leader) => leader.id === leaderId);
};
