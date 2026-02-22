import { Divider, Stack, Text } from "@mantine/core";
import { DetailsCard } from "@/shared/ui/DetailsCard";
import { getStrategyCardByInitiative } from "@/entities/lookup/strategyCards";
import { useGameData } from "@/hooks/useGameContext";

type DetailsColor =
  | "none"
  | "yellow"
  | "purple"
  | "red"
  | "orange"
  | "cyan"
  | "blue"
  | "green";

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

function mapDetailsCardColor(color?: Props["color"]): DetailsColor {
  if (!color) return "none";
  if (color === "teal") return "cyan";
  if (
    ["yellow", "purple", "red", "orange", "cyan", "blue", "green"].includes(
      color
    )
  )
    return color as DetailsColor;
  return "none";
}

export function StrategyCardDetailsCard({ initiative, color }: Props) {
  const gameData = useGameData();
  const sc = getStrategyCardByInitiative(
    initiative,
    gameData?.strategyCardIdMap
  );
  if (!sc) return null;

  const detailsCardColor = mapDetailsCardColor(color);

  return (
    <DetailsCard width={320} color={detailsCardColor}>
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
            sc.primaryTexts.length > 0 ? (
              <Stack gap={6}>
                {sc.primaryTexts.map((line, idx) => (
                  <Text key={idx} size="sm" c="gray.2" lh={1.4}>
                    {line}
                  </Text>
                ))}
              </Stack>
            ) : (
              <Text size="sm" c="gray.5" fs="italic">
                No primary ability
              </Text>
            )
          }
        />

        <Divider c="gray.7" opacity={0.8} />

        <DetailsCard.Section
          title="Secondary"
          content={
            sc.secondaryTexts.length > 0 ? (
              <Stack gap={6}>
                {sc.secondaryTexts.map((line, idx) => (
                  <Text key={idx} size="sm" c="gray.2" lh={1.4}>
                    {line}
                  </Text>
                ))}
              </Stack>
            ) : (
              <Text size="sm" c="gray.5" fs="italic">
                No secondary ability
              </Text>
            )
          }
        />
      </Stack>
    </DetailsCard>
  );
}
