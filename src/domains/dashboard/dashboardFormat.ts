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

/** Compact age for lane tables: "now", "12m", "3h", "4d", "6w". */
export function formatAgo(epochMs: number | null, now = Date.now()) {
  if (epochMs == null) return "";
  const minutes = Math.max(0, Math.floor((now - epochMs) / 60000));
  if (minutes < 1) return "now";
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 14) return `${days}d`;
  return `${Math.floor(days / 7)}w`;
}
