import classes from "./PhantomTech.module.css";

type Props = {
  techType: string;
};

const TREE_COLOR: Record<string, string> = {
  PROPULSION: "var(--gd-blue)",
  CYBERNETIC: "var(--gd-yellow)",
  BIOTIC: "var(--gd-green)",
  WARFARE: "var(--gd-red)",
};

const treeVar = (techType: string) =>
  ({ "--gradient-color": TREE_COLOR[techType] }) as unknown as React.CSSProperties;

/** An unresearched tech slot: a socket milled into the plate, keyed to its tree. */
export function PhantomTech({ techType }: Props) {
  return (
    <div
      className={classes.socket}
      style={treeVar(techType)}
      aria-hidden="true"
    >
      <span className={classes.iconSeat} />
      <span className={classes.nameRule} />
    </div>
  );
}
