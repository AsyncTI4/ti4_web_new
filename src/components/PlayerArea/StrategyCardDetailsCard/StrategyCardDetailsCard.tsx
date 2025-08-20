import { Divider, Stack, Text } from "@mantine/core";
import { DetailsCard } from "@/components/shared/DetailsCard";
import { getStrategyCardByInitiative } from "@/lookup/strategyCards";

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
  const sc = getStrategyCardByInitiative(initiative);
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
            <Stack gap={6}>
              {sc.primaryTexts.map((line, idx) => (
                <Text key={idx} size="sm" c="gray.2" lh={1.4}>
                  {line}
                </Text>
              ))}
            </Stack>
          }
        />

        <Divider c="gray.7" opacity={0.8} />

        <DetailsCard.Section
          title="Secondary"
          content={
            <Stack gap={6}>
              {sc.secondaryTexts.map((line, idx) => (
                <Text key={idx} size="sm" c="gray.2" lh={1.4}>
                  {line}
                </Text>
              ))}
            </Stack>
          }
        />
      </Stack>
    </DetailsCard>
  );
}
