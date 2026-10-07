import { Stack, Text, Image, Divider } from "@mantine/core";
import { getRelicData } from "@/entities/lookup/relics";
import { DetailsCard } from "@/shared/ui/DetailsCard";
import { cdnImage } from "@/entities/data/cdnImage";

type Props = {
  relicId: string;
};

export function RelicCard({ relicId }: Props) {
  const relicData = getRelicData(relicId);

  if (!relicData) return null;

  const isFake = relicData.isFakeRelic ?? false;
  const cardColor = isFake ? "none" : "orange";
  const iconSrc = isFake ? cdnImage("/tokens/token_frontier.webp") : "/relicicon.webp";

  return (
    <DetailsCard width={320} color={cardColor}>
      <Stack gap="md">
        <DetailsCard.Title
          title={relicData.name}
          subtitle={isFake ? "Frontier Explore" : "Relic"}
          icon={<DetailsCard.Icon icon={<Image src={iconSrc} w={50} h={50} />} />}
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

        <Text size="sm" c={isFake ? "gray.3" : "orange.3"} fs="italic" lh={1.5}>
          {relicData.flavourText}
        </Text>
      </Stack>
    </DetailsCard>
  );
}
