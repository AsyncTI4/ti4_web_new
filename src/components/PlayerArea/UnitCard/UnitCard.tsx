import { Stack, Box, Image, Group, Text, Flex } from "@mantine/core";
import { useState } from "react";
import { units } from "../../../data/units";
import { colors } from "../../../data/colors";
import styles from "./UnitCard.module.css";
import { cdnImage } from "../../../data/cdnImage";
import { UnitDetailsCard } from "../UnitDetailsCard";
import { SmoothPopover } from "../../shared/SmoothPopover";
import { Unit } from "@/components/shared/Unit";

type Props = {
  unitId: string;
  color?: string;
  deployedCount: number;
};

const DEFAULT_UNIT_CAPS = {
  carrier: 4,
  mech: 4,
  flagship: 1,
  spacedock: 3,
  dreadnought: 5,
  destroyer: 8,
  cruiser: 8,
  pds: 6,
  warsun: 2,
  infantry: 12,
  fighter: 10,
};

export function UnitCard({ unitId, color, deployedCount }: Props) {
  const [opened, setOpened] = useState(false);
  const unitData = getUnitData(unitId);
  const colorAlias = getColorAlias(color);

  if (!unitData) return null; // or some fallback UI

  const isUpgraded = unitData.upgradesFromUnitId !== undefined;
  const isFaction = unitData.faction !== undefined;

  const cardClass = isUpgraded
    ? `${styles.unitCard} ${styles.upgraded}`
    : `${styles.unitCard} ${styles.standard}`;

  const unitCap =
    DEFAULT_UNIT_CAPS[unitData.baseType as keyof typeof DEFAULT_UNIT_CAPS];

  const reinforcements = unitCap - deployedCount;

  return (
    <SmoothPopover opened={opened} onChange={setOpened}>
      <SmoothPopover.Target>
        <Stack
          className={`${cardClass} ${styles.cardStack}`}
          onClick={() => setOpened((o) => !o)}
        >
          {/* Upgraded unit special effects */}
          {isUpgraded && (
            <>
              {/* Glassy sheen effect */}
              <Box className={styles.glassySheen} />

              {/* Subtle inner glow */}
              <Box className={styles.innerGlow} />
            </>
          )}

          {/* Faction icon badge for faction-specific units */}
          {isFaction && (
            <Box className={styles.factionBadge}>
              <Image
                src={cdnImage(
                  `/factions/${unitData.faction?.toLowerCase()}.png`
                )}
                className={styles.factionIcon}
              />
            </Box>
          )}

          <Flex className={styles.imageContainer}>
            <Unit
              unitType={unitData.asyncId}
              colorAlias={colorAlias}
              faction={unitData.faction}
              className={styles.unitImage}
            />
          </Flex>

          <Stack className={styles.infoStack}>
            <Group className={styles.mainGroup}>
              {/* Reinforcements - show infinity for fighters and infantry, normal count for others */}
              <Group className={styles.reinforcementGroup}>
                <Group className={styles.countGroup}>
                  <Text
                    className={
                      reinforcements === 0
                        ? styles.countTextZero
                        : styles.countText
                    }
                  >
                    {reinforcements}
                  </Text>
                  <Text className={styles.maxCountText}>/{unitCap}</Text>
                </Group>
              </Group>

              {/* Captured - commented out for now as requested */}
              {/* {captured > 0 && (
                <Group gap={3} align="baseline">
                  <Text
                    className={styles.capturedLabel}
                  >
                    C
                  </Text>
                  <Text
                    className={styles.capturedCount}
                  >
                    {captured}
                  </Text>
                </Group>
              )} */}
            </Group>
          </Stack>
        </Stack>
      </SmoothPopover.Target>
      <SmoothPopover.Dropdown className={styles.popoverDropdown}>
        <UnitDetailsCard unitId={unitId} color={color} />
      </SmoothPopover.Dropdown>
    </SmoothPopover>
  );
}

// Helper function to get unit data by ID
const getUnitData = (unitId: string) => {
  return units.find((unit) => unit.id === unitId);
};

// Helper function to get color alias from color name
const getColorAlias = (color?: string) => {
  if (!color) return "pnk"; // default fallback

  const colorData = colors.find(
    (solidColor) =>
      solidColor.name === color.toLowerCase() ||
      solidColor.aliases.includes(color.toLowerCase()) ||
      solidColor.alias === color.toLowerCase()
  );

  return colorData?.alias || "pnk"; // fallback to pink if not found
};
