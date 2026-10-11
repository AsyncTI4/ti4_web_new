import type { ReactNode } from "react";
import cx from "clsx";
import classes from "./DetailsCard.module.css";

type Props = {
  children: ReactNode;
  /** Lore that should not compete with the rules: grey rather than tinted. */
  quiet?: boolean;
};

/** Flavour text closes the card in italics. */
function DetailsCardFlavor({ children, quiet }: Props) {
  return (
    <div className={classes.sec}>
      <p className={cx(classes.flavor, quiet && classes.flavorQuiet)}>
        {children}
      </p>
    </div>
  );
}

export default DetailsCardFlavor;
