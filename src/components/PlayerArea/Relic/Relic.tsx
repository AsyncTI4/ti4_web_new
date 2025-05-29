import { Box, Text, Image, Tooltip } from "@mantine/core";
import { relics } from "../../../data/relics";
import { SPECIAL_GRADIENTS } from "../gradients";

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

export function Relic({ relicId }: Props) {
  // Look up relic data
  const relicData = relics.find((relic: RelicData) => relic.alias === relicId);

  if (!relicData) {
    console.warn(`Relic with ID "${relicId}" not found`);
    return null;
  }

  const relicConfig = SPECIAL_GRADIENTS.relic;

  return (
    <Tooltip label={relicData.text}>
      <Box
        py={4}
        px={6}
        style={{
          borderRadius: "6px",
          background: relicConfig.background,
          border: `1px solid ${relicConfig.border}`,
          position: "relative",
          overflow: "hidden",
          minWidth: 0,
        }}
      >
        {/* Diagonal stripe pattern */}
        <Box
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: relicConfig.pattern,
            pointerEvents: "none",
            opacity: 0.5,
          }}
        />

        {/* Stronger inner glow */}
        <Box
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: relicConfig.innerGlow,
            pointerEvents: "none",
          }}
        />

        <Box
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            height: "100%",
            position: "relative",
            zIndex: 1,
            minWidth: 0,
            overflow: "hidden",
          }}
        >
          <Image
            src="/relicicon.webp"
            style={{
              width: "16px",
              height: "16px",
              filter: relicConfig.iconFilter,
              flexShrink: 0,
            }}
          />
          <Text
            size="sm"
            fw={700}
            c="white"
            style={{
              fontFamily: "SLIDER, monospace",
              textShadow: "0 2px 2px rgba(0, 0, 0, 0.8)",
              minWidth: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              flex: 1,
            }}
          >
            {relicData.shortName || relicData.name}
          </Text>
        </Box>
      </Box>
    </Tooltip>
  );
}
