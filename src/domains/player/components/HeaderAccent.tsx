import { Box } from "@mantine/core";
import { generateColorGradient } from "@/entities/lookup/colors";

type Props = {
  color: string;
};

export function HeaderAccent({ color }: Props) {
  return (
    <Box
      pos="absolute"
      bottom={0}
      left={0}
      right={0}
      h={8}
      style={{
        background: generateColorGradient(color, 0.6),
      }}
    />
  );
}
