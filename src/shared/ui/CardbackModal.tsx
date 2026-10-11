import { Stack } from "@/ds";
import { ReactNode, useState } from "react";
import { Cardback } from "@/shared/ui/Cardback";
import { AppModal } from "@/shared/ui/AppModal";
import styles from "./CardbackModal.module.css";

type CardbackModalProps = {
  imageSrc: string;
  alt: string;
  title: string;
  count?: string | number | ReactNode;
  size?: "xs" | "sm" | "md" | "lg";
  children: ReactNode;
  modalSize?: string | number;
  cardKey?: string | number;
};

/** A deck's card back; clicking it opens the deck list on the system modal frame. */
export function CardbackModal({
  imageSrc,
  alt,
  title,
  count = 0,
  size = "lg",
  children,
  modalSize = 620,
  cardKey,
}: CardbackModalProps) {
  const [opened, setOpened] = useState(false);
  const countLine =
    typeof count === "number" || typeof count === "string" ? `${count} in deck` : null;

  return (
    <>
      <Stack className={styles.trigger} onClick={() => setOpened(true)}>
        <Cardback key={cardKey} src={imageSrc} alt={alt} count={count} size={size} />
      </Stack>
      <AppModal
        opened={opened}
        onClose={() => setOpened(false)}
        size={modalSize}
        title={
          <span className={styles.titleBlock}>
            {title}
            {countLine && <small className={styles.subline}>{countLine}</small>}
          </span>
        }
      >
        {children}
      </AppModal>
    </>
  );
}
