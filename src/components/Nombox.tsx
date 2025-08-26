import { Box, Image, Group, Text } from "@mantine/core";
import { Surface } from "./PlayerArea/Surface";
import { cdnImage } from "../data/cdnImage";
import { units } from "../data/units";
import { CapturedUnitsData } from "../data/types";
import styles from "./Nombox.module.css";
import { getColorAlias } from "@/lookup/colors";
import { useFactionColors } from "@/hooks/useFactionColors";
import { Unit } from "./shared/Unit";

type Props = {
  capturedUnits: CapturedUnitsData;
};

// Parse unit string like "dread,3" or "carrier,4"
const parseUnitString = (unitString: string) => {
  const [unitType, countStr] = unitString.split(",");
  const count = parseInt(countStr, 10);

  // Find unit by baseType or name match
  const unit = units.find((u) => u.baseType === unitType);

  return {
    unitType,
    count,
    asyncId: unit?.asyncId || unitType.substring(0, 2), // fallback to first 2 chars
  };
};

export function Nombox({ capturedUnits }: Props) {
  const factionColorMap = useFactionColors();
  // Early return if no captured units
  if (!capturedUnits || Object.keys(capturedUnits).length === 0) {
    return null;
  }

  return (
    <Box>
      <Surface
        className={styles.nombox}
        p="md"
        pattern="grid"
        label="CAPTURED"
        labelColor="red.3"
        style={{
          background:
            "linear-gradient(135deg, rgba(239, 68, 68, 0.02) 0%, rgba(239, 68, 68, 0.015) 50%, rgba(239, 68, 68, 0.01) 100%)",
          border: "1px solid rgba(239, 68, 68, 0.18)",
        }}
      >
        <Box className={styles.patternOverlay} />
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
            const playerColor = factionColorMap?.[factionName]?.color;
            const colorAlias = getColorAlias(playerColor);
            return (
              <Box key={factionName}>
                <Group gap={2} className={styles.factionHeader}>
                  <Image
                    src={cdnImage(`/factions/${factionName.toLowerCase()}.png`)}
                    w={20}
                    h={20}
                  />
                  <Text className={styles.factionName}>{factionName}</Text>
                </Group>
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
                        <Box className={styles.unitContainer}>
                          <Unit
                            unitType={asyncId}
                            colorAlias={colorAlias}
                            faction={factionName}
                            className={styles.unitImage}
                          />
                        </Box>
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
    </Box>
  );
}
