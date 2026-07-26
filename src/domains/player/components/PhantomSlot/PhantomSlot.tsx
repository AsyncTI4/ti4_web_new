import classes from "./PhantomSlot.module.css";

/**
 * Unused capacity in a mixed holdings grid — secrets, relics, promissory notes.
 * Drawn as a milled seat rather than left blank, so a short column reads as a
 * rack with room in it instead of a layout that ran out of content.
 */
export function PhantomSlot() {
  return (
    <div className={classes.socket} aria-hidden="true">
      <span className={classes.iconSeat} />
      <span className={classes.nameRule} />
    </div>
  );
}
