/** Lowercase, accent-free, punctuation as spaces: "N'orr" reads as "n orr". */
export function normalizeSearchText(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function toTerms(values: (string | null | undefined)[]) {
  const terms = values
    .filter((value): value is string => !!value)
    .map(normalizeSearchText)
    .filter(Boolean);
  return [...new Set(terms)];
}
