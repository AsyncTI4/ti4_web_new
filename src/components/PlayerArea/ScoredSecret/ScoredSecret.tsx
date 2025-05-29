import { Box, Text, Image } from "@mantine/core";
import { Shimmer } from "../Shimmer";
import { secretObjectives } from "../../../data/secretObjectives";

type Props = {
  secretId: string;
  score: number;
};

export function ScoredSecret({ secretId, score }: Props) {
  const secretData = secretObjectives.find(
    (secret) => secret.alias === secretId
  );
  const secretName = secretData?.name || secretId;

  return (
    <Shimmer color="red" py={2} px={6}>
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
          {secretName}{" "}
          <Text
            span
            size="xs"
            fw={600}
            c="gray.4"
            style={{
              opacity: 0.7,
            }}
          >
            ({score})
          </Text>
        </Text>
      </Box>
    </Shimmer>
  );
}
