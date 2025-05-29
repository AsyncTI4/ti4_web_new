import { Box, Group, Text } from "@mantine/core";
import { SpeakerToken } from "./SpeakerToken";
import { Shimmer } from "./Shimmer";

type Props = {
  strategyCardName: string;
  strategyCardNumber: number;
  hasSpeaker: boolean;
};

export function StrategyCardBanner({
  strategyCardName,
  strategyCardNumber,
  hasSpeaker,
}: Props) {
  return (
    <Group gap="xs" align="center">
      <Shimmer
        color="red"
        p={2}
        px="sm"
        pl="lg"
        pos="relative"
        display="flex"
        style={{
          minWidth: "140px",
          background:
            "linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(220, 38, 38, 0.05) 50%, rgba(239, 68, 68, 0.08) 100%)",
          border: "1px solid rgba(239, 68, 68, 0.2)",
          borderRadius: "8px",
        }}
      >
        {/* Additional subtle inner glow overlay */}
        <Box
          pos="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(239, 68, 68, 0.06) 0%, transparent 70%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        <Box
          bg="white"
          pos="absolute"
          top={0}
          left={-10}
          w={35}
          h={35}
          display="flex"
          style={{
            border: "3px solid var(--mantine-color-red-7)",
            borderRadius: "999px",
            alignItems: "center",
            justifyContent: "center",
            filter: "drop-shadow(0 1px 2px rgba(239, 68, 68, 0.3))",
            zIndex: 2,
          }}
        >
          <Text ff="heading" c="red.9" size="30px">
            {strategyCardNumber}
          </Text>
        </Box>
        <Text
          ff="heading"
          c="white"
          size="xl"
          pos="relative"
          px={24}
          style={{
            textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
            zIndex: 1,
          }}
        >
          {strategyCardName}
        </Text>
      </Shimmer>

      {/* Speaker Token */}
      <SpeakerToken isVisible={hasSpeaker} />
    </Group>
  );
}
