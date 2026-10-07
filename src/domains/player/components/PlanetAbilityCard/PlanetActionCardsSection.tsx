import { Box, Divider, Group, Image, Text } from "@mantine/core";
import { cdnImage } from "@/entities/data/cdnImage";
import { getActionCard } from "@/entities/lookup/actionCards";

type Props = {
  actionCards?: string[];
};

/** Action cards parked on a planet, grouped by alias with a count. */
export function PlanetActionCardsSection({ actionCards = [] }: Props) {
  if (actionCards.length === 0) return null;

  const counts = new Map<string, number>();
  for (const alias of actionCards) {
    counts.set(alias, (counts.get(alias) ?? 0) + 1);
  }

  return (
    <>
      <Divider c="gray.7" opacity={0.8} />
      <Box>
        <Text size="sm" c="gray.3" fw={500} mb={4}>
          Action Cards
        </Text>
        {[...counts].map(([alias, count]) => {
          const cardLabel = getActionCard(alias)?.name ?? alias;
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
  );
}
