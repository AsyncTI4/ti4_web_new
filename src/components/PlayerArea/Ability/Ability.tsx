import { useState } from "react";
import { getAbility } from "../../../lookup/abilities";
import { SmoothPopover } from "../../shared/SmoothPopover";
import { AbilityDetailsCard } from "../AbilityDetailsCard/AbilityDetailsCard";
import { Chip } from "@/components/shared/primitives/Chip";
import { IconSparkles } from "@tabler/icons-react";
import { isMobileDevice } from "@/utils/isTouchDevice";

type Props = {
  id: string;
  strong?: boolean;
};

export function Ability({ id, strong = true }: Props) {
  const [opened, setOpened] = useState(false);
  const abilityData = getAbility(id);
  if (!abilityData) return null;

  return (
    <SmoothPopover opened={opened} onChange={setOpened}>
      <SmoothPopover.Target>
        <Chip
          accent="purple"
          accentLine
          strong={strong}
          title={abilityData.name}
          onClick={() => setOpened((o) => !o)}
          leftSection={
            !isMobileDevice() ? <IconSparkles size={18} /> : undefined
          }
        />
      </SmoothPopover.Target>
      <SmoothPopover.Dropdown p={0}>
        <AbilityDetailsCard abilityId={id} />
      </SmoothPopover.Dropdown>
    </SmoothPopover>
  );
}
