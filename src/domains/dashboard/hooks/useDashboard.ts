import { useQuery } from "@tanstack/react-query";
import { authenticatedFetch, getBotApiUrl } from "@/api/auth";
import { DashboardResponse } from "@/domains/dashboard/types";
import { getLocalUser } from "@/api/auth/useUser";

class DashboardError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "DashboardError";
    this.status = status;
  }
}

/** Authenticated GET that surfaces the HTTP status as a DashboardError. */
export async function fetchDashboardJson<T>(
  path: string,
  label: string,
): Promise<T> {
  const user = getLocalUser();
  if (!user?.token) {
    throw new DashboardError(401, "Unauthorized");
  }

  const response = await authenticatedFetch(getBotApiUrl(path));
  if (!response.ok) {
    throw new DashboardError(
      response.status,
      response.status === 401
        ? "Unauthorized"
        : `Failed to fetch ${label}: ${response.status} ${response.statusText}`,
    );
  }

  return response.json() as Promise<T>;
}

export function useDashboard() {
  return useQuery<DashboardResponse, DashboardError>({
    queryKey: ["dashboard"],
    queryFn: () =>
      fetchDashboardJson<DashboardResponse>("/dashboard", "dashboard"),
    retry: false,
  });
}
