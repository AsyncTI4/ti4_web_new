import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const STORAGE_KEY = "activeTabs";

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

function readStoredTabs(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);

    return Array.isArray(parsed)
      ? parsed.filter((tab): tab is string => isNonEmptyString(tab))
      : [];
  } catch (error) {
    console.warn("Failed to parse stored active tabs", error);
    return [];
  }
}

function persistTabs(tabs: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tabs));
}

export function usePersistentGameTabs() {
  const navigate = useNavigate();
  const params = useParams<{ mapid?: string }>();
  const [activeTabs, setActiveTabs] = useState<string[]>([]);

  useEffect(() => {
    const storedTabs = readStoredTabs();
    const currentGame = params.mapid;
    const normalizedTabs = Array.from(
      new Set([...storedTabs, currentGame].filter(isNonEmptyString)),
    );
    setActiveTabs(normalizedTabs);
  }, [params.mapid]);

  useEffect(() => {
    if (activeTabs.length === 0) return;
    persistTabs(activeTabs);
  }, [activeTabs]);

  const changeTab = useCallback(
    (tab: string) => {
      if (!tab || tab === params.mapid) return;
      navigate(`/game/${tab}/newui`);
    },
    [navigate, params.mapid],
  );

  const removeTab = useCallback(
    (tabValue: string) => {
      setActiveTabs((current) => {
        const remaining = current.filter((tab) => tab !== tabValue);
        persistTabs(remaining);

        if (params.mapid === tabValue) {
          if (remaining.length > 0) {
            changeTab(remaining[0]);
          } else {
            navigate("/");
          }
        }

        return remaining;
      });
    },
    [changeTab, navigate, params.mapid],
  );

  return { activeTabs, changeTab, removeTab };
}

export type UsePersistentGameTabsReturn = ReturnType<
  typeof usePersistentGameTabs
>;
