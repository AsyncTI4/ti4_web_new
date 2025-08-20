import { Stack, Text, Box } from "@mantine/core";
import { useState } from "react";
import { SmoothPopover } from "../../shared/SmoothPopover";
import { getPlanetData } from "@/lookup/planets";
import { PlanetAbilityDetailsCard } from "./PlanetAbilityDetailsCard";
import styles from "./PlanetAbilityCard.module.css";
import { IconZzz } from "@tabler/icons-react";

type Props = {
  planetId: string;
  abilityName: string;
  abilityText: string;
  exhausted?: boolean;
};

export function PlanetAbilityCard({
  planetId,
  abilityName,
  abilityText,
  exhausted = false,
}: Props) {
  const [opened, setOpened] = useState(false);
  const planetData = getPlanetData(planetId);

  if (!planetData) {
    console.warn(`Planet data not found for ID: ${planetId}`);
    return null;
  }

  return (
    <SmoothPopover opened={opened} onChange={setOpened}>
      <SmoothPopover.Target>
        <Stack
          onClick={() => setOpened((o) => !o)}
          className={`${styles.mainStack} ${styles.abilityCard} ${exhausted ? styles.exhausted : ""}`}
        >
          {exhausted && (
            <Box className={styles.exhaustBadge} aria-label="Exhausted">
              <IconZzz size={18} />
            </Box>
          )}
          <Stack className={styles.bottomStack}>
            <Text className={styles.planetName} ff="monospace">
              {planetData.shortName ?? planetData.name} Ability
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
