import classes from "./PhantomTech.module.css";

type Props = {
  /** Tech tree to key the slot to. Omit for an unkeyed, grey slot. */
  techType?: string;
};

const TREE_COLOR: Record<string, string> = {
  PROPULSION: "var(--gd-blue)",
  CYBERNETIC: "var(--gd-yellow)",
  BIOTIC: "var(--gd-green)",
  WARFARE: "var(--gd-red)",
};

/*
 * Unkeyed slots are grey on purpose. Where the phantom stands for a specific
 * unresearched tech it is tinted to that tree; where it is only unused capacity
 * in a packed grid it belongs to no tree, and inventing a colour for it would
 * read as information the board doesn't have.
 */
const treeVar = (techType?: string) =>
  ({
    "--gradient-color": (techType && TREE_COLOR[techType]) || "var(--gd-gray)",
  }) as unknown as React.CSSProperties;

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
