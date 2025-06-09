import { Stack, Box, Image, Text, Group, Divider } from "@mantine/core";
import InfluenceIcon from "../../InfluenceIcon";
import { cdnImage } from "@/data/cdnImage";
import { PlanetTraitIcon } from "../PlanetTraitIcon";
import { TechSkipIcon, TechType } from "../TechSkipIcon";
import classes from "./PlanetDetailsCard.module.css";
import { getPlanetData } from "@/lookup/planets";

type Props = {
  planetId: string;
};

export function PlanetDetailsCard({ planetId }: Props) {
  const planetData = getPlanetData(planetId);

  if (!planetData) return null;

  const isLegendary = !!planetData.legendaryAbilityText;
  const isFactionPlanet = planetData.planetType === "FACTION";
  const cardClass = isLegendary
    ? `${classes.card} ${classes.legendaryCard}`
    : classes.card;

  // Get tech specialty icons
  const techSpecialtyIcons =
    planetData.techSpecialties?.map((specialty: string) => (
      <TechSkipIcon
        key={specialty}
        techType={specialty.toLowerCase() as TechType}
      />
    )) || [];

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

    // Default planet icon for special planets like Mecatol Rex
    return (
      <Box
        w={80}
        h={80}
        className={`${classes.planetImage} ${classes.planetIconContainer}`}
      >
        <Image
          src="/planet_icon.png"
          w={40}
          h={40}
          style={{ filter: "brightness(0.8)" }}
        />
      </Box>
    );
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
              {planetData.resources} Resources
            </Text>
          </Group>
          <Group gap="xs">
            <InfluenceIcon size={20} />
            <Text size="sm" c="white" fw={600}>
              {planetData.influence} Influence
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
                  {planetData.techSpecialties?.join(", ")}
                </Text>
              </Group>
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
