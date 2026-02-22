export function loadJsonSettings<T extends Record<string, unknown>>(
  key: string,
  defaults: T
): T {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return defaults;

    const parsed = JSON.parse(stored);
    return {
      ...defaults,
      ...parsed,
    } as T;
  } catch (error) {
    console.warn("Failed to load settings from localStorage:", error);
    return defaults;
  }
}

export function saveJsonSettings<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn("Failed to save settings to localStorage:", error);
  }
}
