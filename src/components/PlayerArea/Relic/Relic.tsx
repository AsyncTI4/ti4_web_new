import { Box, Image } from "@mantine/core";
import { getRelicData } from "../../../lookup/relics";
import { RelicCard } from "./RelicCard";
import { SmoothPopover } from "../../shared/SmoothPopover";
import { useState } from "react";
import { getGradientClasses } from "../gradientClasses";
import styles from "./Relic.module.css";
import { Chip } from "@/components/shared/primitives/Chip";
import { IconX } from "@tabler/icons-react";
import { isMobileDevice } from "@/utils/isTouchDevice";

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

  const gradientClasses = getGradientClasses("yellow");

  return (
    <SmoothPopover opened={opened} onChange={setOpened}>
      <SmoothPopover.Target>
        <Chip
          className={styles.relicCard}
          accent={isExhausted ? "bloodOrange" : "yellow"}
          onClick={() => setOpened((o) => !o)}
          leftSection={
            !isMobileDevice() ? (
              <Box className={styles.iconWrapper}>
                <Image
                  src="/relicicon.webp"
                  className={`${gradientClasses.iconFilter} ${styles.icon} ${
                    isExhausted ? styles.exhaustedIcon : ""
                  }`}
                />
                {isExhausted && (
                  <span className={styles.exhaustedX}>
                    <IconX
                      size={18}
                      stroke={3}
                      color="var(--mantine-color-red-1)"
                    />
                  </span>
                )}
              </Box>
            ) : undefined
          }
          title={relicData.shortName || relicData.name}
          px="sm"
        />
      </SmoothPopover.Target>
      <SmoothPopover.Dropdown p={0}>
        <RelicCard relicId={relicId} />
      </SmoothPopover.Dropdown>
    </SmoothPopover>
  );
}
