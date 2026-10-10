import { useState, type ComponentProps, type ReactNode } from "react";
import { SmoothPopover } from "@/shared/ui/SmoothPopover";
import { Chip } from "./Chip";

type Props = Omit<ComponentProps<typeof Chip>, "onClick"> & {
  dropdownContent: ReactNode;
  onClick?: () => void;
  /** False when the host shows the details itself and only wants the chip. */
  showDetails?: boolean;
};

/**
 * ChipWithPopover - A chip that opens a popover when clicked.
 * Consolidates the common pattern used by PromissoryNote, Relic, ScoredSecret, etc.
 */
export function ChipWithPopover({
  dropdownContent,
  onClick,
  showDetails = true,
  ...chipProps
}: Props) {
  const [opened, setOpened] = useState(false);

  if (!showDetails) return <Chip {...chipProps} onClick={onClick} />;

  const handleClick = () => {
    setOpened((o) => !o);
    onClick?.();
  };

  return (
    <SmoothPopover opened={opened} onChange={setOpened}>
      <SmoothPopover.Target>
        <div>
          <Chip {...chipProps} onClick={handleClick} />
        </div>
      </SmoothPopover.Target>
      <SmoothPopover.Dropdown p={0}>{dropdownContent}</SmoothPopover.Dropdown>
    </SmoothPopover>
  );
}
