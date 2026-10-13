import styles from "./Leader.module.css";

const RANK = { agent: 1, commander: 2, hero: 3 } as const;

/** Rank stripes in the plate's top-right corner: one, two or three chevrons. */
export function RankChevrons({ type }: { type: keyof typeof RANK }) {
  const count = RANK[type];
  return (
    <svg
      className={styles.rank}
      width="10"
      height={2 + count * 4}
      viewBox={`0 0 10 ${2 + count * 4}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {Array.from({ length: count }, (_, i) => (
        <path key={i} d={`M1.5 ${i * 4 + 5}L5 ${i * 4 + 1.5}L8.5 ${i * 4 + 5}`} />
      ))}
    </svg>
  );
}
