import { Box, Text, Image } from "@mantine/core";
import { useState } from "react";
import { Shimmer } from "../Shimmer";
import { getActionCard } from "../../../lookup/actionCards";
import { getGradientClasses } from "../gradientClasses";
import { SmoothPopover } from "../../shared/SmoothPopover";
import { ActionCardDetailsCard } from "../ActionCardDetailsCard";
import styles from "./ActionCard.module.css";

type Props = {
  actionCardId: string;
  onClick?: () => void;
  showDetails?: boolean;
};

export function ActionCard({
  actionCardId,
  onClick,
  showDetails = true,
}: Props) {
  const [opened, setOpened] = useState(false);
  const actionCardData = getActionCard(actionCardId);

  if (!actionCardData) return null;

  const gradientClasses = getGradientClasses("yellow");

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    if (showDetails) {
      setOpened((o) => !o);
    }
  };

  const cardContent = (
    <Box className={styles.actionCard} onClick={handleClick}>
      <Shimmer color="yellow" py={2} px={6} className={gradientClasses.border}>
        <Box className={styles.contentContainer}>
          <Box
            className={`${styles.iconPlaceholder} ${gradientClasses.iconFilter}`}
          >
            AC
          </Box>
          <Text size="xs" fw={700} c="white" className={styles.textContainer}>
            {actionCardData.name}
          </Text>
        </Box>
      </Shimmer>
    </Box>
  );

  if (!showDetails) {
    return cardContent;
  }

  return (
    <SmoothPopover opened={opened} onChange={setOpened}>
      <SmoothPopover.Target>
        <div>{cardContent}</div>
      </SmoothPopover.Target>
      <SmoothPopover.Dropdown>
        <ActionCardDetailsCard actionCardId={actionCardId} />
      </SmoothPopover.Dropdown>
    </SmoothPopover>
  );
}
