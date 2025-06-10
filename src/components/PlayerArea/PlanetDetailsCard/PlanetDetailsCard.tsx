import { Stack, Box, Image, Text, Group, Divider } from "@mantine/core";
import InfluenceIcon from "../../InfluenceIcon";
import { cdnImage } from "@/data/cdnImage";
import { PlanetTraitIcon } from "../PlanetTraitIcon";
import { TechSkipIcon, TechType } from "../TechSkipIcon";
import classes from "./PlanetDetailsCard.module.css";
import { getPlanetData } from "@/lookup/planets";
import { getAttachmentData } from "@/data/attachments";

type Props = {
  planetId: string;
  attachments?: string[];
};

export function PlanetDetailsCard({ planetId, attachments = [] }: Props) {
  const planetData = getPlanetData(planetId);

  if (!planetData) return null;

  const isLegendary = !!planetData.legendaryAbilityText;
  const isFactionPlanet = planetData.planetType === "FACTION";
  const cardClass = isLegendary
    ? `${classes.card} ${classes.legendaryCard}`
    : classes.card;

  // Calculate attachment modifiers
  const attachmentModifiers = attachments.reduce(
    (totals, attachmentId) => {
      const attachmentData = getAttachmentData(attachmentId);
      if (attachmentData) {
        return {
          resources: totals.resources + (attachmentData.resourcesModifier || 0),
          influence: totals.influence + (attachmentData.influenceModifier || 0),
          techSpecialties: [
            ...totals.techSpecialties,
            ...(attachmentData.techSpeciality || []),
          ],
        };
      }
      return totals;
    },
    { resources: 0, influence: 0, techSpecialties: [] as string[] }
  );

  // Get all tech specialties (native + attachment)
  const allTechSpecialties = [
    ...(planetData.techSpecialties || []),
    ...attachmentModifiers.techSpecialties,
  ];

  // Get tech specialty icons
  const techSpecialtyIcons = allTechSpecialties.map(
    (specialty: string, index) => (
      <TechSkipIcon
        key={`${specialty}-${index}`}
        techType={specialty.toLowerCase() as TechType}
      />
    )
  );

  // Get planet type display name
  const getPlanetTypeDisplay = (type: string) => {
    switch (type) {
      case "CULTURAL":
        return "Cultural";
      case "HAZARDOUS":
        return "Hazardous";
      case "INDUSTRIAL":
        return "Industrial";
      case "FACTION":
        return "Faction Homeworld";
      case "MR":
        return "Mecatol Rex";
      default:
        return type;
    }
  };

  // Get planet trait icon
  const renderTraitIcon = () => {
    if (isFactionPlanet && planetData.factionHomeworld) {
      return (
        <Image
          src={cdnImage(`/factions/${planetData.factionHomeworld}.png`)}
          w={80}
          h={80}
          className={classes.planetImage}
        />
      );
    }

    const traitKey = planetData.planetType!.toLowerCase();
    if (["cultural", "hazardous", "industrial"].includes(traitKey)) {
      return (
        <Box
          w={80}
          h={80}
          className={`${classes.planetImage} ${classes.planetIconContainer}`}
        >
          <PlanetTraitIcon
            trait={traitKey as "cultural" | "hazardous" | "industrial"}
            size={40}
          />
        </Box>
      );
    }

    // Default planet icon for special planets like Mecatol Rex (no icon)
    return <></>;
  };

  return (
    <Box w={320} p="md" className={cardClass}>
      <Stack gap="md">
        {/* Header with image and basic info */}
        <Group gap="md" align="flex-start">
          {renderTraitIcon()}
          <Stack gap={4} flex={1}>
            <Text
              size="lg"
              fw={700}
              c={isLegendary ? undefined : "white"}
              className={isLegendary ? classes.legendaryTitle : undefined}
            >
              {planetData.name}
            </Text>
            <Text size="sm" c="gray.3" fw={500} fs="italic">
              {getPlanetTypeDisplay(planetData.planetType!)}
            </Text>
          </Stack>
        </Group>

        <Divider c="gray.7" opacity={0.8} />

        {/* Resources and Influence */}
        <Group gap="lg">
          <Group gap="xs">
            <Image src="/pa_resources.png" w={20} h={20} />
            <Text size="sm" c="white" fw={600}>
              {planetData.resources}
              {attachmentModifiers.resources !== 0 && (
                <Text component="span" size="sm" c="green.4" ml={4}>
                  {attachmentModifiers.resources > 0 ? "+" : ""}
                  {attachmentModifiers.resources}
                </Text>
              )}
              <Text component="span" ml={4}>
                Resources
              </Text>
            </Text>
          </Group>
          <Group gap="xs">
            <InfluenceIcon size={20} />
            <Text size="sm" c="white" fw={600}>
              {planetData.influence}
              {attachmentModifiers.influence !== 0 && (
                <Text component="span" size="sm" c="green.4" ml={4}>
                  {attachmentModifiers.influence > 0 ? "+" : ""}
                  {attachmentModifiers.influence}
                </Text>
              )}
              <Text component="span" ml={4}>
                Influence
              </Text>
            </Text>
          </Group>
        </Group>

        {/* Tech Specialties */}
        {techSpecialtyIcons.length > 0 && (
          <>
            <Divider c="gray.7" opacity={0.8} />
            <Box>
              <Text size="sm" c="blue.3" mb={4}>
                Technology Specialties
              </Text>
              <Group gap="xs">
                {techSpecialtyIcons}
                <Text size="sm" c="gray.2">
                  {allTechSpecialties.join(", ").toUpperCase()}
                </Text>
              </Group>
            </Box>
          </>
        )}

        {/* Attachments */}
        {attachments.length > 0 && (
          <>
            <Divider c="purple.6" opacity={0.8} />
            <Box>
              <Group gap="xs" mb={8}>
                <Image
                  src={cdnImage("/planet_cards/pc_upgrade.png")}
                  w={16}
                  h={16}
                />
                <Text size="sm" c="purple.3" fw={500}>
                  Attachments
                </Text>
              </Group>
              <Stack gap="xs">
                {attachments.map((attachmentId) => {
                  const attachmentData = getAttachmentData(attachmentId);
                  if (!attachmentData) return null;

                  return (
                    <Group key={attachmentId} gap="xs" align="flex-start">
                      <img
                        src={cdnImage(
                          `/attachment_token/${attachmentData.imagePath}`
                        )}
                        style={{
                          height: 20,
                          borderRadius: 4,
                        }}
                      />
                      <Box flex={1}>
                        <Text size="sm" c="white" fw={500}>
                          {attachmentData.name || attachmentId}
                        </Text>
                        {(attachmentData.resourcesModifier ||
                          attachmentData.influenceModifier ||
                          attachmentData.techSpeciality) && (
                          <Group gap="md" mt={2}>
                            {attachmentData.resourcesModifier && (
                              <Group gap={2}>
                                <Image src="/pa_resources.png" w={12} h={12} />
                                <Text size="xs" c="green.4">
                                  +{attachmentData.resourcesModifier}
                                </Text>
                              </Group>
                            )}
                            {attachmentData.influenceModifier && (
                              <Group gap={2}>
                                <InfluenceIcon size={12} />
                                <Text size="xs" c="green.4">
                                  +{attachmentData.influenceModifier}
                                </Text>
                              </Group>
                            )}
                            {attachmentData.techSpeciality &&
                              attachmentData.techSpeciality.length > 0 && (
                                <Text size="xs" c="blue.4">
                                  Tech:{" "}
                                  {attachmentData.techSpeciality
                                    ?.join(", ")
                                    .toUpperCase()}
                                </Text>
                              )}
                          </Group>
                        )}
                      </Box>
                    </Group>
                  );
                })}
              </Stack>
            </Box>
          </>
        )}

        {/* Legendary Ability */}
        {isLegendary && (
          <>
            <Divider c="yellow.6" opacity={0.8} />
            <Box>
              <Group gap="xs" mb={4}>
                <Image
                  src={cdnImage("/planet_cards/pc_legendary_rdy.png")}
                  w={16}
                  h={16}
                />
                <Text size="sm" c="yellow.3" fw={500}>
                  Legendary Ability
                </Text>
              </Group>
              <Text size="sm" c="gray.1" lh={1.5}>
                {planetData.legendaryAbilityText}
              </Text>
            </Box>
          </>
        )}

        {/* Flavor Text */}
        {(planetData as any).flavourText && (
          <>
            <Divider c="gray.7" opacity={0.8} />
            <Box>
              <Text size="sm" c="blue.3" mb={4}>
                Description
              </Text>
              <Text size="xs" c="gray.4" lh={1.3} fs="italic" opacity={0.7}>
                {(planetData as any).flavourText}
              </Text>
            </Box>
          </>
        )}
      </Stack>
    </Box>
  );
}
