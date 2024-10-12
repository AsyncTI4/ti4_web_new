import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

export function getLocalUser() {
  const storedUser = localStorage.getItem("user");
  return storedUser ? JSON.parse(storedUser) : null;
}

export function setLocalUser(user) {
  localStorage.setItem("user", JSON.stringify(user));
}

export function useUser() {
  const [user, setUser] = useState(getLocalUser());

  useEffect(() => {
    if (user) return;

    const newUser = {
      id: uuidv4(),
      authenticated: false,
    };
    localStorage.setItem("user", JSON.stringify(newUser));
    setUser(newUser);
  }, []);

  const resetUser = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return { user, resetUser };
}
