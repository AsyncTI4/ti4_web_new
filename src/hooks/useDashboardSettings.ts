import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authenticatedFetch, getBotApiUrl } from "@/domains/auth/api";
import {
  type DashboardSettingsResponse,
  type DashboardSettingsUpdateRequest,
} from "@/domains/dashboard/userSettings";
import { getLocalUser } from "./useUser";
import type { DashboardError } from "./useDashboard";

async function fetchDashboardSettings(): Promise<DashboardSettingsResponse> {
  const user = getLocalUser();
  if (!user?.token) {
    throw {
      status: 401,
      message: "Unauthorized",
    } as DashboardError;
  }

  const response = await authenticatedFetch(getBotApiUrl("/dashboard/settings"), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.status === 401) {
    throw {
      status: 401,
      message: "Unauthorized",
    } as DashboardError;
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch dashboard settings: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

async function saveDashboardSettings(
  payload: DashboardSettingsUpdateRequest
): Promise<DashboardSettingsResponse> {
  const response = await authenticatedFetch(getBotApiUrl("/dashboard/settings"), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let body = "";
    try {
      body = await response.text();
    } catch {
      // ignore
    }
    throw new Error(body || `Failed to save dashboard settings: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export function useDashboardSettings() {
  return useQuery({
    queryKey: ["dashboard-settings"],
    queryFn: fetchDashboardSettings,
    retry: false,
  });
}

export function useSaveDashboardSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["dashboard-settings", "save"],
    mutationFn: saveDashboardSettings,
    onSuccess: (data) => {
      queryClient.setQueryData(["dashboard-settings"], data);
    },
  });
}
