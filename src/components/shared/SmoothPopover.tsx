import { Popover, PopoverProps } from "@mantine/core";
import { ReactNode } from "react";

interface SmoothPopoverProps
  extends Omit<PopoverProps, "transitionProps" | "styles"> {
  children: ReactNode;
  opened: boolean;
  onChange: (opened: boolean) => void;
}

function SmoothPopoverBase({
  children,
  opened,
  onChange,
  position = "top",
  withArrow = true,
  shadow = "xl",
  ...props
}: SmoothPopoverProps) {
  return (
    <Popover
      position={position}
      withArrow={withArrow}
      shadow={shadow}
      opened={opened}
      zIndex={10000}
      onChange={onChange}
      transitionProps={{
        transition: {
          in: { opacity: 1, transform: "translateY(0) translateZ(0)" },
          out: { opacity: 0, transform: "translateY(16px) translateZ(0)" },
          common: { transformOrigin: "bottom" },
          transitionProperty: "transform, opacity",
        },
        duration: 280,
        timingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      {...props}
    >
      {children}
    </Popover>
  );
}

// Attach the sub-components
export const SmoothPopover = Object.assign(SmoothPopoverBase, {
  Target: Popover.Target,
  Dropdown: Popover.Dropdown,
});
