import { useState } from "react";
import { SmoothPopover } from "@/shared/ui/SmoothPopover";
import { Chip } from "./Chip";
import type { ColorKey } from "@/domains/player/components/gradientClasses";

type ChipAccent =
  | ColorKey
  | "grey"
  | "gray"
  | "deepRed"
  | "bloodOrange"
  | "blueRed"
  | "blueGreen"
  | "blueYellow"
  | "greenRed"
  | "greenYellow"
  | "yellowRed";

type ChipSize = "xs" | "sm" | "md";

type Props = {
  title: string;
  accent?: ChipAccent;
  leftSection?: React.ReactNode;
  ribbon?: boolean;
  accentLine?: boolean;
  strong?: boolean;
  size?: ChipSize;
  dropdownContent: React.ReactNode;
  onClick?: () => void;
  className?: string;
  px?: number | string;
  py?: number | string;
};

/**
 * ChipWithPopover - A chip that opens a popover when clicked.
 * Consolidates the common pattern used by PromissoryNote, Relic, ScoredSecret, etc.
 */
export function ChipWithPopover({
  title,
  accent = "gray",
  leftSection,
  ribbon = false,
  accentLine = false,
  strong = false,
  size = "md",
  dropdownContent,
  onClick,
  className,
  px,
  py,
}: Props) {
  const [opened, setOpened] = useState(false);

  const handleClick = () => {
    setOpened((o) => !o);
    onClick?.();
  };

  return (
    <SmoothPopover opened={opened} onChange={setOpened}>
      <SmoothPopover.Target>
        <div>
          <Chip
            accent={accent}
            onClick={handleClick}
            leftSection={leftSection}
            title={title}
            ribbon={ribbon}
            accentLine={accentLine}
            strong={strong}
            size={size}
            className={className}
            px={px}
            py={py}
          />
        </div>
      </SmoothPopover.Target>
      <SmoothPopover.Dropdown p={0}>{dropdownContent}</SmoothPopover.Dropdown>
    </SmoothPopover>
  );
}
