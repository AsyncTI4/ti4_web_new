/** Maps each item by `key`; later items win on duplicate keys. */
export function indexBy<T, K>(
  items: readonly T[],
  key: (item: T) => K,
): Map<K, T> {
  return new Map(items.map((item) => [key(item), item]));
}

/** Groups items by `key` in source order, skipping items whose key is undefined. */
export function groupBy<T, K>(
  items: readonly T[],
  key: (item: T) => K | undefined | null,
): Map<K, T[]> {
  const groups = new Map<K, T[]>();
  for (const item of items) {
    const groupKey = key(item);
    if (groupKey === undefined || groupKey === null) continue;
    const group = groups.get(groupKey);
    if (group) group.push(item);
    else groups.set(groupKey, [item]);
  }
  return groups;
}
