import { Group, Text } from "@mantine/core";
import { cdnImage } from "@/entities/data/cdnImage";
import classes from "../UnitStack.module.css";

export function GalvanizeBadge({
  count,
  style,
  className,
}: {
  count: number;
  style?: React.CSSProperties;
  className?: string;
}) {
  return (
    <Group w="45px" h="20px" gap="xs" className={className} style={style}>
      <div className={classes.galvanizeBadgeInner}>
        <img
          src={cdnImage("/extra/marker_galvanize.png")}
          alt="Galvanize"
          className={classes.galvanizeBadgeImage}
        />
        <Text inline pl="22px" fz="18px" fw={600} c="white" ff="'SLIDER'">
          {count}
        </Text>
      </div>
    </Group>
  );
}
