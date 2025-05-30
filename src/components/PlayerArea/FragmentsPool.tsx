import { Box, Stack, Text, Group } from "@mantine/core";
import { FragmentStack } from "./FragmentStack";
import { Surface } from "./Surface";

type Props = {
  fragments: string[];
};

export function FragmentsPool({ fragments }: Props) {
  // Count fragments by type
  const fragmentCounts = {
    cultural: fragments.filter((f: string) => f.startsWith("crf")).length,
    hazardous: fragments.filter((f: string) => f.startsWith("hrf")).length,
    industrial: fragments.filter((f: string) => f.startsWith("irf")).length,
    unknown: fragments.filter((f: string) => f.startsWith("urf")).length,
  };

  return (
    <Box flex={1}>
      <Stack gap={4} align="center" h="100%" flex={1}>
        <Text
          ff="heading"
          size="xs"
          fw={600}
          c="gray.4"
          style={{
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            fontSize: "9px",
            opacity: 0.8,
            textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
          }}
        >
          Frags
        </Text>
        <Surface
          p="sm"
          pattern="grid"
          style={{
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            display: "flex",
            height: "100%",
            width: "100%",
          }}
        >
          <Group gap="xs" justify="center" w="100%">
            {fragmentCounts.cultural > 0 ||
            fragmentCounts.hazardous > 0 ||
            fragmentCounts.industrial > 0 ? (
              <>
                <FragmentStack count={fragmentCounts.cultural} type="crf" />
                <FragmentStack count={fragmentCounts.hazardous} type="hrf" />
                <FragmentStack count={fragmentCounts.industrial} type="irf" />
                <FragmentStack count={fragmentCounts.unknown} type="urf" />
              </>
            ) : (
              <Text
                size="xs"
                c="gray.6"
                style={{
                  textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
                  opacity: 0.5,
                }}
              >
                No fragments
              </Text>
            )}
          </Group>
        </Surface>
      </Stack>
    </Box>
  );
}
