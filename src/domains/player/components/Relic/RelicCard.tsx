import { Stack, Text, Image, Divider } from "@mantine/core";
import { getRelicData } from "@/entities/lookup/relics";
import { DetailsCard } from "@/shared/ui/DetailsCard";
import { cdnImage } from "@/entities/data/cdnImage";

type Props = {
  relicId: string;
};

export function RelicCard({ relicId }: Props) {
  const relicData = getRelicData(relicId);

  if (!relicData) {
    console.warn(`Relic with ID "${relicId}" not found`);
    return null;
  }

  const isFake = relicData.isFakeRelic ?? false;
  const cardColor = isFake ? "gray" : "orange";
  const iconSrc = isFake ? cdnImage("/tokens/token_frontier.webp") : "/relicicon.webp";
  const renderRelicIcon = () => <Image src={iconSrc} w={50} h={50} />;

  return (
    <DetailsCard width={320} color={cardColor}>
      <Stack gap="md">
        <DetailsCard.Title
          title={relicData.name}
          subtitle={isFake ? "Frontier Explore" : "Relic"}
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
        <Text size="sm" c={isFake ? "gray.3" : "orange.3"} fs="italic" lh={1.5}>
          {relicData.flavourText}
        </Text>
      </Stack>
    </DetailsCard>
  );
}
