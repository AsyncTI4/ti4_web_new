import { useQuery } from "@tanstack/react-query";
import { authenticatedFetch, getBotApiUrl } from "@/domains/auth/api";
import { DashboardResponse } from "@/domains/dashboard/types";
import { getLocalUser } from "./useUser";

export type DashboardError = {
  status: number;
  message: string;
};

async function fetchDashboard(): Promise<DashboardResponse> {
  const user = getLocalUser();
  if (!user?.token) {
    throw {
      status: 401,
      message: "Unauthorized",
    } as DashboardError;
  }

  const apiUrl = getBotApiUrl("/dashboard");
  const response = await authenticatedFetch(apiUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.status === 401) {
    const error: DashboardError = {
      status: 401,
      message: "Unauthorized",
    };
    throw error;
  }

  if (!response.ok) {
    throw new Error(
      `Failed to fetch dashboard: ${response.status} ${response.statusText}`,
    );
  }

  return response.json();
}

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboard,
    retry: false,
  });
}
