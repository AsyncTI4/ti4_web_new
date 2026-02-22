import { Group, type GroupProps } from "@mantine/core";

type Props = GroupProps & {
  children: React.ReactNode;
};

export function ChipList({ children, gap = 4, wrap = "nowrap", ...groupProps }: Props) {
  return (
    <Group {...groupProps} gap={gap} wrap={wrap} align="center" style={{ minWidth: 0 }}>
      {children}
    </Group>
  );
}


