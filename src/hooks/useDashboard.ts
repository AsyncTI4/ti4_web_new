import { useQuery } from "@tanstack/react-query";
import { authenticatedFetch, getBotApiUrl } from "@/domains/auth/api";
import { DashboardResponse } from "@/domains/dashboard/types";
import { getLocalUser } from "./useUser";

export class DashboardError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "DashboardError";
    this.status = status;
  }
};

async function fetchDashboard(): Promise<DashboardResponse> {
  const user = getLocalUser();
  if (!user?.token) {
    throw new DashboardError(401, "Unauthorized");
  }

  const apiUrl = getBotApiUrl("/dashboard");
  const response = await authenticatedFetch(apiUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new DashboardError(
        response.status,
        response.status === 401
            ? "Unauthorized"
            : `Failed to fetch dashboard: ${response.status} ${response.statusText}`,
    );
  }

  const data = (await response.json()) as unknown;
  return data as DashboardResponse;
}

export function useDashboard() {
  return useQuery<DashboardResponse, DashboardError>({
    queryKey: ["dashboard"],
    queryFn: fetchDashboard,
    retry: false,
  });
}
