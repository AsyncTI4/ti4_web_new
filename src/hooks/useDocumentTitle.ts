import { useEffect } from "react";

/**
 * Keeps the browser tab title in sync with the provided value.
 */
export function useDocumentTitle(
  title?: string | null,
  fallbackTitle?: string | null,
) {
  useEffect(() => {
    const nextTitle = title ?? fallbackTitle;
    if (!nextTitle) return;
    document.title = nextTitle;
  }, [title, fallbackTitle]);
}

