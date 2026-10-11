import type { CSSProperties } from "react";
import styles from "./CardDetailsModal.module.css";

const NOTE = /(\[Note:[^\]]*\])/i;

/** Rulings appended to card text in brackets read as quieter asides. */
function CardText({ text }: { text: string }) {
  const parts = text.split(NOTE);
  return parts.map((part, index) =>
    NOTE.test(part) ? <i key={index}>{part}</i> : part,
  );
}

type CardItemData = {
  name: string;
  count: number;
  text: string;
  percentage?: number;
};

type CardSectionData = {
  title: string;
  count: number;
  items: CardItemData[];
};

type Props = {
  sections: CardSectionData[];
  showCounts?: boolean;
  /** Signal colour of the deck, as a space-separated rgb triplet token. */
  tone?: string;
};

export function DeckEntry({
  name,
  count,
  text,
  percentage,
  showCount,
}: CardItemData & { showCount: boolean }) {
  return (
    <div className={styles.entry}>
      <div className={styles.entryHead}>
        <b className={styles.entryName}>
          {name}
          {showCount && count > 1 && <span className={styles.copies}> ×{count}</span>}
        </b>
        {percentage !== undefined && (
          <span className={styles.percentage} title="Chance to draw next">
            {percentage.toFixed(1)}%
          </span>
        )}
      </div>
      <p className={styles.entryText}>
        <CardText text={text} />
      </p>
    </div>
  );
}

export function DeckGroup({
  title,
  count,
  children,
  tone,
}: {
  title: string;
  count: number;
  children: React.ReactNode;
  tone?: string;
}) {
  const style = tone ? ({ "--dk": tone } as CSSProperties) : undefined;
  return (
    <section className={styles.group} style={style}>
      <span className={styles.groupLabel}>
        <span>{title}</span>
        <span className={styles.groupCount}>{count}</span>
      </span>
      {children}
    </section>
  );
}

export function DeckList({ children, tone }: { children: React.ReactNode; tone?: string }) {
  const style = tone ? ({ "--dk": tone } as CSSProperties) : undefined;
  return (
    <div className={styles.container} style={style}>
      {children}
    </div>
  );
}

export function CardDetailsModal({ sections, showCounts = true, tone }: Props) {
  const visibleSections = sections.filter((section) => section.items.length > 0);

  return (
    <DeckList tone={tone}>
      {visibleSections.map((section) => (
        <DeckGroup key={section.title} title={section.title} count={section.count}>
          {section.items.map((item) => (
            <DeckEntry key={item.name} {...item} showCount={showCounts} />
          ))}
        </DeckGroup>
      ))}
    </DeckList>
  );
}
