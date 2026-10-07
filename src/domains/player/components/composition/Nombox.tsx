import { Box, Text } from "@mantine/core";
import { Surface } from "@/shared/ui/Surface";
import { units } from "@/entities/data/units";
import { CapturedUnitsData } from "@/entities/data/types";
import styles from "./Nombox.module.css";
import { getColorAlias } from "@/entities/lookup/colors";
import { useFactionColors } from "@/hooks/useFactionColors";
import { Unit } from "@/shared/ui/Unit";
import { FactionIcon } from "@/shared/ui/FactionIcon";

type Props = {
  capturedUnits?: CapturedUnitsData;
};

/** Parses a captured-unit entry like "dread,3" or "carrier,4". */
const parseUnitString = (unitString: string) => {
  const [unitType, countStr] = unitString.split(",");
  const count = parseInt(countStr, 10);
  const unit = units.find((u) => u.baseType === unitType);

  return {
    unitType,
    count,
    asyncId: unit?.asyncId || unitType.substring(0, 2),
  };
};

export function Nombox({ capturedUnits }: Props) {
  const factionColorMap = useFactionColors();

  if (!capturedUnits || Object.keys(capturedUnits).length === 0) {
    return null;
  }

  return (
    <Surface className={styles.compactNombox} p="xs">
      <Text className={styles.compactTitle}>CAPTURED</Text>
      <Box className={styles.compactGrid}>
        {Object.entries(capturedUnits).map(([factionName, unitStrings]) => {
          const colorAlias = getColorAlias(factionColorMap?.[factionName]?.color);
          return (
            <Box key={factionName} className={styles.compactFaction}>
              <Box className={styles.compactFactionHeader}>
                <FactionIcon
                  faction={factionName}
                  className={styles.compactFactionIcon}
                />
                <Text className={styles.compactFactionName}>{factionName}</Text>
              </Box>
              <Box className={styles.compactUnitsRow}>
                {unitStrings.map((unitString, index) => {
                  const { count, asyncId } = parseUnitString(unitString);
                  return (
                    <Box key={index} className={styles.compactUnitGroup}>
                      <Box className={styles.compactUnitContainer}>
                        <Unit
                          unitType={asyncId}
                          colorAlias={colorAlias}
                          faction={factionName}
                          className={styles.compactUnitImage}
                          scaleSprite
                        />
                      </Box>
                      <Text className={styles.compactCountBadge}>×{count}</Text>
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
