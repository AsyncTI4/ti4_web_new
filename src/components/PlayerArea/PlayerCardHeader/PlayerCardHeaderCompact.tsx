import { Group, Text, Box, Image, Stack } from "@mantine/core";
import { PlayerColor } from "../PlayerColor";
import { StatusIndicator } from "../StatusIndicator";
import { SpeakerToken } from "../SpeakerToken";
import { StrategyCardBannerCompact } from "../StrategyCardBannerCompact";
import { Neighbors } from "../Neighbors";
import { SC_COLORS, SC_NAMES } from "@/data/strategyCardColors";
import type { PlayerData } from "@/data/types";

type Variant = "compact" | "full" | "mobile";

type PlayerCardHeaderCompactProps = {
  userName: string;
  faction: string;
  color: string;
  factionImageUrl: string;
  variant?: Variant;
  isSpeaker?: boolean;
  scs?: number[];
  exhaustedSCs?: number[];
  passed?: boolean;
  active?: boolean;
  neighbors?: string[];
  showStrategyCards?: boolean;
  showNeighbors?: boolean;
};

export function PlayerCardHeaderCompact({
  userName,
  faction,
  color,
  factionImageUrl,
  variant = "compact",
  isSpeaker = false,
  scs = [],
  exhaustedSCs = [],
  passed = false,
  active = false,
  neighbors = [],
  showStrategyCards = true,
  showNeighbors = false,
}: PlayerCardHeaderCompactProps) {
  const isCompact = variant === "compact";
  const isFull = variant === "full";
  const isMobile = variant === "mobile";

  const imageSize = isCompact ? 24 : isMobile ? 32 : 32;
  const usernameSize = isCompact ? "sm" : isMobile ? "lg" : "lg";
  const factionSize = isCompact ? "xs" : isMobile ? "sm" : "sm";

  if (isFull) {
    return (
      <Group justify="space-between" align="center" mb="md">
        <Group gap={8} px={4} align="center">
          <Image
            src={factionImageUrl}
            alt={faction}
            w={imageSize}
            h={imageSize}
            style={{
              filter: "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.8)) brightness(1.1)",
            }}
          />
          <Stack gap={0}>
            <Group>
              <Text
                span
                c="white"
                size={usernameSize}
                ff="heading"
                style={{
                  textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
                }}
              >
                {userName}
              </Text>
              <StatusIndicator passed={passed} active={active} />
            </Group>
            <Group gap={8}>
              <Text
                size={factionSize}
                span
                ml={4}
                opacity={0.9}
                c="white"
                ff="text"
                style={{
                  textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
                }}
              >
                {faction}
              </Text>
              <PlayerColor color={color} size="xs" />
            </Group>
          </Stack>
          {showNeighbors && (
            <Box visibleFrom="sm" ml="xs">
              <Neighbors neighbors={neighbors} />
            </Box>
          )}
        </Group>
        {showStrategyCards && (
          <Box>
            <Group gap="xs" align="center">
              {isSpeaker && <SpeakerToken isVisible />}
              {scs.map((scNumber) => {
                const isExhausted = exhaustedSCs?.includes(scNumber);
                return (
              <StrategyCardBannerCompact
                key={scNumber}
                number={scNumber}
                text={SC_NAMES[scNumber]}
                color={SC_COLORS[scNumber]}
                isExhausted={isExhausted}
              />
                );
              })}
            </Group>
          </Box>
        )}
      </Group>
    );
  }

  if (isMobile) {
    return (
      <Group gap="md" px={4} align="center">
        <Image
          src={factionImageUrl}
          alt={faction}
          w={imageSize}
          h={imageSize}
        />
        <Stack gap={0}>
          <Group>
            <Text span c="white" size={usernameSize} ff="heading">
              {userName}
            </Text>
            <StatusIndicator passed={passed} active={active} />
          </Group>
          <Group gap={8}>
            <Text size={factionSize} span ml={4} opacity={0.9} c="white" ff="text">
              {faction}
            </Text>
            <PlayerColor color={color} size="xs" />
          </Group>
        </Stack>

        {showNeighbors && (
          <Box ml="xs">
            <Neighbors neighbors={neighbors} />
          </Box>
        )}

        {showStrategyCards && (
          <Group gap="xs" align="center" mt={8}>
            {scs.map((scNumber) => {
              const isExhausted = exhaustedSCs?.includes(scNumber);
              return (
              <StrategyCardBannerCompact
                key={scNumber}
                number={scNumber}
                text={SC_NAMES[scNumber]}
                color={SC_COLORS[scNumber]}
                isExhausted={isExhausted}
              />
              );
            })}
            {isSpeaker && <SpeakerToken isVisible />}
          </Group>
        )}
      </Group>
    );
  }

  return (
    <Group
      gap={4}
      px={4}
      w="100%"
      align="center"
      wrap="nowrap"
      justify="space-between"
      style={{ minWidth: 0 }}
    >
      <Group gap={4} style={{ minWidth: 0, flex: 1 }}>
        <Image
          src={factionImageUrl}
          alt={faction}
          w={imageSize}
          h={imageSize}
          style={{
            filter: "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.8)) brightness(1.1)",
            flexShrink: 0,
          }}
        />
        <Text
          span
          c="white"
          size={usernameSize}
          ff="heading"
          style={{
            textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
            textOverflow: "ellipsis",
            overflow: "hidden",
            whiteSpace: "nowrap",
            flexShrink: 0,
            minWidth: 0,
          }}
        >
          {userName}
        </Text>
        <Text
          size={factionSize}
          span
          ml={4}
          opacity={0.9}
          c="white"
          ff="heading"
          style={{
            textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
            flexShrink: 1,
            textOverflow: "ellipsis",
            overflow: "hidden",
            whiteSpace: "nowrap",
            minWidth: 0,
          }}
        >
          [{faction}]
        </Text>
        <Box style={{ flexShrink: 2 }}>
          <PlayerColor color={color} size="sm" />
        </Box>
        <StatusIndicator passed={passed} active={active} />
      </Group>

      {showStrategyCards && (
        <Group gap={8} style={{ flexShrink: 0 }}>
          {isSpeaker && <SpeakerToken isVisible />}
          {scs.map((scNumber) => {
            const isExhausted = exhaustedSCs?.includes(scNumber);
            return (
              <StrategyCardBannerCompact
                key={scNumber}
                number={scNumber}
                text={SC_NAMES[scNumber]}
                color={SC_COLORS[scNumber]}
                isExhausted={isExhausted}
              />
            );
          })}
        </Group>
      )}
    </Group>
  );
}

