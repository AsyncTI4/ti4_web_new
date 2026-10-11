import cx from "clsx";
import type { SpeakerImpact, EconomyProfile } from "../types";
import { DashBox } from "../DashboardParts";
import classes from "./AggregateCharts.module.css";

type Props = {
  impact?: SpeakerImpact;
  economy?: EconomyProfile;
};

function SpeakerImpactBox({ impact }: { impact: SpeakerImpact }) {
  const up = impact.deltaWinRate >= 0;
  const delta = `${up ? "+" : ""}${impact.deltaWinRate.toFixed(1)}%`;
  return (
    <DashBox label="Win rate as speaker" meta={delta}>
      <div className={classes.speaker}>
        <div className={classes.bucket}>
          <span className={classes.label}>Speaker</span>
          <span className={classes.readout}>{impact.speaker.winRate.toFixed(1)}%</span>
          <span className={classes.sub}>
            {impact.speaker.wins}W / {impact.speaker.games}G
          </span>
        </div>
        <div className={cx(classes.delta, up ? classes.up : classes.down)}>
          <span className={classes.readout}>{delta}</span>
          <span className={classes.label}>Delta</span>
        </div>
        <div className={classes.bucket}>
          <span className={classes.label}>Not speaker</span>
          <span className={classes.readout}>{impact.nonSpeaker.winRate.toFixed(1)}%</span>
          <span className={classes.sub}>
            {impact.nonSpeaker.wins}W / {impact.nonSpeaker.games}G
          </span>
        </div>
      </div>
    </DashBox>
  );
}

function EconomyBox({ economy }: { economy: EconomyProfile }) {
  return (
    <DashBox label="Spending" meta={`${economy.completedGamesConsidered} games`}>
      <div className={classes.economy}>
        <div>
          <span className={classes.label}>Average per game</span>
          <span className={classes.readout}>{economy.avgTotalExpenses.toFixed(1)}</span>
        </div>
        <div>
          <span className={classes.label}>Total spent</span>
          <span className={classes.readout}>
            {economy.totalExpensesSum.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </span>
        </div>
      </div>
    </DashBox>
  );
}

export function SpeakerEconomySection({ impact, economy }: Props) {
  if (!impact && !economy) return null;
  return (
    <div style={{ display: "grid", gap: 12, alignContent: "start" }}>
      {impact && <SpeakerImpactBox impact={impact} />}
      {economy && <EconomyBox economy={economy} />}
    </div>
  );
}
