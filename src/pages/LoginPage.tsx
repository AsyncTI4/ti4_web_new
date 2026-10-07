import { redirect, useLoaderData, type LoaderFunctionArgs } from "react-router-dom";
import { ensureLocalUser, setLocalUser } from "@/api/auth/useUser";
import { getBotApiUrl, toLocalUser, type LoginResponse } from "@/api/auth";

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

  return (await response.json()) as LoginResponse;
}

export async function loginLoader(
  { request }: LoaderFunctionArgs
): Promise<Response | LoginLoaderData | null> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const user = ensureLocalUser();
  if (!code) return null;

  try {
    const data = await login(code, user.id);
    setLocalUser(toLocalUser(data));
    return redirect("/");
  } catch {
    return { error: "Login failed. Please try again." };
  }
}

function LoginPage() {
  const loaderData = useLoaderData() as LoginLoaderData | null;

  if (loaderData?.error) {
    return <div>{loaderData.error}</div>;
  }

  return <div>LoginScreen</div>;
}

export default LoginPage;
