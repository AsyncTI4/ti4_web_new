import classes from "./UnitDetailsCard.module.css";

type DiceProps = {
  count: number;
};

export function Dice({ count }: DiceProps) {
  if (count <= 1) return null;

  const renderDice = () => {
    switch (count) {
      case 2:
        return (
          <div className={classes.twoDice}>
            <div className={`${classes.diceCircle}`} />
            <div className={`${classes.diceCircle}`} />
          </div>
        );
      case 3:
        return (
          <div className={classes.threeDice}>
            <div className={`${classes.diceCircle} ${classes.threeDiceTop}`} />
            <div
              className={`${classes.diceCircle} ${classes.threeDiceBottomLeft}`}
            />
            <div
              className={`${classes.diceCircle} ${classes.threeDiceBottomRight}`}
            />
          </div>
        );
      case 4:
        return (
          <div className={classes.fourDice}>
            <div
              className={`${classes.diceCircle} ${classes.fourDiceTopLeft}`}
            />
            <div
              className={`${classes.diceCircle} ${classes.fourDiceTopRight}`}
            />
            <div
              className={`${classes.diceCircle} ${classes.fourDiceBottomLeft}`}
            />
            <div
              className={`${classes.diceCircle} ${classes.fourDiceBottomRight}`}
            />
          </div>
        );
      default:
        // For 5+ dice, fall back to horizontal line
        return (
          <div className={classes.twoDice}>
            {Array.from({ length: count }).map((_, index) => (
              <div key={index} className={`${classes.diceCircle}`} />
            ))}
          </div>
        );
    }
  };

  return <div className={classes.diceContainer}>{renderDice()}</div>;
}
