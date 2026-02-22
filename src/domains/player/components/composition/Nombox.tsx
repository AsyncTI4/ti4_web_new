import { Box, Image, Group, Text } from "@mantine/core";
import { Surface } from "@/domains/player/components/Surface";
import { cdnImage } from "@/entities/data/cdnImage";
import { units } from "@/entities/data/units";
import { CapturedUnitsData } from "@/entities/data/types";
import styles from "./Nombox.module.css";
import { getColorAlias } from "@/entities/lookup/colors";
import { useFactionColors } from "@/hooks/useFactionColors";
import { Unit } from "@/shared/ui/Unit";

type Props = {
  capturedUnits: CapturedUnitsData;
  compact?: boolean;
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

export function Nombox({ capturedUnits, compact = false }: Props) {
  const factionColorMap = useFactionColors();
  // Early return if no captured units
  if (!capturedUnits || Object.keys(capturedUnits).length === 0) {
    return null;
  }

  if (compact) {
    return (
      <Surface
        className={styles.compactNombox}
        p="xs"
        label="CAPTURED"
        labelColor="red.3"
      >
        <Box className={styles.compactGrid}>
          {Object.entries(capturedUnits).map(([factionName, unitStrings]) => {
            const playerColor = factionColorMap?.[factionName]?.color;
            const colorAlias = getColorAlias(playerColor);
            return (
              <Box key={factionName} className={styles.compactFaction}>
                <Box className={styles.compactFactionHeader}>
                  <Image
                    src={cdnImage(`/factions/${factionName.toLowerCase()}.png`)}
                    className={styles.compactFactionIcon}
                  />
                  <Text className={styles.compactFactionName}>
                    {factionName}
                  </Text>
                </Box>
                <Box className={styles.compactUnitsRow}>
                  {unitStrings.map((unitString, index) => {
                    const { count, asyncId } = parseUnitString(unitString);
                    return (
                      <Box
                        key={index}
                        className={styles.compactUnitGroup}
                      >
                        <Box className={styles.compactUnitContainer}>
                          <Unit
                            unitType={asyncId}
                            colorAlias={colorAlias}
                            faction={factionName}
                            className={styles.compactUnitImage}
                          />
                        </Box>
                        <Text className={styles.compactCountBadge}>
                          ×{count}
                        </Text>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Surface>
    );
  }

  return (
    <Surface
      className={styles.nombox}
      p="md"
      label="CAPTURED"
      labelColor="red.3"
    >
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
  );
}
