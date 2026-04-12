import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

const AUTH_VERSION = "v1";
const AUTH_VERSION_KEY = "auth_version";
const USER_STORAGE_KEY = "user";
const AUTH_CHANGE_EVENT = "auth-change";

export type LocalUser = {
  id: string;
  authenticated: boolean;
  name?: string;
  token?: string;
  refreshToken?: string;
  discord_id?: string;
  expiresIn?: number;
};

export function getLocalUser(): LocalUser | null {
  const currentVersion = localStorage.getItem(AUTH_VERSION_KEY);

  if (currentVersion !== AUTH_VERSION) {
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.setItem(AUTH_VERSION_KEY, AUTH_VERSION);
    return null;
  }

  const storedUser = localStorage.getItem(USER_STORAGE_KEY);
  return storedUser ? (JSON.parse(storedUser) as LocalUser) : null;
}

function emitAuthChange(): void {
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

export function setLocalUser(user: LocalUser): void {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  emitAuthChange();
}

export function clearLocalUser(): void {
  localStorage.removeItem(USER_STORAGE_KEY);
  emitAuthChange();
}

function createAnonymousUser(): LocalUser {
  const newUser: LocalUser = {
    id: uuidv4(),
    authenticated: false,
  };
  setLocalUser(newUser);
  return newUser;
}

export function ensureLocalUser(): LocalUser {
  return getLocalUser() ?? createAnonymousUser();
}

export function useUser(): { user: LocalUser | null; resetUser: () => void } {
  const [user, setUser] = useState<LocalUser | null>(getLocalUser());

  useEffect(() => {
    if (user) return;
    setUser(ensureLocalUser());
  }, [user]);

  useEffect(() => {
    const syncUser = () => setUser(getLocalUser());
    const handleStorage = (event: StorageEvent) => {
      if (event.key === null || event.key === USER_STORAGE_KEY) {
        syncUser();
      }
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener(AUTH_CHANGE_EVENT, syncUser);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(AUTH_CHANGE_EVENT, syncUser);
    };
  }, []);

  const resetUser = () => {
    clearLocalUser();
  };

  return { user, resetUser };
}
