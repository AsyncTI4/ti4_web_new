import {
  clearLocalUser,
  getLocalUser,
  setLocalUser,
  type LocalUser,
} from "@/api/auth/useUser";
import { getBotApiUrl } from "./botApiUrl";
import { toLocalUser, type LoginResponse } from "./loginResponse";

let inFlightRefresh: Promise<LocalUser | null> | null = null;

export async function refreshToken(): Promise<LocalUser | null> {
  if (inFlightRefresh) {
    return inFlightRefresh;
  }

  inFlightRefresh = performRefresh();
  try {
    return await inFlightRefresh;
  } finally {
    inFlightRefresh = null;
  }
}

async function performRefresh(): Promise<LocalUser | null> {
  const user = getLocalUser();

  if (!user?.refreshToken || !user.authenticated) {
    return null;
  }

  const apiUrl = getBotApiUrl("/public/auth/refresh");

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: user.id,
        refresh_token: user.refreshToken,
      }),
    });

    if (!response.ok) {
      throw new Error("Token refresh failed");
    }

    const updatedUser = toLocalUser((await response.json()) as LoginResponse);

    setLocalUser(updatedUser);
    return updatedUser;
  } catch (error) {
    console.error("Token refresh failed:", error);
    clearLocalUser();
    return null;
  }
}
