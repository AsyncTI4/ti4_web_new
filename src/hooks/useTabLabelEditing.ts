import {
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type RefObject,
  useCallback,
  useRef,
  useState,
} from "react";

function safeGetTabName(tabId: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(tabId);
  } catch {
    return null;
  }
}

function safeSetTabName(tabId: string, value: string): void {
  if (typeof window === "undefined") return;
  if (tabId === value) return;
  try {
    window.localStorage.setItem(tabId, value);
  } catch {
    // ignore write failures (Safari private mode, etc.)
  }
}

export type TabLabelEditingApi = {
  editingTabId: string | null;
  inputRef: RefObject<HTMLInputElement>;
  getDisplayName: (tabId: string) => string;
  toggleEditing: (tabId: string, event?: MouseEvent) => void;
  handleInputKeyDown: (tabId: string, event: KeyboardEvent<HTMLInputElement>) => void;
  handleInputBlur: (tabId: string, event: FocusEvent<HTMLInputElement>) => void;
};

export function useTabLabelEditing(): TabLabelEditingApi {
  const [editingTabId, setEditingTabId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const getDisplayName = useCallback((tabId: string) => {
    return safeGetTabName(tabId) || tabId;
  }, []);

  const saveTabName = useCallback((tabId: string, value: string) => {
    safeSetTabName(tabId, value);
    setEditingTabId(null);
  }, []);

  const toggleEditing = useCallback(
    (tabId: string, event?: MouseEvent) => {
      event?.stopPropagation();
      if (editingTabId === tabId) {
        if (inputRef.current) {
          saveTabName(tabId, inputRef.current.value);
        } else {
          setEditingTabId(null);
        }
      } else {
        setEditingTabId(tabId);
      }
    },
    [editingTabId, saveTabName],
  );

  const handleInputKeyDown = useCallback(
    (tabId: string, event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        saveTabName(tabId, event.currentTarget.value);
      } else if (event.key === "Escape") {
        saveTabName(tabId, tabId);
      }
    },
    [saveTabName],
  );

  const handleInputBlur = useCallback(
    (tabId: string, event: FocusEvent<HTMLInputElement>) => {
      saveTabName(tabId, event.currentTarget.value);
    },
    [saveTabName],
  );

  return {
    editingTabId,
    inputRef,
    getDisplayName,
    toggleEditing,
    handleInputKeyDown,
    handleInputBlur,
  };
}
