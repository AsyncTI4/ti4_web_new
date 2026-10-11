import { useDisclosure } from "@/hooks/useDisclosure";
import { getAbility, getAbilityKind } from "@/entities/lookup/abilities";
import { SmoothPopover } from "@/shared/ui/SmoothPopover";
import { AbilityDetailsCard } from "@/domains/cards/components/AbilityDetailsCard";
import {
  ABILITY_KIND_LABEL,
  AbilityMark,
} from "@/domains/cards/components/AbilityMark";
import {
  ObjectLabel,
  ObjectShell,
} from "@/domains/player/components/silhouettes/ObjectShell";
import classes from "./Ability.module.css";

type Props = {
  id: string;
  /** Accepted for API parity; the inscription has one weight. */
  strong?: boolean;
};

/**
 * Faction ability as an inscription: a rule printed on the faction sheet, so
 * it carries no plate — only its kind mark, its name and an engraved rule.
 */
export function Ability({ id }: Props) {
  const { opened, setOpened, toggle } = useDisclosure(false);
  const abilityData = getAbility(id);
  if (!abilityData) return null;

  const kind = getAbilityKind(abilityData);

  return (
    <SmoothPopover opened={opened} onChange={setOpened}>
      <SmoothPopover.Target>
        <ObjectShell
          className={classes.abl}
          state={kind}
          label={`${abilityData.name} (${ABILITY_KIND_LABEL[kind].toLowerCase()} ability)`}
          onClick={toggle}
        >
          <AbilityMark kind={kind} className={classes.mark} />
          <ObjectLabel>{abilityData.name}</ObjectLabel>
        </ObjectShell>
      </SmoothPopover.Target>
      <SmoothPopover.Dropdown p={0}>
        <AbilityDetailsCard abilityId={id} />
      </SmoothPopover.Dropdown>
    </SmoothPopover>
  );
}
