import { Group, Text } from "@mantine/core";
import { SmallControlToken } from "@/domains/map/components/ControlToken";
import { PlayerColorSwatch } from "@/domains/player/components/PlayerColor";
import { getColorAlias } from "@/entities/lookup/colors";
import { useFactionColors } from "@/hooks/useFactionColors";
import { Panel } from "@/shared/ui/primitives/Panel";
import classes from "./DebtTokens.module.css";

type Props = {
  debts: Record<string, number>;
  /**
   * Ledger form for the player band's salvage shelf, which has roughly 70px to
   * spare. The full form costs ~90px per creditor and with five of them it drove
   * the status compartment from its 148px base out to 444px, dragging the whole
   * band's geometry with it.
   */
  compact?: boolean;
};

export function DebtTokens({ debts, compact = false }: Props) {
  /*
   * Before any early return. This used to sit after one, which made it a
   * conditional hook — the hook order would desync the moment a player went from
   * owing something to owing nothing mid-game, which the live socket can do.
   */
  const factionColorMap = useFactionColors();

  const debtEntries = Object.entries(debts).filter(([, amount]) => amount > 0);
  if (debtEntries.length === 0) return null;

  const creditorName = (colorName: string) =>
    factionColorMap?.[colorName]?.faction ?? colorName;

  if (compact) {
    return (
      <div
        className={classes.ledger}
        role="group"
        aria-label={`Debt owed: ${debtEntries
          .map(([color, amount]) => `${amount} to ${creditorName(color)}`)
          .join(", ")}`}
      >
        {/* The label is what makes a row of coloured pips read as debt rather
            than as some tally. It sits above the cells rather than beside them
            because vertical room is what this shelf has and width is what it
            does not. */}
        <span className={classes.ledgerLabel} aria-hidden="true">
          Debt
        </span>
        <span className={classes.cells}>
          {debtEntries.map(([colorName, amount]) => (
            <span
              key={colorName}
              className={classes.cell}
              title={`${creditorName(colorName)}: ${amount}`}
            >
              <PlayerColorSwatch color={colorName} />
              <span className={classes.cellAmount} aria-hidden="true">
                {amount}
              </span>
            </span>
          ))}
        </span>
      </div>
    );
  }

  return (
    <Panel className={classes.container}>
      <Group gap={8}>
        {debtEntries.map(([colorName, amount]) => (
          <Group key={colorName} gap={2} className={classes.row}>
            <SmallControlToken
              colorAlias={getColorAlias(colorName)}
              faction={factionColorMap?.[colorName]?.faction}
            />
            <Text className={classes.amount}>×{amount}</Text>
          </Group>
        ))}
      </Group>
    </Panel>
  );
}
