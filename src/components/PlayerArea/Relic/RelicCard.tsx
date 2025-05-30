import { Box, Text, Stack, Image, Group, Divider } from "@mantine/core";
import { relics } from "../../../data/relics";
import styles from "./RelicCard.module.css";

type RelicData = {
  alias: string;
  name: string;
  text: string;
  imageURL: string;
  source: string;
  flavourText: string;
  shortName?: string;
  shrinkName?: boolean;
};

type Props = {
  relicId: string;
};

export function RelicCard({ relicId }: Props) {
  // Look up relic data
  const relicData = relics.find((relic: RelicData) => relic.alias === relicId);

  if (!relicData) {
    console.warn(`Relic with ID "${relicId}" not found`);
    return null;
  }

  return (
    <Box w={320} p="md" className={styles.container}>
      <Stack gap="md">
        {/* Header with relic icon and name */}
        <Group gap="md" align="flex-start">
          <Box w={80} h={80} className={styles.iconContainer}>
            <Image
              src="/relicicon.webp"
              w={40}
              h={40}
              className={styles.relicIcon}
            />
          </Box>
          <Stack gap={4} flex={1}>
            <Text size="lg" fw={700} c="white">
              {relicData.name}
            </Text>
            <Text size="xs" c="yellow.3" fw={600} tt="uppercase">
              Relic
            </Text>
          </Stack>
        </Group>

        <Divider c="yellow.7" opacity={0.4} />

        {/* Description */}
        <Box>
          <Text size="sm" fw={600} c="yellow.3" mb={4}>
            Effect
          </Text>
          <Text
            size="sm"
            c="gray.2"
            lh={1.4}
            className={styles.descriptionText}
          >
            {relicData.text?.replace(/\n/g, "\n\n") ||
              "No description available."}
          </Text>
        </Box>

        <Divider c="yellow.7" opacity={0.4} />

        {/* Flavor text */}
        <Box>
          <Text size="sm" c="orange.3" fs="italic" lh={1.5}>
            {relicData.flavourText}
          </Text>
        </Box>
      </Stack>
    </Box>
  );
}
