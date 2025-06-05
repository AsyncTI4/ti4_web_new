import { Box, Image, Group, Text } from "@mantine/core";
import { Surface } from "./PlayerArea/Surface";
import { cdnImage } from "../data/cdnImage";
import { units } from "../data/units";
import { colors } from "../data/colors";
import styles from "./Nombox.module.css";

type CapturedUnitsData = {
  [factionColor: string]: string[];
};

type Props = {
  capturedUnits?: CapturedUnitsData;
  colorToFaction: Record<string, string>;
};

// Helper function to get color alias for unit images
const getColorAlias = (color?: string) => {
  if (!color) return "pnk"; // default fallback

  const colorData = colors.find(
    (c) =>
      c.aliases.includes(color.toLowerCase()) ||
      c.name.toLowerCase() === color.toLowerCase()
  );
  return colorData?.alias || "pnk"; // fallback to pink if color not found
};

// Parse unit string like "dread,3" or "carrier,4"
const parseUnitString = (unitString: string) => {
  const [unitType, countStr] = unitString.split(",");
  const count = parseInt(countStr, 10);

  // Find unit by baseType or name match
  const unit = units.find(
    (u) =>
      u.baseType === unitType ||
      u.name.toLowerCase().includes(unitType.toLowerCase())
  );

  return {
    unitType,
    count,
    asyncId: unit?.asyncId || unitType.substring(0, 2), // fallback to first 2 chars
  };
};

const HARDCODED_DATA: CapturedUnitsData = {
  keleres: ["dreadnought,3", "carrier,4"],
  xxcha: ["cruiser,2", "fighter,6"],
  sol: ["destroyer,1", "infantry,8"],
  jolnar: ["pds,2", "mech,1"],
};

export function Nombox({
  capturedUnits = HARDCODED_DATA,
  colorToFaction,
}: Props) {
  // Helper function to find player color for a given faction
  const getPlayerColorForFaction = (factionName: string): string => {
    // Find the color that maps to this faction
    const colorEntry = Object.entries(colorToFaction).find(
      ([, faction]) => faction.toLowerCase() === factionName.toLowerCase()
    );
    return colorEntry ? colorEntry[0] : "pnk"; // fallback to pink if not found
  };

  return (
    <Surface
      className={styles.nombox}
      p="md"
      pattern="grid"
      cornerAccents={true}
      label="CAPTURED"
      labelColor="red.4"
      style={{
        // Red tint styling
        background:
          "linear-gradient(135deg, rgba(185, 28, 28, 0.15) 0%, rgba(153, 27, 27, 0.10) 50%, rgba(127, 29, 29, 0.12) 100%)",
        border: "1px solid rgba(239, 68, 68, 0.3)",
        boxShadow:
          "0 8px 32px rgba(239, 68, 68, 0.2), inset 0 1px 0 rgba(239, 68, 68, 0.1)",
      }}
    >
      {/* Red-tinted corner accents override */}
      <Box
        pos="absolute"
        top={8}
        left={8}
        w={20}
        h={20}
        className={styles.redCornerAccent}
        style={{
          borderRight: "none",
          borderBottom: "none",
          borderRadius: "4px 0 0 0",
        }}
      />
      <Box
        pos="absolute"
        top={8}
        right={8}
        w={20}
        h={20}
        className={styles.redCornerAccent}
        style={{
          borderLeft: "none",
          borderBottom: "none",
          borderRadius: "0 4px 0 0",
        }}
      />
      <Box
        pos="absolute"
        bottom={8}
        left={8}
        w={20}
        h={20}
        className={styles.redCornerAccent}
        style={{
          borderRight: "none",
          borderTop: "none",
          borderRadius: "0 0 0 4px",
        }}
      />
      <Box
        pos="absolute"
        bottom={8}
        right={8}
        w={20}
        h={20}
        className={styles.redCornerAccent}
        style={{
          borderLeft: "none",
          borderTop: "none",
          borderRadius: "0 0 4px 0",
        }}
      />

      {/* Red pattern overlay */}
      <Box className={styles.patternOverlay} />

      {/* Red glow effect */}
      <Box className={styles.redGlow} />

      <Group
        gap="lg"
        pos="relative"
        style={{
          zIndex: 1,
          flexWrap: "wrap",
          alignItems: "flex-start",
        }}
      >
        {Object.entries(capturedUnits).map(([factionName, unitStrings]) => {
          const playerColor = getPlayerColorForFaction(factionName);
          const colorAlias = getColorAlias(playerColor);

          return (
            <Box
              key={factionName}
              style={{
                minWidth: "200px",
                flex: "1 1 auto",
              }}
            >
              {/* Faction header */}
              <Group gap="xs" className={styles.factionHeader}>
                <Image
                  src={cdnImage(`/factions/${factionName.toLowerCase()}.png`)}
                  w={20}
                  h={20}
                  style={{
                    filter: "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.8))",
                  }}
                />
                <Text className={styles.factionName}>{factionName}</Text>
              </Group>

              {/* Units row */}
              <Group gap="xs" className={styles.unitsRow}>
                {unitStrings.map((unitString, index) => {
                  const { count, asyncId } = parseUnitString(unitString);

                  return (
                    <Group
                      key={index}
                      gap={0}
                      pos="relative"
                      className={styles.unitGroup}
                    >
                      {/* Render stacked units with 80% overlap */}
                      {Array.from({ length: count }).map((_, stackIndex) => (
                        <Box
                          key={stackIndex}
                          className={styles.stackedUnit}
                          style={{
                            zIndex: count - stackIndex, // Later units appear on top
                          }}
                        >
                          <Box className={styles.unitContainer}>
                            <Image
                              src={cdnImage(
                                `/units/${colorAlias}_${asyncId}.png`
                              )}
                              className={styles.unitImage}
                            />
                          </Box>
                        </Box>
                      ))}

                      {/* Unit count badge */}
                      <Text className={styles.countBadge}>×{count}</Text>
                    </Group>
                  );
                })}
              </Group>
            </Box>
          );
        })}
      </Group>
    </Surface>
  );
}
