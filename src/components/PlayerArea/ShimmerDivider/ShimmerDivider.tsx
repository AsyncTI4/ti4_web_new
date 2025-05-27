import { Box } from "@mantine/core";

type Props = {};

export function ShimmerDivider({}: Props) {
  return (
    <Box
      style={{
        height: "1px",
        background:
          "linear-gradient(90deg, transparent 0%, rgba(148, 163, 184, 0.3) 20%, rgba(148, 163, 184, 0.3) 80%, transparent 100%)",
        margin: "2px 12px",
      }}
    />
  );
}
