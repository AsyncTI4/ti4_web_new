import { redirect, useLoaderData, type LoaderFunctionArgs } from "react-router-dom";
import {
  ensureLocalUser,
  getLocalUser,
  setLocalUser,
} from "./hooks/useUser";
import { getBotApiUrl } from "@/domains/auth/api";

type LoginResponse = {
  user_id: string;
  discord_name: string;
  bearer_token: string;
  refresh_token: string;
  discord_id: string;
  expires_in: number;
};

type LoginLoaderData = {
  error: string;
};

async function login(code: string, userId: string): Promise<LoginResponse> {
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

  const data = (await response.json()) as LoginResponse;
  return data;
}

export async function loginLoader(
  { request }: LoaderFunctionArgs
): Promise<Response | LoginLoaderData | null> {
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
    } catch {
      return { error: "Login failed. Please try again." };
    }
  }

  return null;
}

function LoginPage() {
  const loaderData = useLoaderData() as LoginLoaderData | null;

  if (loaderData?.error) {
    return <div>{loaderData.error}</div>;
  }

  // ... rest of the component (e.g., login button or instructions)
  return <div>LoginScreen</div>;
}

export default LoginPage;
