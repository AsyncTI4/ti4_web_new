import { Stack } from "@mantine/core";
import { ReactNode, useState } from "react";
import cx from "clsx";
import { SmoothPopover } from "../SmoothPopover";
import { Cardback } from "@/domains/player/components/PlayerArea/Cardback";

export type CardbackPopoverProps = {
  imageSrc: string;
  alt: string;
  count?: string | number | ReactNode;
  size?: "xs" | "sm" | "md" | "lg";
  dropdown: ReactNode;
  cardClassName?: string;
  dropdownClassName?: string;
  cardKey?: string | number;
};

export function CardbackPopover({
  imageSrc,
  alt,
  count = 0,
  size = "lg",
  dropdown,
  cardClassName,
  dropdownClassName,
  cardKey,
}: CardbackPopoverProps) {
  const [opened, setOpened] = useState(false);

  return (
    <SmoothPopover opened={opened} onChange={setOpened}>
      <SmoothPopover.Target>
        <Stack
          className={cx(cardClassName)}
          onClick={() => setOpened((o) => !o)}
        >
          <Cardback
            key={cardKey}
            src={imageSrc}
            alt={alt}
            count={count}
            size={size}
          />
        </Stack>
      </SmoothPopover.Target>
      <SmoothPopover.Dropdown className={dropdownClassName}>
        {dropdown}
      </SmoothPopover.Dropdown>
    </SmoothPopover>
  );
}
