import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authenticatedFetch, getBotApiUrl } from "@/api/auth";
import {
  type DashboardSettingsResponse,
  type DashboardSettingsUpdateRequest,
} from "@/domains/dashboard/userSettings";
import { throwResponseError } from "@/api/fetchJson";
import { fetchDashboardJson } from "./useDashboard";

async function saveDashboardSettings(
  payload: DashboardSettingsUpdateRequest,
): Promise<DashboardSettingsResponse> {
  const response = await authenticatedFetch(
    getBotApiUrl("/dashboard/settings"),
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    await throwResponseError(
      response,
      `Failed to save dashboard settings: ${response.status} ${response.statusText}`,
    );
  }

  return response.json() as Promise<DashboardSettingsResponse>;
}

export function useDashboardSettings() {
  return useQuery({
    queryKey: ["dashboard-settings"],
    queryFn: () =>
      fetchDashboardJson<DashboardSettingsResponse>(
        "/dashboard/settings",
        "dashboard settings",
      ),
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
