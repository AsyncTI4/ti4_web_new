import type { ReactNode } from "react";
import classes from "./DetailsCard.module.css";

type Props = {
  title?: ReactNode;
  content: ReactNode;
};

/** A labelled block; the label speaks in the object's colour. */
function DetailsCardSection({ title, content }: Props) {
  return (
    <div className={classes.sec}>
      {title && <span className={classes.label}>{title}</span>}
      {typeof content === "string"
        ? content
            .split(/\n+/)
            .filter((line) => line.trim())
            .map((line, index) => (
              <p key={index} className={classes.text}>
                {line}
              </p>
            ))
        : content}
    </div>
  );
}

export default DetailsCardSection;
