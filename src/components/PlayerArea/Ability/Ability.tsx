import { useState } from "react";
import { getAbility } from "../../../lookup/abilities";
import { SmoothPopover } from "../../shared/SmoothPopover";
import { AbilityDetailsCard } from "../AbilityDetailsCard/AbilityDetailsCard";
import { Chip } from "@/components/shared/primitives/Chip";
import { CircularFactionIcon } from "@/components/shared/CircularFactionIcon";

type Props = {
  id: string;
};

export function Ability({ id }: Props) {
  const [opened, setOpened] = useState(false);
  const abilityData = getAbility(id);
  if (!abilityData) return null;

  return (
    <SmoothPopover opened={opened} onChange={setOpened}>
      <SmoothPopover.Target>
        <Chip
          accent="purple"
          accentLine
          strong
          title={abilityData.name}
          onClick={() => setOpened((o) => !o)}
          leftSection={
            <CircularFactionIcon faction={abilityData.faction} size={18} />
          }
        />
      </SmoothPopover.Target>
      <SmoothPopover.Dropdown p={0}>
        <AbilityDetailsCard abilityId={id} />
      </SmoothPopover.Dropdown>
    </SmoothPopover>
  );
}
