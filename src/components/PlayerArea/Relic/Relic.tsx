import { Box, Group, Text, Image, rem } from "@mantine/core";
import { useState } from "react";
import { getRelicData } from "../../../lookup/relics";
import { RelicCard } from "./RelicCard";
import { SmoothPopover } from "../../shared/SmoothPopover";
import { IconX } from "@tabler/icons-react";
import { cdnImage } from "@/data/cdnImage";
import { isMobileDevice } from "@/utils/isTouchDevice";
import styles from "./Relic.module.css";
import cx from "clsx";

type Props = {
  relicId: string;
  isExhausted?: boolean;
};

export function Relic({ relicId, isExhausted = false }: Props) {
  const [opened, setOpened] = useState(false);
  const relicData = getRelicData(relicId);

  if (!relicData) {
    console.warn(`Relic with ID "${relicId}" not found`);
    return null;
  }

  const isFake = relicData.isFakeRelic ?? false;

  return (
    <SmoothPopover opened={opened} onChange={setOpened}>
      <SmoothPopover.Target>
        <Box
          className={cx(
            styles.relicCard,
            isFake ? styles.fake : styles.gold,
            isExhausted && styles.exhausted
          )}
          onClick={() => setOpened((o) => !o)}
        >
          <Group className={styles.contentGroup}>
            <Box className={styles.iconWrapper}>
              <Image
                src={isFake ? cdnImage("/tokens/token_frontier.webp") : "/relicicon.webp"}
                className={cx(styles.icon, isExhausted && styles.exhaustedIcon)}
              />
              {isExhausted && (
                <span className={styles.exhaustedX}>
                  <IconX size={rem(14)} stroke={3} color="var(--mantine-color-red-1)" />
                </span>
              )}
            </Box>
            <Text className={styles.relicName} fz={isMobileDevice() ? 14 : "xs"}>
              {relicData.shortName || relicData.name}
            </Text>
          </Group>
        </Box>
      </SmoothPopover.Target>
      <SmoothPopover.Dropdown p={0}>
        <RelicCard relicId={relicId} />
      </SmoothPopover.Dropdown>
    </SmoothPopover>
  );
}
