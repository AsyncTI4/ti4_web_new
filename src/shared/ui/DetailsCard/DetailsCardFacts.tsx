import type { ReactNode } from "react";
import classes from "./DetailsCard.module.css";

type Fact = { key: string; icon?: ReactNode; value?: ReactNode; bonus?: ReactNode; label?: ReactNode };

/** A row of values in their own glyphs: resources, influence, skips. */
function DetailsCardFacts({ facts }: { facts: Fact[] }) {
  return (
    <div className={classes.sec}>
      <div className={classes.facts}>
        {facts.map((fact) => (
          <span key={fact.key} className={classes.fact}>
            {fact.icon}
            {fact.value !== undefined && <b>{fact.value}</b>}
            {fact.bonus}
            {fact.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default DetailsCardFacts;
