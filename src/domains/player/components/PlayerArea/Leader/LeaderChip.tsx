import { Box, Group, Stack, Text, Image } from "@mantine/core";
import { IconLock } from "@tabler/icons-react";
import cx from "clsx";
import { useDisclosure } from "@/hooks/useDisclosure";
import { Chip } from "@/shared/ui/primitives/Chip";
import { SmoothPopover } from "@/shared/ui/SmoothPopover";
import { LeaderDetailsCard } from "../LeaderDetailsCard";
import { leaders } from "@/entities/data/leaders";
import { showLeader } from "./showLeader";
import styles from "./Leader.module.css";

export type LeaderChipProps = {
  id: string;
  type: "agent" | "commander" | "hero";
  tgCount: number;
  exhausted: boolean;
  locked: boolean;
  active: boolean;
  variant?: "default" | "mobile";
};

export function LeaderChip({ variant = "default", ...props }: LeaderChipProps) {
  const { id, type, exhausted, locked, active } = props;
  const { opened, setOpened, toggle } = useDisclosure(false);
  const leaderData = getLeaderData(id);
  if (!leaderData) return null;

  const shouldShowGreen = !exhausted && !locked;
  const accentColor = shouldShowGreen ? "green" : "gray";
  const showLeaderImage = showLeader(leaderData.source);

  const typeClassName = cx(
    styles.leaderType,
    shouldShowGreen ? styles.leaderTypeActive : styles.leaderTypeInactive,
  );

  const nameClassName = cx(
    styles.leaderName,
    shouldShowGreen ? styles.leaderNameActive : styles.leaderNameInactive,
  );

  return (
    <SmoothPopover opened={opened} onChange={setOpened}>
      <SmoothPopover.Target>
        <Chip
          accent={accentColor}
          onClick={toggle}
          className={cx(variant === "mobile" ? styles.mobile : styles.pill)}
        >
          <Box className={styles.leaderWrapper}>
            <Group gap={variant === "mobile" ? 8 : 6} className={styles.leaderGroup}>
              {showLeaderImage && (
                <div className={styles.leaderImageContainer}>
                  <Image src={`/leaders/${id}.webp`} className={styles.leaderImage} />
                </div>
              )}

              {variant === "mobile" ? (
                <Text className={typeClassName}>{type}</Text>
              ) : (
                <Stack gap={0} className={styles.textContainer}>
                  <Text className={nameClassName}>{leaderData.name}</Text>
                  <Text className={typeClassName}>{type}</Text>
                </Stack>
              )}
            </Group>

            {active && <Box className={styles.onlineDot} />}
            {locked && (
              <Box className={styles.lockIcon}>
                <IconLock size={16} color="white" stroke={2.5} />
              </Box>
            )}
          </Box>
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
