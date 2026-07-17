import type { ReactNode } from "react";
import { Group, Text, Box, Image, Stack } from "@mantine/core";
import { PlayerColor } from "../PlayerColor";
import { StatusIndicator } from "../StatusIndicator";
import { SpeakerToken } from "../SpeakerToken";
import { TyrantToken } from "../TyrantToken";
import { StrategyCard } from "../StrategyCard";
import { Neighbors } from "../Neighbors";
import { Breakthrough } from "../Breakthrough/Breakthrough";
import breakthroughStyles from "../Breakthrough/Breakthrough.module.css";
import type { BreakthroughData } from "@/entities/data/types";
import { lowPriorityImageProps } from "@/shared/ui/imageLoading";

type PlayerCardHeaderProps = {
  userName: string;
  faction: string;
  factionDisplayName: string;
  color: string;
  factionImageUrl: string;
  isSpeaker?: boolean;
  isTyrant?: boolean;
  scs?: number[];
  exhaustedSCs?: number[];
  passed?: boolean;
  active?: boolean;
  showNeighbors?: boolean;
  breakthrough?: BreakthroughData;
};

function StrategyCards({
  scs = [],
  exhaustedSCs = [],
}: {
  scs?: number[];
  exhaustedSCs?: number[];
}) {
  return (
    <>
      {scs.map((scNumber) => (
        <StrategyCard
          key={scNumber}
          initiative={scNumber}
          isExhausted={exhaustedSCs.includes(scNumber)}
        />
      ))}
    </>
  );
}

const MOBILE_IDENTITY_WIDTH = 354;
const MOBILE_BREAKTHROUGH_WIDTH = 176;

