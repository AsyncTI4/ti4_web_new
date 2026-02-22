import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

const AUTH_VERSION = "v1";
const AUTH_VERSION_KEY = "auth_version";

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
    localStorage.removeItem("user");
    localStorage.setItem(AUTH_VERSION_KEY, AUTH_VERSION);
    return null;
  }

  const storedUser = localStorage.getItem("user");
  return storedUser ? (JSON.parse(storedUser) as LocalUser) : null;
}

export function setLocalUser(user: LocalUser): void {
  localStorage.setItem("user", JSON.stringify(user));
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

  const resetUser = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return { user, resetUser };
}
