import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

export type Settings = {
  overlaysEnabled: boolean;
  alwaysShowControlTokens: boolean;
  techSkipsMode: boolean;
  isLeftPanelCollapsed: boolean;
  isRightPanelCollapsed: boolean;
  showExhaustedPlanets: boolean;
};

const DEFAULT_SETTINGS: Settings = {
  overlaysEnabled: false,
  alwaysShowControlTokens: true,
  techSkipsMode: false,
  isLeftPanelCollapsed: false,
  isRightPanelCollapsed: false,
  showExhaustedPlanets: true,
};

const STORAGE_KEY = "ti4_settings";

function loadSettingsFromStorage(): Settings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_SETTINGS;

    const parsed = JSON.parse(stored);
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
    };
  } catch (error) {
    console.warn("Failed to load settings from localStorage:", error);
    return DEFAULT_SETTINGS;
  }
}

function saveSettingsToStorage(settings: Settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.warn("Failed to save settings to localStorage:", error);
  }
}

type SettingsContextValue = {
  settings: Settings;
  updateSettings: (updates: Partial<Settings>) => void;
  toggleOverlays: () => void;
  toggleAlwaysShowControlTokens: () => void;
  toggleTechSkipsMode: () => void;
  toggleLeftPanelCollapsed: () => void;
  toggleRightPanelCollapsed: () => void;
  toggleShowExhaustedPlanets: () => void;
};

const SettingsContext = createContext<SettingsContextValue | undefined>(
  undefined
);

type SettingsProviderProps = {
  children: ReactNode;
};

export function SettingsProvider({ children }: SettingsProviderProps) {
  const [settings, setSettings] = useState<Settings>(loadSettingsFromStorage);

  const updateSettings = useCallback((updates: Partial<Settings>) => {
    setSettings((prev) => {
      const newSettings = { ...prev, ...updates };
      saveSettingsToStorage(newSettings);
      return newSettings;
    });
  }, []);

  const toggleOverlays = useCallback(() => {
    updateSettings({ overlaysEnabled: !settings.overlaysEnabled });
  }, [settings.overlaysEnabled, updateSettings]);

  const toggleAlwaysShowControlTokens = useCallback(() => {
    updateSettings({
      alwaysShowControlTokens: !settings.alwaysShowControlTokens,
    });
  }, [settings.alwaysShowControlTokens, updateSettings]);

  const toggleTechSkipsMode = useCallback(() => {
    updateSettings({ techSkipsMode: !settings.techSkipsMode });
  }, [settings.techSkipsMode, updateSettings]);

  const toggleLeftPanelCollapsed = useCallback(() => {
    updateSettings({ isLeftPanelCollapsed: !settings.isLeftPanelCollapsed });
  }, [settings.isLeftPanelCollapsed, updateSettings]);

  const toggleRightPanelCollapsed = useCallback(() => {
    updateSettings({ isRightPanelCollapsed: !settings.isRightPanelCollapsed });
  }, [settings.isRightPanelCollapsed, updateSettings]);

  const toggleShowExhaustedPlanets = useCallback(() => {
    updateSettings({ showExhaustedPlanets: !settings.showExhaustedPlanets });
  }, [settings.showExhaustedPlanets, updateSettings]);

  const value: SettingsContextValue = {
    settings,
    updateSettings,
    toggleOverlays,
    toggleAlwaysShowControlTokens,
    toggleTechSkipsMode,
    toggleLeftPanelCollapsed,
    toggleRightPanelCollapsed,
    toggleShowExhaustedPlanets,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
