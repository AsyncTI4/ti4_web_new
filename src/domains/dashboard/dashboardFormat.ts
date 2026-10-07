export function formatPercent(value: number | null) {
  return value == null ? "N/A" : `${value.toFixed(1)}%`;
}

export function formatRatio(value: number | null) {
  return value == null ? "N/A" : `${value.toFixed(2)}x`;
}

export function formatDate(value: number | null) {
  if (value == null) return "N/A";
  return new Date(value).toLocaleDateString();
}

export function gameCountLabel(count: number) {
  return `${count} game${count === 1 ? "" : "s"}`;
}
