import { Stack, Box, Text, Group, Divider, Image } from "@mantine/core";
import { cdnImage } from "@/data/cdnImage";
import { getPlanetData } from "@/lookup/planets";
import classes from "./PlanetAbilityDetailsCard.module.css";

type Props = {
  planetId: string;
  abilityName: string;
  abilityText: string;
};

export function PlanetAbilityDetailsCard({
  planetId,
  abilityName,
  abilityText,
}: Props) {
  const planetData = getPlanetData(planetId);

  if (!planetData) return null;

  return (
    <Box w={280} p="md" className={classes.card}>
      <Stack gap="sm">
        {/* Header with planet name and ability name */}
        <Box>
          <Text size="md" fw={700} c="white" className={classes.title}>
            {planetData.shortName ?? planetData.name}
          </Text>
          <Text size="sm" c="gray.3" fw={500} fs="italic">
            Planet Ability
          </Text>
        </Box>

        <Divider c="gray.7" opacity={0.8} />

        {/* Ability Section */}
        <Box>
          <Group gap="xs" mb={4}>
            <Image
              src={cdnImage("/planet_cards/pc_legendary_rdy.png")}
              w={16}
              h={16}
            />
            <Text size="sm" c="yellow.3" fw={500}>
              {abilityName}
            </Text>
          </Group>
          <Text size="sm" c="gray.1" lh={1.5}>
            {abilityText}
          </Text>
        </Box>
      </Stack>
    </Box>
  );
}
