/** The JSON object stored under `key`, or null when missing, malformed or not an object. */
export function readStoredObject(key: string): Record<string, unknown> | null {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return null;

    const parsed = JSON.parse(stored) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return null;
    }
    return parsed as Record<string, unknown>;
  } catch (error) {
    console.warn("Failed to load settings from localStorage:", error);
    return null;
  }
}

/** Takes each default's stored value when present, ignoring unknown stored keys. */
export function mergeStoredSettings<T extends Record<string, unknown>>(
  stored: Record<string, unknown> | null,
  defaults: T,
): T {
  if (!stored) return { ...defaults };
  return Object.fromEntries(
    Object.entries(defaults).map(([key, defaultValue]) => [
      key,
      Object.hasOwn(stored, key) ? stored[key] : defaultValue,
    ]),
  ) as T;
}

export function saveJsonSettings<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn("Failed to save settings to localStorage:", error);
  }
}

/** A string stored under its own key, or null when missing or not one of `accepted`. */
export function loadStoredChoice<T extends string>(
  key: string,
  accepted: readonly T[],
): T | null {
  try {
    const stored = localStorage.getItem(key);
    return accepted.find((value) => value === stored) ?? null;
  } catch {
    return null;
  }
}

export function saveStoredChoice(key: string, value: string, label: string) {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.warn(`Failed to save ${label} to localStorage:`, error);
  }
}
