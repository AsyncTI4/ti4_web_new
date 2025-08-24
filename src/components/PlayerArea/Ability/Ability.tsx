import { Group, Text } from "@mantine/core";
import { useState } from "react";
import { Shimmer } from "../Shimmer";
import { getAbility } from "../../../lookup/abilities";
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
  const ability = getAbility(abilityId);
  if (!ability) return null;

  // Filter by source if needed
  if (ability.source === "pok" || ability.source === "base") {
    return ability;
  }
  return null;
};
