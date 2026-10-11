import cx from "clsx";
import type { TitleSummary } from "./types";
import { DashBox } from "./DashboardParts";
import classes from "./DashboardPage.module.css";

const NUMERALS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
const MEDAL_CLASSES = [classes.medalGold, classes.medalSilver, classes.medalBronze];

/** Earned titles as medals, most-earned first. */
export function TitlesCard({ titles }: { titles: TitleSummary }) {
  const items = [...titles.items].sort((a, b) => b.count - a.count);
  return (
    <DashBox label="Titles" meta={titles.totalCount}>
      {items.length === 0 && (
        <div className={classes.boxEmpty}>No titles yet. They are awarded at the end of a game.</div>
      )}
      {items.length > 0 && (
        <div className={classes.titles}>
          {items.map((item, index) => (
            <div
              key={item.title}
              className={classes.title}
              title={item.gameIds.join(" · ")}
            >
              <span className={cx(classes.medal, MEDAL_CLASSES[index])}>
                {NUMERALS[index] ?? "·"}
              </span>
              <span>{item.title}</span>
              <small>×{item.count}</small>
            </div>
          ))}
        </div>
      )}
    </DashBox>
  );
}
