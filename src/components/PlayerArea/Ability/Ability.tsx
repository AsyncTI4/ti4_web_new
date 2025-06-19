import { Group, Text } from "@mantine/core";
import { useState } from "react";
import { Shimmer } from "../Shimmer";
import { abilities } from "../../../data/abilities";
import { SmoothPopover } from "../../shared/SmoothPopover";
import { AbilityDetailsCard } from "../AbilityDetailsCard/AbilityDetailsCard";
import { CircularFactionIcon } from "../../shared/CircularFactionIcon";
import styles from "./Ability.module.css";

type Props = {
  id: string;
};

export function Ability({ id }: Props) {
  const [opened, setOpened] = useState(false);
  const abilityData = getAbilityData(id);
  if (!abilityData) return null;

  const AbilityContent = () => (
    <Group className={styles.abilityGroup}>
      <CircularFactionIcon
        faction={abilityData.faction}
        size={16}
        className={styles.factionIcon}
      />
      <Text className={`${styles.abilityName} ${styles.abilityNameActive}`}>
        {abilityData.name}
      </Text>
    </Group>
  );

  return (
    <SmoothPopover opened={opened} onChange={setOpened}>
      <SmoothPopover.Target>
        <div onClick={() => setOpened((o) => !o)}>
          <Shimmer
            color="purple"
            className={`${styles.abilityCard} ${styles.shimmerCard} ${styles.shimmerContainer}`}
          >
            <AbilityContent />
          </Shimmer>
        </div>
      </SmoothPopover.Target>
      <SmoothPopover.Dropdown p={0}>
        <AbilityDetailsCard abilityId={id} />
      </SmoothPopover.Dropdown>
    </SmoothPopover>
  );
}

const getAbilityData = (abilityId: string) => {
  return abilities.find(
    (ability) =>
      ability.id === abilityId &&
      (ability.source === "pok" || ability.source === "base")
  );
};
