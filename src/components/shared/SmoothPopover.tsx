import { isMobileDevice } from "@/utils/isTouchDevice";
import { Popover, PopoverProps } from "@mantine/core";
import { ReactNode } from "react";

type SmoothPopoverProps = Omit<PopoverProps, "transitionProps" | "styles"> & {
  children: ReactNode;
  opened: boolean;
  onChange: (opened: boolean) => void;
};

function SmoothPopoverBase({
  children,
  opened,
  onChange,
  position = "top",
  withArrow = true,
  shadow = "xl",
  positionDependencies,
  ...props
}: SmoothPopoverProps) {
  const withinPortal = !isMobileDevice();
  return (
    <Popover
      position={position}
      withArrow={withArrow}
      shadow={shadow}
      opened={opened}
      onChange={onChange}
      withinPortal={withinPortal}
      transitionProps={{
        duration: 280,
        timingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      styles={{
        dropdown: {
          background: "transparent",
          padding: 0,
          border: "none",
        },
      }}
      // Hardcoded to match --z-smooth-popover; see src/utils/zIndexVariables.css
      zIndex={3500}
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
