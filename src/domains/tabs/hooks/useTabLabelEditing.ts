import {
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type RefObject,
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
  inputRef: RefObject<HTMLInputElement | null>;
  getDisplayName: (tabId: string) => string;
  toggleEditing: (tabId: string, event?: MouseEvent) => void;
  handleInputKeyDown: (tabId: string, event: KeyboardEvent<HTMLInputElement>) => void;
  handleInputBlur: (tabId: string, event: FocusEvent<HTMLInputElement>) => void;
};

export function useTabLabelEditing(): TabLabelEditingApi {
  const [editingTabId, setEditingTabId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const getDisplayName = (tabId: string) => safeGetTabName(tabId) || tabId;

  const saveTabName = (tabId: string, value: string) => {
    safeSetTabName(tabId, value);
    setEditingTabId(null);
  };

  const toggleEditing = (tabId: string, event?: MouseEvent) => {
    event?.stopPropagation();
    if (editingTabId !== tabId) {
      setEditingTabId(tabId);
      return;
    }
    if (!inputRef.current) {
      setEditingTabId(null);
      return;
    }
    saveTabName(tabId, inputRef.current.value);
  };

  const handleInputKeyDown = (
    tabId: string,
    event: KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Enter") saveTabName(tabId, event.currentTarget.value);
    if (event.key === "Escape") saveTabName(tabId, tabId);
  };

  const handleInputBlur = (
    tabId: string,
    event: FocusEvent<HTMLInputElement>,
  ) => saveTabName(tabId, event.currentTarget.value);

  return {
    editingTabId,
    inputRef,
    getDisplayName,
    toggleEditing,
    handleInputKeyDown,
    handleInputBlur,
  };
}
