import { config } from "@/config";

export function getBotApiUrl(endpoint: string): string {
  const baseUrl = config.api.botApiUrl;
  return `${baseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
}
