import { useContentScale } from "@/shared/ui/ScaledContent";
import { Popover, type PopoverDropdownProps, type PopoverProps } from "@/ds";
import { createContext, useContext, useState, type ReactNode } from "react";

type SmoothPopoverProps = Omit<PopoverProps, "children"> & {
  children: ReactNode;
  opened: boolean;
  onChange: (opened: boolean) => void;
};

/**
 * True until the popover is first opened. A game mounts hundreds of these
 * closed, and a mounted popover costs positioning hooks, a portal and effects
 * even when nothing is shown, so until then only the target renders.
 */
const DormantContext = createContext(false);

function SmoothPopoverBase({ children, opened, onChange, position = "top", withArrow = true, ...props }: SmoothPopoverProps) {
  const [armed, setArmed] = useState(opened);
  if (opened && !armed) setArmed(true);

  if (!armed) {
    return <DormantContext value={true}>{children}</DormantContext>;
  }

  return (
    <Popover
      position={position}
      withArrow={withArrow}
      opened={opened}
      onChange={onChange}
      zIndex="var(--z-smooth-popover)"
      {...props}
    >
      {children}
    </Popover>
  );
}

function SmoothPopoverTarget({ children }: { children: ReactNode }) {
  const dormant = useContext(DormantContext);
  if (dormant) return children;
  return <Popover.Target>{children}</Popover.Target>;
}

/** The dropdown brings no frame of its own: the details card inside is the surface. */
function SmoothPopoverDropdown({ children, ...props }: PopoverDropdownProps) {
  const dormant = useContext(DormantContext);
  const dropdownScale = useContentScale();
  if (dormant) return null;

  return (
    <Popover.Dropdown unstyled {...props}>
      <div style={{ zoom: dropdownScale, transformOrigin: "top left" }}>{children}</div>
    </Popover.Dropdown>
  );
}

export const SmoothPopover = Object.assign(SmoothPopoverBase, {
  Target: SmoothPopoverTarget,
  Dropdown: SmoothPopoverDropdown,
});
