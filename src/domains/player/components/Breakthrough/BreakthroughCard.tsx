import { Stack, Divider, Text } from "@mantine/core";
import { DetailsCard } from "@/shared/ui/DetailsCard";
import { getBreakthroughData } from "@/entities/lookup/breakthroughs";

type Props = {
  breakthroughId: string;
};

export function BreakthroughCard({ breakthroughId }: Props) {
  const data = getBreakthroughData(breakthroughId);
  if (!data) return null;

  const subtitle = "Breakthrough";

  return (
    <DetailsCard width={320}>
      <Stack gap="md">
        <DetailsCard.Title title={data.name} subtitle={subtitle} />
        <Divider c="gray.7" opacity={0.8} />
        <DetailsCard.Section
          title="Effect"
          content={data.text?.replace(/\n/g, "\n\n") || "No description available."}
        />
        {data.synergy?.length ? (
          <>
            <Divider c="gray.7" opacity={0.8} />
            <Text size="sm" c="gray.3" lh={1.5}>
              Synergy: {data.synergy.join(" + ")}
            </Text>
          </>
        ) : null}
      </Stack>
    </DetailsCard>
  );
}




