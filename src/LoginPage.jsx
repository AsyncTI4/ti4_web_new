import { redirect, useLoaderData } from "react-router-dom";
import {
  ensureLocalUser,
  getLocalUser,
  setLocalUser,
} from "./hooks/useUser";
import { getBotApiUrl } from "./api";

async function login(code, userId) {
  const apiUrl = getBotApiUrl("/public/auth/login");

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code, userId }),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  const data = await response.json();
  return data;
}

export async function loginLoader({ request }) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  let user = getLocalUser();
  if (!user) {
    user = ensureLocalUser();
  }

  if (code) {
    try {
      const data = await login(code, user.id);
      setLocalUser({
        id: data.user_id,
        name: data.discord_name,
        token: data.bearer_token,
        refreshToken: data.refresh_token,
        discord_id: data.discord_id,
        expiresIn: data.expires_in,
        authenticated: true,
      });

      return redirect("/");
    } catch (error) {
      return { error: "Login failed. Please try again." };
    }
  }

  return null;
}

function LoginPage() {
  const loaderData = useLoaderData();

  if (loaderData?.error) {
    return <div>{loaderData.error}</div>;
  }

  // ... rest of the component (e.g., login button or instructions)
  return <div>LoginScreen</div>;
}

export default LoginPage;
