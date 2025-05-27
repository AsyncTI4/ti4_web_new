import { Box, Text, Image } from "@mantine/core";
import { Shimmer } from "../Shimmer";

type Props = {
  text: string;
};

export function ScoredSecret({ text }: Props) {
  return (
    <Shimmer color="red" p={2} px="sm">
      <Box
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          minWidth: 0,
        }}
      >
        <Image
          src="/so_icon.png"
          style={{
            width: "20px",
            height: "20px",
            filter: "drop-shadow(0 1px 2px rgba(239, 68, 68, 0.3))",
            flexShrink: 0,
          }}
        />
        <Text
          size="xs"
          fw={700}
          c="white"
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            minWidth: 0,
            flex: 1,
          }}
        >
          {text}
        </Text>
      </Box>
    </Shimmer>
  );
}
