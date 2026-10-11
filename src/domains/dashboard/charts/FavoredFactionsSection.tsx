import ReactEChartsCore from "echarts-for-react/lib/core";
import * as echarts from "echarts/core";
import { BarChart } from "echarts/charts";
import {
  GridComponent,
  LegendComponent,
  TooltipComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import type { FavoredFaction } from "../types";
import { CircularFactionIcon } from "@/shared/ui/CircularFactionIcon/CircularFactionIcon";
import { DashBox } from "../DashboardParts";
import { useChartTheme } from "./chartTheme";
import classes from "./AggregateCharts.module.css";

echarts.use([BarChart, GridComponent, LegendComponent, TooltipComponent, CanvasRenderer]);

type Props = { factions: FavoredFaction[] };

export function FavoredFactionsSection({ factions }: Props) {
  const theme = useChartTheme();
  if (factions.length === 0) return null;

  const labels = factions.map((f) => f.faction);
  const gamesData = factions.map((f) => f.gamesPlayed);
  const winsData = factions.map((f) => f.wins);

  const option: echarts.EChartsCoreOption = {
    tooltip: { trigger: "axis", ...theme.tooltip },
    legend: {
      top: 0,
      right: 0,
      itemWidth: 8,
      itemHeight: 8,
      textStyle: { color: theme.inkLo, fontFamily: theme.font, fontSize: 10 },
    },
    grid: { top: 22, left: 6, right: 6, bottom: 2, containLabel: true },
    xAxis: {
      type: "category",
      data: labels,
      ...theme.axis,
      axisLabel: { ...theme.axis.axisLabel, fontSize: 9 },
    },
    yAxis: {
      type: "value",
      minInterval: 1,
      ...theme.axis,
    },
    series: [
      {
        name: "Games",
        type: "bar",
        data: gamesData,
        itemStyle: {
          color: theme.hair(0.35),
          borderRadius: [2, 2, 0, 0],
        },
        barWidth: "32%",
        barGap: "10%",
      },
      {
        name: "Wins",
        type: "bar",
        data: winsData,
        itemStyle: {
          color: theme.sig("ok", 0.75),
          borderRadius: [2, 2, 0, 0],
        },
        barWidth: "32%",
      },
    ],
  };

  return (
    <DashBox label="Most played factions" meta={`${factions.length} factions`}>
      <div className={classes.chartWrap}>
        <ReactEChartsCore
          echarts={echarts}
          option={option}
          style={{ height: 180, width: "100%" }}
          opts={{ renderer: "canvas" }}
        />
      </div>
      <div className={classes.tableWrap}>
        <table className={classes.dataTable}>
          <thead>
            <tr>
              <th>Faction</th>
              <th className={classes.alignRight}>Games</th>
              <th className={classes.alignRight}>Wins</th>
              <th className={classes.alignRight}>Win %</th>
            </tr>
          </thead>
          <tbody>
            {factions.map((f) => (
              <tr key={f.faction}>
                <td className={classes.cellText}>
                  <span className={classes.factionCell}>
                    <CircularFactionIcon faction={f.faction} size={14} />
                    {f.faction}
                  </span>
                </td>
                <td className={classes.alignRight}>{f.gamesPlayed}</td>
                <td className={classes.alignRight}>{f.wins}</td>
                <td className={classes.alignRight}>
                  {f.winPercent != null ? `${f.winPercent.toFixed(1)}%` : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashBox>
  );
}
