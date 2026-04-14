import { Box, Text, Group, Divider, Image } from "@mantine/core";
import { cdnImage } from "@/entities/data/cdnImage";
import { getActionCard } from "@/entities/lookup/actionCards";
import { getPlanetData } from "@/entities/lookup/planets";
import { DetailsCard } from "@/shared/ui/DetailsCard";
import classes from "./PlanetAbilityDetailsCard.module.css";

type Props = {
  planetId: string;
  abilityName: string;
  abilityText: string;
  actionCards?: string[];
};

export function PlanetAbilityDetailsCard({
  planetId,
  abilityName,
  abilityText,
  actionCards = [],
}: Props) {
  const planetData = getPlanetData(planetId);

  if (!planetData) return null;

  const actionCardCounts = Object.entries(
    actionCards.reduce<Record<string, number>>((acc, alias) => {
      acc[alias] = (acc[alias] ?? 0) + 1;
      return acc;
    }, {}),
  );

  return (
    <DetailsCard width={320}>
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

      {actionCardCounts.length > 0 && (
        <>
          <Divider c="gray.7" opacity={0.8} />
          <Box>
            <Text size="sm" c="gray.3" fw={500} mb={4}>
              Action Cards
            </Text>
            {actionCardCounts.map(([alias, count]) => {
              const card = getActionCard(alias);
              const cardLabel = card?.name ?? alias;
              return (
                <Group key={alias} gap="xs" align="center">
                  <Image
                    src={cdnImage("/player_area/cardback_action.jpg")}
                    alt={`Action card ${cardLabel}`}
                    w={18}
                    h={12}
                  />
                  <Text size="sm" c="gray.1" lh={1.5}>
                    {cardLabel}
                    {count > 1 ? ` x${count}` : ""}
                  </Text>
                </Group>
              );
            })}
          </Box>
        </>
      )}
    </DetailsCard>
  );
}
