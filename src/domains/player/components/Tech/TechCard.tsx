import { Box, Group, Image, Stack, Text } from "@mantine/core";
import { DetailsCard } from "@/shared/ui/DetailsCard";
import { CircularFactionIcon } from "@/shared/ui/CircularFactionIcon";
import styles from "./TechCard.module.css";
import {
  getTechData,
  getTechLetter,
  TECH_PREREQ_ICON,
  TECH_TYPE_COLOR,
} from "@/entities/lookup/tech";
import { getGenericUnitDataByRequiredTechId } from "@/entities/lookup/units";
import { getColorAlias } from "@/entities/lookup/colors";
import { cdnImage } from "@/entities/data/cdnImage";

type Props = {
  techId: string;
};

const TECH_TYPE_LABEL: Record<string, string> = {
  PROPULSION: "Propulsion",
  BIOTIC: "Biotic",
  WARFARE: "Warfare",
  CYBERNETIC: "Cybernetic",
  UNITUPGRADE: "Unit Upgrade",
  NONE: "Special",
  GENERICTF: "Special",
};

export function TechCard({ techId }: Props) {
  const techData = getTechData(techId);

  if (!techData) return null;

  const color = TECH_TYPE_COLOR[techData.types[0]];
  const isFactionTech = !!techData.faction;
  const isUnitUpgrade = techData.types.includes("UNITUPGRADE");

  const techType = techData.types[0];
  const techLetter = getTechLetter(techData.name);
  const techIconSrc = color ? `/${color}.png` : undefined;

  const unitIcon = (() => {
    if (!isUnitUpgrade) return undefined;
    const requiredTechId = techData.baseUpgrade || techId;
    const unitData = getGenericUnitDataByRequiredTechId(requiredTechId);
    if (!unitData?.asyncId) return undefined;
    const colorAlias = getColorAlias(undefined);
    const src = cdnImage(`/units/${colorAlias}_${unitData.asyncId}.png`);
    return <DetailsCard.Icon icon={<Image src={src} w={28} h={28} />} />;
  })();

  const requirementIcons = (techData.requirements ?? "")
    .split("")
    .map((c) => TECH_PREREQ_ICON[c])
    .filter((src): src is string => Boolean(src));

  return (
    <DetailsCard
      width={320}
      color={color ?? "none"}
      className={styles.content}
    >
      <Stack gap="md" h="100%">
        <DetailsCard.Title
          title={techData.name}
          subtitle={`${TECH_TYPE_LABEL[techType] ?? techType} Technology`}
          icon={
            unitIcon ??
            (techLetter ? (
              <DetailsCard.Icon
                icon={
                  <Text fw={700} fz={28} c="white" style={{ lineHeight: 1 }}>
                    {techLetter}
                  </Text>
                }
              />
            ) : techIconSrc ? (
              <DetailsCard.Icon
                icon={<Image src={techIconSrc} w={28} h={28} />}
              />
            ) : undefined)
          }
          caption={isFactionTech ? "Faction Tech" : undefined}
          captionColor="blue"
        />

        {isFactionTech && techData.faction && (
          <Box className={styles.factionIcon}>
            <CircularFactionIcon faction={techData.faction} size={24} />
          </Box>
        )}

        <DetailsCard.Section
          content={
            techData.text?.replace(/\n/g, "\n\n") || "No description available."
          }
        />

        <Box className={styles.bottomSection}>
          {requirementIcons.length > 0 && (
            <Box className={styles.techIconContainer}>
              <Group gap={4} justify="flex-end" align="center">
                {requirementIcons.map((src, i) => (
                  <Image
                    key={`${src}-${i}`}
                    src={src}
                    alt="tech prerequisite"
                    w={14}
                    h={14}
                    className={styles.stackIcon}
                  />
                ))}
              </Group>
            </Box>
          )}
        </Box>
      </Stack>
    </DetailsCard>
  );
}
