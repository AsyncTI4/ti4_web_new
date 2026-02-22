import { Button, type ButtonProps } from "@mantine/core";
import { IconRefresh } from "@tabler/icons-react";
import type { CSSProperties, ReactNode } from "react";

const defaultStyle: CSSProperties = {
  position: "fixed",
  top: "80px",
  left: "50%",
  transform: "translateX(-50%)",
  zIndex: 1000,
};

type FloatingRefreshButtonProps = Pick<
  ButtonProps,
  "onClick" | "loading" | "disabled"
> & {
  label?: ReactNode;
  style?: CSSProperties;
};

export function FloatingRefreshButton({
  label = "Refresh",
  style,
  ...buttonProps
}: FloatingRefreshButtonProps) {
  return (
    <Button
      variant="filled"
      size="md"
      radius="xl"
      leftSection={<IconRefresh size={20} />}
      style={{ ...defaultStyle, ...style }}
      {...buttonProps}
    >
      {label}
    </Button>
  );
}
