import { Stack, Box, Image, Text, Group, Divider } from "@mantine/core";
import InfluenceIcon from "@/shared/ui/InfluenceIcon";
import { cdnImage } from "@/entities/data/cdnImage";
import { getFactionImage } from "@/entities/lookup/factions";
import { PlanetTraitIcon } from "@/shared/ui/PlanetTraitIcon";
import { TechSkipIcon, TechType } from "@/shared/ui/TechSkipIcon";
import classes from "./PlanetDetailsCard.module.css";
import { PlanetActionCardsSection } from "../PlanetAbilityDetailsCard/PlanetActionCardsSection";
import { getPlanetData } from "@/entities/lookup/planets";
import { getAttachmentData } from "@/entities/lookup/attachments";
import { getAttachmentModifiers } from "@/entities/game/planets";
import { DetailsCard } from "@/shared/ui/DetailsCard";
import DetailsCardTitle from "@/shared/ui/DetailsCard/DetailsCardTitle";
import DetailsCardIcon from "@/shared/ui/DetailsCard/DetailsCardIcon";

import { TilePlanet } from "@/entities/game/types";

type Props = {
  planetId: string;
  planetTile?: TilePlanet;
};

const PLANET_TYPE_LABEL: Record<string, string> = {
  CULTURAL: "Cultural",
  HAZARDOUS: "Hazardous",
  INDUSTRIAL: "Industrial",
  FACTION: "Faction Homeworld",
  MR: "Mecatol Rex",
};

export function PlanetDetailsCard({ planetId, planetTile }: Props) {
  const planetData = getPlanetData(planetId);
  if (!planetData) return null;

  const isLegendary = !!planetData.legendaryAbilityText;
  const isFactionPlanet = planetData.planetType === "FACTION";

  const attachments = planetTile?.attachments ?? [];
  const attachmentModifiers = getAttachmentModifiers(attachments);

  const allTechSpecialties = [
    ...(planetData.techSpecialties || []),
    ...attachmentModifiers.techSpecialties,
  ];

  const techSpecialtyIcons = allTechSpecialties.map(
    (specialty, index) => (
      <TechSkipIcon
        key={`${specialty}-${index}`}
        techType={specialty.toLowerCase() as TechType}
      />
    )
  );

  const renderTraitIcon = () => {
    if (isFactionPlanet && planetData.factionHomeworld) {
      return (
        <Image
          src={getFactionImage(planetData.factionHomeworld)}
          w={80}
          h={80}
        />
      );
    }

    const traitKey = planetData.planetType?.toLowerCase();
    if (
      traitKey &&
      ["cultural", "hazardous", "industrial"].includes(traitKey)
    ) {
      return (
        <Box w={80} h={80} className={classes.planetIconContainer}>
          <PlanetTraitIcon
            trait={traitKey as "cultural" | "hazardous" | "industrial"}
            size={40}
          />
        </Box>
      );
    }

    return null;
  };

  const traitIcon = renderTraitIcon();

  return (
    <DetailsCard width={320}>
      <Stack gap="md">
        <DetailsCardTitle
          title={planetData.name}
          subtitle={
            PLANET_TYPE_LABEL[planetData.planetType ?? ""] ??
            planetData.planetType
          }
          icon={traitIcon ? <DetailsCardIcon icon={traitIcon} /> : undefined}
        />

        <Divider c="gray.7" opacity={0.8} />

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

        <PlanetActionCardsSection actionCards={planetTile?.actionCards} />

        {planetData.flavourText && (
          <>
            <Divider c="gray.7" opacity={0.8} />
            <Box>
              <Text size="sm" c="blue.3" mb={4}>
                Description
              </Text>
              <Text size="xs" c="gray.4" lh={1.3} fs="italic" opacity={0.7}>
                {planetData.flavourText}
              </Text>
            </Box>
          </>
        )}
      </Stack>
    </DetailsCard>
  );
}
