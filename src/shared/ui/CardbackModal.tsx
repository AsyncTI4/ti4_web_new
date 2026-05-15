import { Stack } from "@mantine/core";
import { ReactNode, useState } from "react";
import cx from "clsx";
import { Cardback } from "@/domains/player/components/Cardback";
import { AppModal } from "@/shared/ui/AppModal";
import styles from "./CardbackModal.module.css";

export type CardbackModalProps = {
  imageSrc: string;
  alt: string;
  title: string;
  count?: string | number | ReactNode;
  size?: "xs" | "sm" | "md" | "lg";
  children: ReactNode;
  cardClassName?: string;
  modalSize?: string | number;
  cardKey?: string | number;
};

export function CardbackModal({
  imageSrc,
  alt,
  title,
  count = 0,
  size = "lg",
  children,
  cardClassName,
  modalSize = "xl",
  cardKey,
}: CardbackModalProps) {
  const [opened, setOpened] = useState(false);

  return (
    <>
      <Stack className={cx(cardClassName)} onClick={() => setOpened(true)}>
        <Cardback
          key={cardKey}
          src={imageSrc}
          alt={alt}
          count={count}
          size={size}
        />
      </Stack>
      <AppModal
        opened={opened}
        onClose={() => setOpened(false)}
        title={title}
        size={modalSize}
        classNames={{
          content: styles.content,
          header: styles.header,
          title: styles.title,
          body: styles.body,
          close: styles.close,
        }}
      >
        {children}
      </AppModal>
    </>
  );
}
