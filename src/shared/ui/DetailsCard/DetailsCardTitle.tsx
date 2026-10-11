import type { ReactNode } from "react";
import classes from "./DetailsCard.module.css";

type Props = {
  title: ReactNode;
  /** The object's kind, set in its signal colour: "Agent", "Relic", "Law". */
  type?: ReactNode;
  /** Quiet facts after the type: phase, owner, initiative. */
  meta?: ReactNode[];
  icon?: ReactNode;
  /** Anything pinned to the header's trailing edge. */
  aside?: ReactNode;
  /** Legacy pair: caption reads as the type, subtitle as the meta. */
  subtitle?: ReactNode;
  caption?: ReactNode;
  captionColor?: string;
};

function DetailsCardTitle({
  title,
  type,
  meta,
  icon,
  aside,
  subtitle,
  caption,
}: Props) {
  const emphasis = type ?? caption ?? subtitle;
  const quiet = type ? (meta ?? []) : caption ? [subtitle] : [];
  const rest = quiet.filter(Boolean);

  return (
    <div className={classes.head}>
      {icon}
      <div className={classes.headText}>
        <div className={classes.title}>{title}</div>
        {(emphasis || rest.length > 0) && (
          <div className={classes.typ}>
            {emphasis && <span className={classes.typEm}>{emphasis}</span>}
            {rest.map((item, index) => (
              <span key={index}>{item}</span>
            ))}
          </div>
        )}
      </div>
      {aside && <div className={classes.aside}>{aside}</div>}
    </div>
  );
}

export default DetailsCardTitle;
