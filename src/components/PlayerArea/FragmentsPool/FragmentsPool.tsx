import { Box, Stack, Text, Group } from "@mantine/core";
import { FragmentStack } from "../FragmentStack";
import { Surface } from "../Surface";

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
        <Box
          p="sm"
          pattern="grid"
          style={{
            display: "flex",
            height: "100%",
            width: "100%",
            borderBottom: "1px dashed rgba(255, 255, 255, 0.2)"
          }}
        >
          <Group gap="xs" justify="center" w="100%">
            {fragmentCounts.cultural > 0 ||
            fragmentCounts.hazardous > 0 ||
            fragmentCounts.industrial > 0 ||
            fragmentCounts.unknown > 0 ? (
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
                  fontStyle: "italic"
                }}
              >
                No Fragments
              </Text>
            )}
          </Group>
        </Box>
      </Stack>
    </Box>
  );
}
