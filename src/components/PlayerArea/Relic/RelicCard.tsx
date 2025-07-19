import { Stack, Text, Image, Divider } from "@mantine/core";
import { getRelicData } from "../../../lookup/relics";
import { DetailsCard } from "@/components/shared/DetailsCard";

type Props = {
  relicId: string;
};

export function RelicCard({ relicId }: Props) {
  const relicData = getRelicData(relicId);

  if (!relicData) {
    console.warn(`Relic with ID "${relicId}" not found`);
    return null;
  }

  const renderRelicIcon = () => <Image src="/relicicon.webp" w={50} h={50} />;

  return (
    <DetailsCard width={320} color="orange">
      <Stack gap="md">
        <DetailsCard.Title
          title={relicData.name}
          subtitle="Relic"
          icon={<DetailsCard.Icon icon={renderRelicIcon()} />}
        />

        <Divider c="gray.7" opacity={0.8} />

        <DetailsCard.Section
          title="Effect"
          content={
            relicData.text?.replace(/\n/g, "\n\n") ||
            "No description available."
          }
        />

        <Divider c="gray.7" opacity={0.8} />

        {/* Bespoke flavor text */}
        <Text size="sm" c="orange.3" fs="italic" lh={1.5}>
          {relicData.flavourText}
        </Text>
      </Stack>
    </DetailsCard>
  );
}
