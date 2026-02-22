import { Box } from "@mantine/core";
import { IconGripVertical } from "@tabler/icons-react";
import classes from "./DragHandle.module.css";

type DragHandleProps = {
  onMouseDown: (e: React.MouseEvent) => void;
};

export function DragHandle({ onMouseDown }: DragHandleProps) {
  return (
    <Box className={classes.dragHandleContainer} onMouseDown={onMouseDown}>
      <Box className={classes.dragHandleBorder} />
      <Box className={classes.dragHandlePill}>
        <IconGripVertical size={16} className={classes.dragHandleIcon} />
      </Box>
    </Box>
  );
}
