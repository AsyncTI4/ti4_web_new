import { Box, Text, Image } from "@mantine/core";
import { getRelicData } from "../../../lookup/relics";
import { RelicCard } from "./RelicCard";
import { SmoothPopover } from "../../shared/SmoothPopover";
import { useState } from "react";
import { Shimmer } from "../Shimmer";
import { getGradientClasses } from "../gradientClasses";
import styles from "./Relic.module.css";

type Props = {
  relicId: string;
};

export function Relic({ relicId }: Props) {
  const [opened, setOpened] = useState(false);

  const relicData = getRelicData(relicId);

  if (!relicData) {
    console.warn(`Relic with ID "${relicId}" not found`);
    return null;
  }

  const gradientClasses = getGradientClasses("yellow");

  return (
    <SmoothPopover opened={opened} onChange={setOpened}>
      <SmoothPopover.Target>
        <Box className={styles.relicCard} onClick={() => setOpened((o) => !o)}>
          <Shimmer
            color="yellow"
            py={2}
            px={6}
            className={gradientClasses.border}
          >
            <Box className={styles.contentContainer}>
              <Image
                src="/relicicon.webp"
                className={`${gradientClasses.iconFilter} ${styles.icon}`}
              />
              <Text
                size="xs"
                fw={700}
                c="white"
                className={styles.textContainer}
              >
                {relicData.shortName || relicData.name}
              </Text>
            </Box>
          </Shimmer>
        </Box>
      </SmoothPopover.Target>
      <SmoothPopover.Dropdown p={0}>
        <RelicCard relicId={relicId} />
      </SmoothPopover.Dropdown>
    </SmoothPopover>
  );
}
