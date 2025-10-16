import { getLocalUser } from "../hooks/useUser";
import { refreshToken } from "./refreshToken";

export async function authenticatedFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const user = getLocalUser();

  if (!user?.token) {
    throw new Error("No authentication token available");
  }

  // Add authorization header
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${user.token}`,
  };

  let response = await fetch(url, {
    ...options,
    headers,
  });

  // If we get a 401, try to refresh the token and retry once
  if (response.status === 401 && user.refreshToken) {
    const refreshedUser = await refreshToken();

    if (refreshedUser?.token) {
      // Retry the request with the new token
      const newHeaders = {
        ...options.headers,
        Authorization: `Bearer ${refreshedUser.token}`,
      };

      response = await fetch(url, {
        ...options,
        headers: newHeaders,
      });
    }
  }

  return response;
}
