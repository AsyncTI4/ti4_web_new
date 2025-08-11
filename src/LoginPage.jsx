import { redirect, useLoaderData } from "react-router-dom";
import { getLocalUser, setLocalUser } from "./hooks/useUser";
import { config } from "./config";
import { v4 as uuidv4 } from "uuid";

async function login(code, userId) {
  const apiUrl = import.meta.env.DEV
    ? "/auth/login"
    : config.api.discordLoginUrl;

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code, user_id: userId }),
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
    const newUser = { id: uuidv4(), authenticated: false };
    setLocalUser(newUser);
    user = newUser;
  }

  if (code) {
    try {
      const data = await login(code, user.id);
      setLocalUser({
        id: data.user_id,
        name: data.discord_name,
        token: data.bearer_token,
        discord_id: data.discord_id,
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
