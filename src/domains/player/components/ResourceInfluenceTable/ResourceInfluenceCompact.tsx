import cx from "clsx";
import type { CSSProperties } from "react";
import { cdnImage } from "@/entities/data/cdnImage";
import styles from "./ResourceInfluenceCompact.module.css";

export type PlanetEconomics = {
  total: {
    currentResources: number;
    totalResources: number;
    currentInfluence: number;
    totalInfluence: number;
  };
  optimal: {
    currentResources: number;
    totalResources: number;
    currentInfluence: number;
    totalInfluence: number;
  };
  flex: {
    currentFlex: number;
    totalFlex: number;
  };
  flexSpendOnly?: boolean;
};

type Props = {
  planetEconomics: PlanetEconomics;
  showTotalSpend?: boolean;
};

type StatColor = "resource" | "influence" | "flex" | "total";

type StatRowProps = {
  kind: StatColor;
  current: number;
  total: number;
  currentWidth: string;
  totalWidth: string;
};

function padNumber(num: number): string {
  const rounded = Math.floor(num);
  return rounded < 10 ? ` ${rounded}` : `${rounded}`;
}

function getDigitWidths(values: Array<number | undefined>) {
  const resolved = values
    .filter((value): value is number => value !== undefined)
    .map((value) => Math.floor(value).toString().length);
  return `${Math.max(1, ...resolved)}ch`;
}

function StatRow({
  kind,
  current,
  total,
  currentWidth,
  totalWidth,
}: StatRowProps) {
  return (
    <div className={cx(styles.statRow, styles[kind])}>
      <span className={styles.current} style={{ minWidth: currentWidth }}>
        {padNumber(current)}
      </span>
      <span className={styles.total} style={{ minWidth: totalWidth }}>
        {Math.floor(total)}
      </span>
    </div>
  );
}

function TotalRow({
  current,
  total,
  currentWidth,
  totalWidth,
}: Omit<StatRowProps, "kind">) {
  return (
    <div className={cx(styles.statRow, styles.totalRow)}>
      <span className={styles.current} style={{ minWidth: currentWidth }}>
        {padNumber(current)}
      </span>
      <span className={styles.total} style={{ minWidth: totalWidth }}>
        {Math.floor(total)}
      </span>
    </div>
  );
}

type ColumnProps = {
  label: string;
  currentResources: number;
  totalResources: number;
  currentInfluence: number;
  totalInfluence: number;
  currentFlex?: number;
  totalFlex?: number;
  showFlex?: boolean;
  showTotal?: boolean;
  flexSpendOnly?: boolean;
};

function EconomicsColumn({
  label,
  currentResources,
  totalResources,
  currentInfluence,
  totalInfluence,
  currentFlex,
  totalFlex,
  showFlex = false,
  showTotal = true,
  flexSpendOnly = false,
}: ColumnProps) {
  const currentWidth = getDigitWidths([
    currentResources,
    currentInfluence,
    showFlex ? currentFlex : undefined,
  ]);
  const totalWidth = getDigitWidths([
    totalResources,
    totalInfluence,
    showFlex ? totalFlex : undefined,
  ]);

  if (flexSpendOnly) {
    return (
      <div className={styles.column}>
        <div className={styles.caption}>{label}</div>
        <StatRow
          kind="flex"
          current={currentFlex ?? 0}
          total={totalFlex ?? 0}
          currentWidth={getDigitWidths([currentFlex])}
          totalWidth={getDigitWidths([totalFlex])}
        />
      </div>
    );
  }

  return (
    <div className={styles.column}>
      <div className={styles.caption}>{label}</div>
      <StatRow
        kind="resource"
        current={currentResources}
        total={totalResources}
        currentWidth={currentWidth}
        totalWidth={totalWidth}
      />
      <StatRow
        kind="influence"
        current={currentInfluence}
        total={totalInfluence}
        currentWidth={currentWidth}
        totalWidth={totalWidth}
      />
      {showFlex && currentFlex !== undefined && totalFlex !== undefined ? (
        <StatRow
          kind="flex"
          current={currentFlex}
          total={totalFlex}
          currentWidth={currentWidth}
          totalWidth={totalWidth}
        />
      ) : (
        <div className={styles.hiddenRow} aria-hidden="true" />
      )}
      {showTotal && (
        <TotalRow
          current={
            currentResources +
            currentInfluence +
            (showFlex && currentFlex !== undefined ? currentFlex : 0)
          }
          total={
            totalResources +
            totalInfluence +
            (showFlex && totalFlex !== undefined ? totalFlex : 0)
          }
          currentWidth={currentWidth}
          totalWidth={totalWidth}
        />
      )}
    </div>
  );
}

export function ResourceInfluenceCompact({
  planetEconomics,
  showTotalSpend = true,
}: Props) {
  return (
    <div
      className={styles.compact}
      style={
        {
          "--resource-icon": `url("${cdnImage("/player_area/pa_resources.png")}")`,
        } as CSSProperties
      }
    >
      <EconomicsColumn
        label="Optimal"
        currentResources={planetEconomics.optimal.currentResources}
        totalResources={planetEconomics.optimal.totalResources}
        currentInfluence={planetEconomics.optimal.currentInfluence}
        totalInfluence={planetEconomics.optimal.totalInfluence}
        currentFlex={planetEconomics.flex.currentFlex}
        totalFlex={planetEconomics.flex.totalFlex}
        showFlex
        flexSpendOnly={planetEconomics.flexSpendOnly}
      />
      {showTotalSpend && (
        <EconomicsColumn
          label="Total"
          currentResources={planetEconomics.total.currentResources}
          totalResources={planetEconomics.total.totalResources}
          currentInfluence={planetEconomics.total.currentInfluence}
          totalInfluence={planetEconomics.total.totalInfluence}
          showFlex={false}
          showTotal={false}
        />
      )}
    </div>
  );
}