export function PlayerCardHeaderCompact({
  userName,
  faction,
  factionDisplayName,
  color,
  factionImageUrl,
  isSpeaker = false,
  isTyrant = false,
  scs = [],
  exhaustedSCs = [],
  passed = false,
  active = false,
}: PlayerCardHeaderProps) {
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
          {...lowPriorityImageProps}
          src={factionImageUrl}
          alt={faction}
          w={24}
          h={24}
          style={{
            filter:
              "drop-shadow(0 1px 1px rgba(0, 0, 0, 0.55)) brightness(1.02)",
            flexShrink: 0,
          }}
        />
        <Text
          span
          c="white"
          size="sm"
          ff="heading"
          style={{
            textShadow: "0 1px 1px rgba(0, 0, 0, 0.62)",
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
          size="xs"
          span
          ml={4}
          opacity={0.9}
          c="white"
          ff="heading"
          style={{
            textShadow: "0 1px 1px rgba(0, 0, 0, 0.62)",
            flexShrink: 1,
            textOverflow: "ellipsis",
            overflow: "hidden",
            whiteSpace: "nowrap",
            minWidth: 0,
          }}
        >
          [{factionDisplayName}]
        </Text>
        <Box style={{ flexShrink: 2 }}>
          <PlayerColor color={color} size="sm" />
        </Box>
        <StatusIndicator passed={passed} active={active} />
      </Group>

      <Group gap={8} style={{ flexShrink: 0 }}>
        {isSpeaker && <SpeakerToken isVisible />}
        {isTyrant && <TyrantToken isVisible />}
        <StrategyCards scs={scs} exhaustedSCs={exhaustedSCs} />
      </Group>
    </Group>
  );
}

export function PlayerCardHeaderFull({
  userName,
  faction,
  factionDisplayName,
  color,
  factionImageUrl,
  isSpeaker = false,
  isTyrant = false,
  scs = [],
  exhaustedSCs = [],
  passed = false,
  active = false,
  neighbors = [],
  showNeighbors = true,
}: PlayerCardHeaderProps & { neighbors?: string[] }) {
  return (
    <Group justify="space-between" align="center" mb="md">
      <Group gap={8} px={4} align="center">
        <Image
          {...lowPriorityImageProps}
          src={factionImageUrl}
          alt={faction}
          w={32}
          h={32}
          style={{
            filter:
              "drop-shadow(0 1px 1px rgba(0, 0, 0, 0.55)) brightness(1.02)",
          }}
        />
        <Stack gap={0}>
          <Group>
            <Text
              span
              c="white"
              size="lg"
              ff="heading"
              style={{ textShadow: "0 1px 1px rgba(0, 0, 0, 0.62)" }}
            >
              {userName}
            </Text>
            <StatusIndicator passed={passed} active={active} />
          </Group>
          <Group gap={8}>
            <Text
              size="sm"
              span
              ml={4}
              opacity={0.9}
              c="white"
              ff="text"
              style={{ textShadow: "0 1px 1px rgba(0, 0, 0, 0.62)" }}
            >
              {factionDisplayName}
            </Text>
            <PlayerColor color={color} size="xs" />
          </Group>
        </Stack>
        <Box visibleFrom="sm" ml="xs">
          {showNeighbors && <Neighbors neighbors={neighbors} />}
        </Box>
      </Group>

      <Group gap="xs" align="center">
        {isSpeaker && <SpeakerToken isVisible />}
        {isTyrant && <TyrantToken isVisible />}
        <StrategyCards scs={scs} exhaustedSCs={exhaustedSCs} />
      </Group>
    </Group>
  );
}

export function PlayerCardHeaderMobile({
  userName,
  faction,
  factionDisplayName,
  color,
  factionImageUrl,
  isSpeaker = false,
  isTyrant = false,
  scs = [],
  exhaustedSCs = [],
  passed = false,
  active = false,
  neighbors = [],
  showNeighbors = true,
  breakthrough,
  rightSection,
}: PlayerCardHeaderProps & {
  neighbors?: string[];
  showNeighbors?: boolean;
  breakthrough?: BreakthroughData;
  rightSection?: ReactNode;
}) {
  return (
    <Group
      gap="xs"
      px={4}
      align="center"
      wrap="nowrap"
      style={{ width: "100%", minWidth: 0 }}
    >
      <Group
        gap={4}
        align="center"
        wrap="nowrap"
        style={{
          width: MOBILE_IDENTITY_WIDTH,
          minWidth: MOBILE_IDENTITY_WIDTH,
          maxWidth: MOBILE_IDENTITY_WIDTH,
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        <Image
          {...lowPriorityImageProps}
          src={factionImageUrl}
          alt={faction}
          w={24}
          h={24}
          style={{ flexShrink: 0 }}
        />
        <Text
          span
          c="white"
          size="sm"
          ff="heading"
          style={{
            textOverflow: "ellipsis",
            overflow: "hidden",
            whiteSpace: "nowrap",
            minWidth: 0,
            flex: "0 1 auto",
          }}
        >
          {userName}
        </Text>
        <Text
          size="xs"
          span
          opacity={0.9}
          c="white"
          ff="heading"
          style={{
            textOverflow: "ellipsis",
            overflow: "hidden",
            whiteSpace: "nowrap",
            minWidth: "max-content",
            flex: "0 0 auto",
          }}
        >
          [{factionDisplayName}]
        </Text>
        <PlayerColor color={color} size="xs" />
        <StatusIndicator passed={passed} active={active} />
      </Group>

      <Box
        style={{
          width: MOBILE_BREAKTHROUGH_WIDTH,
          minWidth: MOBILE_BREAKTHROUGH_WIDTH,
          maxWidth: MOBILE_BREAKTHROUGH_WIDTH,
          flexShrink: 0,
          overflow: "visible",
        }}
      >
        {breakthrough?.breakthroughId && (
          <Breakthrough
            breakthroughId={breakthrough.breakthroughId}
            exhausted={breakthrough.exhausted}
            tradeGoodsStored={breakthrough.tradeGoodsStored}
            unlocked={breakthrough.unlocked ?? false}
            strong={false}
            chipClassName={breakthroughStyles.headerChip}
          />
        )}
      </Box>

      {showNeighbors && neighbors.length > 0 && (
        <Neighbors neighbors={neighbors} />
      )}

      {rightSection}

      <Group
        gap="xs"
        align="center"
        wrap="nowrap"
        ml="auto"
        style={{ flexShrink: 0 }}
      >
        {isSpeaker && <SpeakerToken isVisible />}
        {isTyrant && <TyrantToken isVisible />}
        <StrategyCards scs={scs} exhaustedSCs={exhaustedSCs} />
      </Group>
    </Group>
  );
}
