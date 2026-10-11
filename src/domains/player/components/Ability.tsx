import { useDisclosure } from "@/hooks/useDisclosure";
import { getAbility } from "@/entities/lookup/abilities";
import { SmoothPopover } from "@/shared/ui/SmoothPopover";
import { AbilityDetailsCard } from "@/domains/cards/components/AbilityDetailsCard";
import {
  ObjectLabel,
  ObjectShell,
} from "@/domains/player/components/silhouettes/ObjectShell";
import classes from "./Ability.module.css";

/** A hex cell with a lit core: a power seated in the board's own geometry. */
function AbilitySigil() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M8 1.2 14 4.6v6.8L8 14.8 2 11.4V4.6z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="8" cy="8" r="2.2" fill="currentColor" />
    </svg>
  );
}

type Props = {
  id: string;
  /** Accepted for API parity; the tag has one weight. */
  strong?: boolean;
};

/**
 * Engraved tag: a violet hairline with no fill weight and the hex sigil seated
 * in a recessed well. Abilities are permanent rules, so they read as stamped
 * rather than held.
 */
export function Ability({ id }: Props) {
  const { opened, setOpened, toggle } = useDisclosure(false);
  const abilityData = getAbility(id);
  if (!abilityData) return null;

  return (
    <SmoothPopover opened={opened} onChange={setOpened}>
      <SmoothPopover.Target>
        <ObjectShell
          className={classes.abl}
          label={abilityData.name}
          onClick={toggle}
        >
          <span className={classes.well}>
            <AbilitySigil />
          </span>
          <ObjectLabel>{abilityData.name}</ObjectLabel>
        </ObjectShell>
      </SmoothPopover.Target>
      <SmoothPopover.Dropdown p={0}>
        <AbilityDetailsCard abilityId={id} />
      </SmoothPopover.Dropdown>
    </SmoothPopover>
  );
}
