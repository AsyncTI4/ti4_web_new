import { Group, Text } from "@mantine/core";
import { SmallControlToken } from "@/domains/map/components/ControlToken";
import { PlayerColorSwatch } from "@/domains/player/components/PlayerColor";
import { CircularFactionIcon } from "@/shared/ui/CircularFactionIcon";
import { getColorAlias } from "@/entities/lookup/colors";
import { useFactionColors } from "@/hooks/useFactionColors";
import { useGameData } from "@/hooks/useGameContext";
import { useDisclosure } from "@/hooks/useDisclosure";
import { DetailsCard } from "@/shared/ui/DetailsCard";
import { SmoothPopover } from "@/shared/ui/SmoothPopover";
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
  const gameData = useGameData();
  const { opened, setOpened } = useDisclosure(false);

  const debtEntries = Object.entries(debts).filter(([, amount]) => amount > 0);
  if (debtEntries.length === 0) return null;

  /*
   * Direction matters and the field name does not carry it. A debt token IS the
   * debtor's own control token, handed over as an IOU — so the tokens in this
   * player's area belong to the players who owe THEM. Every entry here reads
   * "this colour owes me N", which is why the copy says "owed to you" and the
   * rows read "from".
   */
  const creditorName = (colorName: string) =>
    factionColorMap?.[colorName]?.faction ?? colorName;

  if (compact) {
    const total = debtEntries.reduce((sum, [, amount]) => sum + amount, 0);

    const ledger = (
      <div
        className={classes.ledger}
        role="group"
        tabIndex={0}
        aria-label={`Debt owed to this player: ${debtEntries
          .map(([color, amount]) => `${amount} from ${creditorName(color)}`)
          .join(", ")}`}
        onMouseEnter={() => setOpened(true)}
        onMouseLeave={() => setOpened(false)}
        onFocus={() => setOpened(true)}
        onBlur={() => setOpened(false)}
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

    /*
     * The shelf shows who and how much in ~70px, which is enough to scan but not
     * enough to name anyone. Hovering expands the same rows with the faction icon
     * and the player behind the colour — a ledger, aligned in three columns, so
     * the amounts stack in one scannable file rather than sitting inline.
     */
    return (
      <SmoothPopover opened={opened} onChange={setOpened} position="top">
        <SmoothPopover.Target>{ledger}</SmoothPopover.Target>
        <SmoothPopover.Dropdown p={0}>
          <DetailsCard width={252}>
            <DetailsCard.Title
              title="Owed to you"
              subtitle={`${total} debt token${total === 1 ? "" : "s"} from ${
                debtEntries.length
              } player${debtEntries.length === 1 ? "" : "s"}`}
            />
            <div className={classes.sheet}>
              {debtEntries.map(([colorName, amount]) => {
                const faction = factionColorMap?.[colorName]?.faction;
                const player = gameData?.playerData?.find(
                  (candidate) => candidate.color === colorName,
                );
                return (
                  <div key={colorName} className={classes.sheetRow}>
                    <span className={classes.sheetIcon}>
                      {faction ? (
                        <CircularFactionIcon faction={faction} size={20} />
                      ) : (
                        <PlayerColorSwatch color={colorName} />
                      )}
                    </span>
                    <span className={classes.sheetWho}>
                      <span className={classes.sheetName}>
                        {player?.userName ?? creditorName(colorName)}
                      </span>
                      <span className={classes.sheetMeta}>
                        {faction ?? colorName}
                      </span>
                    </span>
                    <span className={classes.sheetAmount}>{amount}</span>
                  </div>
                );
              })}
            </div>
          </DetailsCard>
        </SmoothPopover.Dropdown>
      </SmoothPopover>
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
