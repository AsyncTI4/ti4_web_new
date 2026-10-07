import { computePanelsZoom } from "@/utils/zoom";
import { Popover, PopoverProps } from "@mantine/core";
import { ComponentProps, ReactNode } from "react";

type SmoothPopoverProps = Omit<PopoverProps, "transitionProps" | "styles"> & {
  children: ReactNode;
  opened: boolean;
  onChange: (opened: boolean) => void;
};

type SmoothPopoverDropdownProps = ComponentProps<typeof Popover.Dropdown>;

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
      onChange={onChange}
      withinPortal
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
      zIndex="var(--z-smooth-popover)"
      {...props}
    >
      {children}
    </Popover>
  );
}

function SmoothPopoverDropdown({
  children,
  ...props
}: SmoothPopoverDropdownProps) {
  const dropdownScale = computePanelsZoom();

  return (
    <Popover.Dropdown {...props}>
      <div
        style={{
          zoom: dropdownScale,
          transformOrigin: "top left",
        }}
      >
        {children}
      </div>
    </Popover.Dropdown>
  );
}

export const SmoothPopover = Object.assign(SmoothPopoverBase, {
  Target: Popover.Target,
  Dropdown: SmoothPopoverDropdown,
});
