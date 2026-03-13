import { Box, Text } from "@mantine/core";
import { useDisclosure } from "@/hooks/useDisclosure";
import { Shimmer } from "../Shimmer";
import { getActionCard } from "@/entities/lookup/actionCards";
import { getGradientClasses } from "../gradientClasses";
import { SmoothPopover } from "@/shared/ui/SmoothPopover";
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
  const { opened, setOpened, toggle } = useDisclosure(false);
  const actionCardData = getActionCard(actionCardId);

  if (!actionCardData) return null;

  const gradientClasses = getGradientClasses("orange");
  const timingWindow = actionCardData.window?.trim().replace(/:$/, "");
  const timingLabel =
    timingWindow?.toLowerCase() === "action" ? "ACTION" : timingWindow;

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    if (showDetails) {
      toggle();
    }
  };

  const cardContent = (
    <Box className={styles.actionCard} onClick={handleClick}>
      <Shimmer color="orange" py={4} px={6} className={gradientClasses.border}>
        <Box className={styles.contentContainer}>
          <Box
            className={`${styles.iconPlaceholder} ${gradientClasses.iconFilter}`}
          >
            AC
          </Box>
          <Box className={styles.textGroup}>
            <Text size="xs" fw={700} c="white" className={styles.textContainer}>
              {actionCardData.name}
            </Text>
            {timingLabel && (
              <Text size="10px" className={styles.windowText}>
                {timingLabel}
              </Text>
            )}
          </Box>
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
