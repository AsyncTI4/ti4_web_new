import { useDisclosure } from "@/hooks/useDisclosure";
import { getAbility } from "@/entities/lookup/abilities";
import { SmoothPopover } from "@/shared/ui/SmoothPopover";
import { AbilityDetailsCard } from "./AbilityDetailsCard";
import { Chip } from "@/shared/ui/primitives/Chip";
import { isMobileDevice } from "@/utils/isTouchDevice";
import classes from "./Ability.module.css";

/**
 * A hex cell with a lit core. An ability is a power seated inside the board's own
 * unit of geometry — which says more than a generic sparkle, and ties the chip to
 * the map it belongs to.
 */
function AbilitySigil() {
  return (
    <svg
      className={classes.sigil}
      width="15"
      height="16"
      viewBox="0 0 15 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M7.5 1.1 13.1 4.3v7.4L7.5 14.9 1.9 11.7V4.3z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="miter"
      />
      <path d="M7.5 5.4 10 6.9v3l-2.5 1.4L5 9.9v-3z" fill="currentColor" />
    </svg>
  );
}

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
          strong={strong}
          title={abilityData.name}
          onClick={toggle}
          className={classes.chip}
          leftSection={!isMobileDevice() ? <AbilitySigil /> : undefined}
        />
      </SmoothPopover.Target>
      <SmoothPopover.Dropdown p={0}>
        <AbilityDetailsCard abilityId={id} />
      </SmoothPopover.Dropdown>
    </SmoothPopover>
  );
}
