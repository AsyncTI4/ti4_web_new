import { Box } from "@mantine/core";

type Props = {
  orientation?: "horizontal" | "vertical";
};

export function ShimmerDivider({ orientation = "horizontal" }: Props) {
  const isVertical = orientation === "vertical";

  return (
    <Box
      style={{
        width: 1,
        height: isVertical ? "100%" : "1px",
        background: isVertical
          ? "linear-gradient(180deg, transparent 0%, rgba(148, 163, 184, 0.1) 10%, rgba(148, 163, 184, 0.6) 50%, rgba(148, 163, 184, 0.1) 90%, transparent 100%)"
          : "linear-gradient(90deg, transparent 0%, rgba(148, 163, 184, 0.1) 10%, rgba(148, 163, 184, 0.6) 50%, rgba(148, 163, 184, 0.1) 90%, transparent 100%)",
        margin: isVertical ? 0 : "2px 12px",
      }}
    />
  );
}
