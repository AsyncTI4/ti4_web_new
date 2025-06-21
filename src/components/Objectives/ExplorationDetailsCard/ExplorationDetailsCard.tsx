import { Box, Text, Stack, Group, Divider, Image } from "@mantine/core";
import { getExploration } from "@/lookup/exploration";
import { cdnImage } from "@/data/cdnImage";

type Props = {
  type: string;
  deck: string[];
  discard: string[];
};

export function ExplorationDetailsCard({ type, deck, discard }: Props) {
  // Look up exploration data
  const explorationDeckData = mapToExplorationData(deck);
  const explorationDiscardData = mapToExplorationData(discard);

  function mapToExplorationData(explorationIds: string[]): Map<string, string[]> {
    let explorationCards = new Map<string, string[]>();
    explorationIds.forEach(explorationId => {
      const exploration = getExploration(explorationId);
      if(!exploration) {
        console.warn(`Exploration with ID "${explorationId}" not found`);
      } else {
        explorationCards.set(exploration.name, explorationCards.get(exploration.name)?.concat(exploration.alias) ?? [exploration.alias]);
      }
    });

    return explorationCards;
  }

  return (
    <Box
      pos="relative"
      w={380}
      miw={380}
      // mih={220}
      p="md"
      bg="linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)"
      style={{
        border: "1px solid rgba(148, 163, 184, 0.3)",
        borderRadius: "12px",
        backdropFilter: "blur(8px)",
        overflow: "hidden",
      }}
    >
      <Stack gap="md" h="100%">
        {/* Header */}
        <Group gap="md" align="flex-start">
          <Box
            w={60}
            h={60}
            style={{
              borderRadius: "50%",
              background: "linear-gradient(135deg, rgba(148, 163, 184, 0.2) 0%, rgba(107, 114, 128, 0.15) 100%)",
              border: "2px solid rgba(148, 163, 184, 0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              src={cdnImage(`/general/${type}.png`)}
              w={35}
              h={35}
              style={{
                objectFit: "contain",
                filter: "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.6))",
              }}
            />
          </Box>
          <Text
              size="lg"
              fw={700}
              c="white"
              style={{
                textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
              }}
            >
              {`${type} Exploration`}
        </Text>
        </Group>

        {/* Exploration Deck Section */}
        {explorationDeckData.size > 0 && (
          <>
          <Divider c={"gray.7"} opacity={0.4} />
            <Stack>
              <Text
                size="med"
                fw={700}
                c="white"
                style={{
                  textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
                }}
              >
              {`Exploration Deck - (${deck.length})`}
              </Text>
              {[...explorationDeckData.entries()].map(([name, explorationAliases]) => (
              <Text
                key={name}
                size="sm"
                fw={700}
                c="white"
                style={{
                  textShadow: "0 1px 1px rgba(0, 0, 0, 0.8)",
                }}
              >
                {`${name}: (${explorationAliases}) - ${(explorationAliases.length/deck.length * 100)}%`}
              </Text>
              ))}
            </Stack>
          </>)
        }

        {/* Exploration Discard Section */}
        {explorationDiscardData.size > 0 && (
          <>
          <Divider c={"gray.7"} opacity={0.4} />
              <Stack>
                <Text
                  size="med"
                  fw={700}
                  c="white"
                  style={{
                    textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
                  }}
                >
                {`Exploration Discard - (${deck.length})`}
                </Text>
                  {[...explorationDiscardData.entries()].map(([name, explorationAliases]) => (
                      <Text
                        key={name}
                        size="sm"
                        fw={700}
                        c="white"
                        style={{
                          textShadow: "0 1px 1px rgba(0, 0, 0, 0.8)",
                        }}
                      >
                        {`${name}: (${explorationAliases})`}
                </Text>
                ))}
              </Stack>
          </>)
        }
      </Stack>
    </Box>
  );
}
