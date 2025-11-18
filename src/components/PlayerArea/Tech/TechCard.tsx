import { Box, Group, Image, Stack, Text } from "@mantine/core";
import { DetailsCard } from "@/components/shared/DetailsCard";
import { CircularFactionIcon } from "@/components/shared/CircularFactionIcon";
import styles from "./TechCard.module.css";
import { getTechData } from "../../../lookup/tech";
import { getGenericUnitDataByRequiredTechId } from "@/lookup/units";
import { getColorAlias } from "@/lookup/colors";
import { cdnImage } from "@/data/cdnImage";

// Helper function to get tech color from type
const getTechColor = (techType: string): string => {
  switch (techType) {
    case "PROPULSION":
      return "blue";
    case "BIOTIC":
      return "green";
    case "WARFARE":
      return "red";
    case "CYBERNETIC":
      return "yellow";
    case "NONE":
      return "white";
    default:
      return "grey";
  }
};

type Props = {
  techId: string;
};

export function TechCard({ techId }: Props) {
  const techData = getTechData(techId);

  if (!techData) {
    console.warn(`Tech with ID "${techId}" not found`);
    return null;
  }

  const color = getTechColor(techData.types[0]);
  const isFactionTech = !!techData.faction;
  const isUnitUpgrade = techData.types.includes("UNITUPGRADE");

  const detailsCardColor =
    color === "grey" || color === "white"
      ? "none"
      : (color as "blue" | "green" | "red" | "yellow");

  const formatType = (type: string) => {
    if (type === "PROPULSION") return "Propulsion";
    if (type === "BIOTIC") return "Biotic";
    if (type === "WARFARE") return "Warfare";
    if (type === "CYBERNETIC") return "Cybernetic";
    if (type === "UNITUPGRADE") return "Unit Upgrade";
    if (type === "NONE") return "Special";
    return type;
  };

  const techIconSrc =
    color === "grey" || color === "white"
      ? undefined
      : (`/${color}.png` as const);

  // Build unit icon for unit upgrade techs (fallback to neutral color alias)
  const unitIcon = (() => {
    if (!isUnitUpgrade) return undefined;
    const requiredTechId = techData.baseUpgrade || techId;
    const unitData = getGenericUnitDataByRequiredTechId(requiredTechId);
    if (!unitData?.asyncId) return undefined;
    const colorAlias = getColorAlias(undefined);
    const src = cdnImage(`/units/${colorAlias}_${unitData.asyncId}.png`);
    return <DetailsCard.Icon icon={<Image src={src} w={28} h={28} />} />;
  })();

  // Map requirements string (e.g., "BBY") to prerequisite icons
  const requirementIcons = (() => {
    const req = techData.requirements || "";
    if (!req) return [] as string[];
    const ICON_MAP: Record<string, string> = {
      B: "/blue.png",
      G: "/green.png",
      R: "/red.png",
      Y: "/yellow.png",
    };
    return req
      .split("")
      .map((c) => ICON_MAP[c])
      .filter((src): src is string => Boolean(src));
  })();

  return (
    <DetailsCard
      width={320}
      color={detailsCardColor}
      className={styles.content}
    >
      <Stack gap="md" h="100%">
        <DetailsCard.Title
          title={techData.name}
          subtitle={`${formatType(techData.types[0])} Technology`}
          icon={
            unitIcon ??
            (techData.name === "Antimatter" ? (
              <DetailsCard.Icon
                icon={
                  <Text fw={700} fz={28} c="white" style={{ lineHeight: 1 }}>
                    A
                  </Text>
                }
              />
            ) : techData.name === "Wavelength" ? (
              <DetailsCard.Icon
                icon={
                  <Text fw={700} fz={28} c="white" style={{ lineHeight: 1 }}>
                    W
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
