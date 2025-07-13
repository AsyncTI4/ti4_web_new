import { Stack, Text } from "@mantine/core";
import { useState } from "react";
import { SmoothPopover } from "../../shared/SmoothPopover";
import { getPlanetData } from "@/lookup/planets";
import { PlanetAbilityDetailsCard } from "./PlanetAbilityDetailsCard";
import styles from "./PlanetAbilityCard.module.css";

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
          className={`${styles.mainStack} ${styles.abilityCard}`}
          style={{
            opacity: exhausted ? 0.7 : 1,
          }}
        >
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
