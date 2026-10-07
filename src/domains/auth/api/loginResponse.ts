import type { LocalUser } from "@/hooks/useUser";

/** Token payload returned by both the login and refresh endpoints. */
export type LoginResponse = {
  user_id: string;
  discord_name: string;
  bearer_token: string;
  refresh_token: string;
  discord_id: string;
  expires_in: number;
};

export function toLocalUser(data: LoginResponse): LocalUser {
  return {
    id: data.user_id,
    name: data.discord_name,
    token: data.bearer_token,
    refreshToken: data.refresh_token,
    discord_id: data.discord_id,
    expiresIn: data.expires_in,
    authenticated: true,
  };
}
