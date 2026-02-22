import { useDisclosure } from "@/hooks/useDisclosure";
import { getAbility } from "@/entities/lookup/abilities";
import { SmoothPopover } from "@/shared/ui/SmoothPopover";
import { AbilityDetailsCard } from "./AbilityDetailsCard";
import { Chip } from "@/shared/ui/primitives/Chip";
import { IconSparkles } from "@tabler/icons-react";
import { isMobileDevice } from "@/utils/isTouchDevice";

type Props = {
  id: string;
  strong?: boolean;
};

export function Ability({ id, strong = true }: Props) {
  const { opened, setOpened, toggle } = useDisclosure(false);
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
          onClick={toggle}
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
