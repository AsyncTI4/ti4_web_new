import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

export type LocalUser = {
  id: string;
  authenticated: boolean;
  name?: string;
  token?: string;
  discord_id?: string;
};

export function getLocalUser(): LocalUser | null {
  const storedUser = localStorage.getItem("user");
  return storedUser ? (JSON.parse(storedUser) as LocalUser) : null;
}

export function setLocalUser(user: LocalUser): void {
  localStorage.setItem("user", JSON.stringify(user));
}

export function useUser(): { user: LocalUser | null; resetUser: () => void } {
  const [user, setUser] = useState<LocalUser | null>(getLocalUser());

  useEffect(() => {
    if (user) return;

    const newUser: LocalUser = {
      id: uuidv4(),
      authenticated: false,
    };
    localStorage.setItem("user", JSON.stringify(newUser));
    setUser(newUser);
  }, [user]);

  const resetUser = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return { user, resetUser };
}
