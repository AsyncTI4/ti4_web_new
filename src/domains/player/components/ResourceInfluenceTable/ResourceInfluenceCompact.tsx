import cx from "clsx";
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

type Kind = "resource" | "influence" | "flex";

/** The resource blob, the influence hex and the split flex hex. */
function EconomyGlyph({ kind }: { kind: Kind }) {
  if (kind === "resource") {
    return (
      <svg viewBox="0 0 20 20" className={cx(styles.glyph, styles.res)} aria-hidden="true">
        <path d="M10 1.8c2 0 3 1.3 4.6 1.8 1.7.5 3.6 1.5 3.6 4 0 1.6-.9 2.3-.9 3.6 0 1.7 1 2.6.3 4.4-.8 2-3 2.5-4.6 2.6-1.5.1-2.1 0-3 0s-1.5.1-3 0c-1.6-.1-3.8-.6-4.6-2.6-.7-1.8.3-2.7.3-4.4 0-1.3-.9-2-.9-3.6 0-2.5 1.9-3.5 3.6-4C7 3.1 8 1.8 10 1.8z" />
      </svg>
    );
  }
  if (kind === "influence") {
    return (
      <svg viewBox="0 0 20 20" className={cx(styles.glyph, styles.inf)} aria-hidden="true">
        <path d="M10 1.5 17.4 5.8v8.4L10 18.5 2.6 14.2V5.8z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 20 20" className={cx(styles.glyph, styles.flexGlyph)} aria-hidden="true">
      <path className={styles.inf} d="M10 1.5 17.4 5.8v8.4L10 18.5" />
      <path className={styles.res} d="M10 1.5 2.6 5.8v8.4l7.4 4.3" />
    </svg>
  );
}

const KIND_LABEL: Record<Kind, string> = {
  resource: "resources",
  influence: "influence",
  flex: "flex",
};

function LedgerRow({
  kind,
  current,
  total,
}: {
  kind: Kind;
  current: number;
  total: number;
}) {
  return (
    <div className={cx(styles.row, styles[kind])} title={`${current} of ${total} ${KIND_LABEL[kind]}`}>
      <EconomyGlyph kind={kind} />
      <dd>
        {Math.floor(current)}
        <span className={styles.of}>{Math.floor(total)}</span>
      </dd>
    </div>
  );
}

/**
 * Economy ledger: optimal spend on the left with its sum under a rule, totals
 * on the right. Resources are the yellow blob, influence the blue hex and flex
 * the split hex, matching the planet badges.
 */
export function ResourceInfluenceCompact({
  planetEconomics,
  showTotalSpend = true,
}: Props) {
  const { optimal, total, flex, flexSpendOnly } = planetEconomics;
  const sumCurrent =
    optimal.currentResources + optimal.currentInfluence + flex.currentFlex;
  const sumTotal =
    optimal.totalResources + optimal.totalInfluence + flex.totalFlex;

  return (
    <div className={cx(styles.econ, !showTotalSpend && styles.single)}>
      <span className={styles.lbl}>Optimal</span>
      {showTotalSpend && <span className={styles.lbl}>Total</span>}
      <dl>
        {!flexSpendOnly && (
          <>
            <LedgerRow
              kind="resource"
              current={optimal.currentResources}
              total={optimal.totalResources}
            />
            <LedgerRow
              kind="influence"
              current={optimal.currentInfluence}
              total={optimal.totalInfluence}
            />
          </>
        )}
        <LedgerRow kind="flex" current={flex.currentFlex} total={flex.totalFlex} />
        {!flexSpendOnly && (
          <div className={cx(styles.row, styles.sum)} title="Optimal spend">
            <span />
            <dd>
              {Math.floor(sumCurrent)}
              <span className={styles.of}>{Math.floor(sumTotal)}</span>
            </dd>
          </div>
        )}
      </dl>
      {showTotalSpend && (
        <dl>
          <LedgerRow
            kind="resource"
            current={total.currentResources}
            total={total.totalResources}
          />
          <LedgerRow
            kind="influence"
            current={total.currentInfluence}
            total={total.totalInfluence}
          />
        </dl>
      )}
    </div>
  );
}
