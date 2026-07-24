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
import styles from "./PlayerCardHeaderCompact.module.css";

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

function PlayerIdentity({
  userName,
  factionDisplayName,
  color,
}: Pick<PlayerCardHeaderProps, "userName" | "factionDisplayName" | "color">) {
  return (
    <>
      <Text span size="sm" className={styles.playerName} flex="0 1 auto">
        {userName}
      </Text>
      <Text span className={styles.factionName} flex="0 0 auto">
        {factionDisplayName}
      </Text>
      <PlayerColor color={color} size="xs" />
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
      <Group gap={6} wrap="nowrap" className={styles.identityGroup}>
        <Image
          {...lowPriorityImageProps}
          src={factionImageUrl}
          alt={faction}
          w={24}
          h={24}
          className={styles.factionIcon}
        />
        <PlayerIdentity
          userName={userName}
          factionDisplayName={factionDisplayName}
          color={color}
        />
        <StatusIndicator passed={passed} active={active} />
      </Group>

      <Group gap={8} className={styles.rightGroup}>
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
          className={styles.factionIcon}
        />
        <Stack gap={0}>
          <Group gap={8} wrap="nowrap">
            <Text span size="lg" className={styles.playerName}>
              {userName}
            </Text>
            <StatusIndicator passed={passed} active={active} />
          </Group>
          <Group gap={8} wrap="nowrap">
            <Text span className={styles.factionName}>
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
        gap={6}
        align="center"
        wrap="nowrap"
        w={MOBILE_IDENTITY_WIDTH}
        miw={MOBILE_IDENTITY_WIDTH}
        maw={MOBILE_IDENTITY_WIDTH}
        style={{ overflow: "hidden", flexShrink: 0 }}
      >
        <Image
          {...lowPriorityImageProps}
          src={factionImageUrl}
          alt={faction}
          w={24}
          h={24}
          className={styles.factionIcon}
        />
        <PlayerIdentity
          userName={userName}
          factionDisplayName={factionDisplayName}
          color={color}
        />
        <StatusIndicator passed={passed} active={active} />
      </Group>

      <Box
        w={MOBILE_BREAKTHROUGH_WIDTH}
        miw={MOBILE_BREAKTHROUGH_WIDTH}
        maw={MOBILE_BREAKTHROUGH_WIDTH}
        style={{ flexShrink: 0, overflow: "visible" }}
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

      <Box className={styles.headerRule} />

      <Group
        gap="xs"
        align="center"
        wrap="nowrap"
        className={styles.rightGroup}
      >
        {isSpeaker && <SpeakerToken isVisible />}
        {isTyrant && <TyrantToken isVisible />}
        <StrategyCards scs={scs} exhaustedSCs={exhaustedSCs} />
      </Group>
    </Group>
  );
}
