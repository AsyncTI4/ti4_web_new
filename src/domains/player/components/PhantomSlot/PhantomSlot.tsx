import classes from "./PhantomSlot.module.css";

/**
 * Unused capacity in a lane: a pressed-in socket rather than a blank, so a
 * short column reads as a rack with room in it.
 */
export function PhantomSlot() {
  return <div className={classes.socket} aria-hidden="true" />;
}
