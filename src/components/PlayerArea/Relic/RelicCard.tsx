import { Box, Text, Stack, Image, Group, Divider } from "@mantine/core";
import { relics } from "../../../data/relics";

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
    <Box
      w={320}
      p="md"
      bg="linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)"
      style={{
        border: "1px solid rgba(255, 193, 7, 0.4)",
        borderRadius: "12px",
        backdropFilter: "blur(8px)",
      }}
    >
      <Stack gap="md">
        {/* Header with relic icon and name */}
        <Group gap="md" align="flex-start">
          <Box
            w={80}
            h={80}
            style={{
              borderRadius: "50%",
              background:
                "linear-gradient(135deg, rgba(255, 193, 7, 0.2) 0%, rgba(255, 143, 0, 0.15) 100%)",
              border: "2px solid rgba(255, 193, 7, 0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              src="/relicicon.webp"
              w={40}
              h={40}
              style={{
                filter:
                  "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.6)) brightness(1.1) sepia(0.3) saturate(1.2) hue-rotate(25deg)",
              }}
            />
          </Box>
          <Stack gap={4} flex={1}>
            <Text
              size="lg"
              fw={700}
              c="white"
              style={{
                textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
              }}
            >
              {relicData.name}
            </Text>
            <Text
              size="xs"
              c="yellow.3"
              fw={600}
              tt="uppercase"
              style={{
                textShadow: "0 1px 2px rgba(0, 0, 0, 0.6)",
              }}
            >
              Relic
            </Text>
          </Stack>
        </Group>

        <Divider c="yellow.7" opacity={0.4} />

        {/* Description */}
        <Box>
          <Text
            size="sm"
            fw={600}
            c="yellow.3"
            mb={4}
            style={{
              textShadow: "0 1px 2px rgba(0, 0, 0, 0.6)",
            }}
          >
            Effect
          </Text>
          <Text
            size="sm"
            c="gray.2"
            lh={1.4}
            style={{
              textShadow: "0 1px 2px rgba(0, 0, 0, 0.6)",
              whiteSpace: "pre-line",
            }}
          >
            {relicData.text?.replace(/\n/g, "\n\n") ||
              "No description available."}
          </Text>
        </Box>

        <Divider c="yellow.7" opacity={0.4} />

        {/* Flavor text */}
        <Box>
          <Text
            size="sm"
            c="orange.3"
            fs="italic"
            lh={1.5}
            style={{
              textShadow: "0 1px 2px rgba(0, 0, 0, 0.6)",
            }}
          >
            {relicData.flavourText}
          </Text>
        </Box>
      </Stack>
    </Box>
  );
}
