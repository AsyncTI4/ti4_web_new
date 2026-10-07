import { Divider, Stack, Text } from "@mantine/core";
import { DetailsCard } from "@/shared/ui/DetailsCard";
import { getStrategyCardByInitiative } from "@/entities/lookup/strategyCards";
import { useGameData } from "@/hooks/useGameContext";

type Props = {
  initiative: number;
  color?:
    | "red"
    | "orange"
    | "yellow"
    | "green"
    | "teal"
    | "cyan"
    | "blue"
    | "purple";
};

function AbilityLines({ lines, emptyText }: { lines: string[]; emptyText: string }) {
  if (lines.length === 0) {
    return (
      <Text size="sm" c="gray.5" fs="italic">
        {emptyText}
      </Text>
    );
  }

  return (
    <Stack gap={6}>
      {lines.map((line, idx) => (
        <Text key={idx} size="sm" c="gray.2" lh={1.4}>
          {line}
        </Text>
      ))}
    </Stack>
  );
}

export function StrategyCardDetailsCard({ initiative, color }: Props) {
  const gameData = useGameData();
  const sc = getStrategyCardByInitiative(
    initiative,
    gameData?.strategyCardIdMap
  );
  if (!sc) return null;

  return (
    <DetailsCard
      width={320}
      color={color === "teal" ? "cyan" : (color ?? "none")}
    >
      <Stack gap="md">
        <DetailsCard.Title
          title={sc.name}
          subtitle="Strategy Card"
          caption={`Initiative ${sc.initiative}`}
          captionColor="blue"
        />

        <Divider c="gray.7" opacity={0.8} />

        <DetailsCard.Section
          title="Primary"
          content={
            <AbilityLines
              lines={sc.primaryTexts}
              emptyText="No primary ability"
            />
          }
        />

        <Divider c="gray.7" opacity={0.8} />

        <DetailsCard.Section
          title="Secondary"
          content={
            <AbilityLines
              lines={sc.secondaryTexts}
              emptyText="No secondary ability"
            />
          }
        />
      </Stack>
    </DetailsCard>
  );
}
