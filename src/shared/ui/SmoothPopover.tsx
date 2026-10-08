import { useContentScale } from "@/shared/ui/ScaledContent";
import { Popover, PopoverProps } from "@mantine/core";
import {
  ComponentProps,
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type SmoothPopoverProps = Omit<PopoverProps, "transitionProps" | "styles"> & {
  children: ReactNode;
  opened: boolean;
  onChange: (opened: boolean) => void;
};

type SmoothPopoverDropdownProps = ComponentProps<typeof Popover.Dropdown>;
type SmoothPopoverTargetProps = ComponentProps<typeof Popover.Target>;

/**
 * True until the popover is first opened. A game mounts hundreds of these
 * closed, and a mounted Mantine Popover costs floating-ui hooks, a portal and
 * effects even when nothing is shown, so until then only the target renders.
 */
const DormantContext = createContext(false);

function SmoothPopoverBase({
  children,
  opened,
  onChange,
  position = "top",
  withArrow = true,
  shadow = "xl",
  ...props
}: SmoothPopoverProps) {
  const [armed, setArmed] = useState(opened);
  const [ready, setReady] = useState(opened);

  if (opened && !armed) setArmed(true);

  // Mount closed first and open a frame later: Mantine's Portal mounts its
  // Transition a commit late, and opening sooner would skip the enter animation.
  useEffect(() => {
    if (!armed || ready) return;
    const frame = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(frame);
  }, [armed, ready]);

  if (!armed) {
    return <DormantContext value={true}>{children}</DormantContext>;
  }

  return (
    <Popover
      position={position}
      withArrow={withArrow}
      shadow={shadow}
      opened={opened && ready}
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

function SmoothPopoverTarget({ children, ...props }: SmoothPopoverTargetProps) {
  const dormant = useContext(DormantContext);
  if (dormant) return children;

  return <Popover.Target {...props}>{children}</Popover.Target>;
}

function SmoothPopoverDropdown({
  children,
  ...props
}: SmoothPopoverDropdownProps) {
  const dormant = useContext(DormantContext);
  const dropdownScale = useContentScale();
  if (dormant) return null;

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
  Target: SmoothPopoverTarget,
  Dropdown: SmoothPopoverDropdown,
});
