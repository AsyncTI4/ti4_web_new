import { Stack, Text, Image } from "@mantine/core";
import { useDisclosure } from "@/hooks/useDisclosure";
import { SmoothPopover } from "../../shared/SmoothPopover";
import { getPlanetData } from "@/lookup/planets";
import { PlanetAbilityDetailsCard } from "./PlanetAbilityDetailsCard";
import styles from "./PlanetAbilityCard.module.css";
import { cdnImage } from "@/data/cdnImage";

type Props = {
  planetId: string;
  abilityName: string;
  abilityText: string;
  exhausted?: boolean;
  joinedRight?: boolean;
};

export function PlanetAbilityCard({
  planetId,
  abilityName,
  abilityText,
  exhausted = false,
  joinedRight = false,
}: Props) {
  const { opened, setOpened, toggle } = useDisclosure(false);
  const planetData = getPlanetData(planetId);

  if (!planetData) {
    console.warn(`Planet data not found for ID: ${planetId}`);
    return null;
  }

  return (
    <SmoothPopover opened={opened} onChange={setOpened}>
      <SmoothPopover.Target>
        <Stack
          onClick={toggle}
          className={`${styles.mainStack} ${styles.abilityCard} ${joinedRight ? styles.joinedRight : ""} ${exhausted ? styles.exhausted : ""}`}
        >
          {/* Exhausted badge removed; exhausted state now uses lower opacity filter */}
          <Stack className={styles.bottomStack}>
            <LegendaryIcon key="legendary" />
            <div style={{ flex: 1 }} />
            <Text className={styles.planetName} ff="monospace">
              Ability
            </Text>
          </Stack>
        </Stack>
      </SmoothPopover.Target>
      <SmoothPopover.Dropdown>
        <PlanetAbilityDetailsCard
          planetId={planetId}
          abilityName={abilityName}
          abilityText={abilityText}
        />
      </SmoothPopover.Dropdown>
    </SmoothPopover>
  );
}

type LegendaryIconProps = {};

function LegendaryIcon({}: LegendaryIconProps) {
  return (
    <Image
      src={cdnImage("/planet_cards/pc_legendary_rdy.png")}
      className={styles.legendaryIcon}
    />
  );
}
