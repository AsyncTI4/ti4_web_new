import { Box } from "@mantine/core";

interface InfluenceIconProps {
  size?: number;
}

export default function InfluenceIcon({ size = 24 }: InfluenceIconProps) {
  return (
    <Box w={size} h={size} style={{ flexShrink: 0 }}>
      <svg width="100%" height="100%" viewBox="0 0 24 24" style={{ display: "block" }}>
        <polygon
          points="6,2 18,2 22,12 18,22 6,22 2,12"
          fill="transparent"
          stroke="#3b82f6"
          strokeWidth="2"
        />
      </svg>
    </Box>
  );
}
