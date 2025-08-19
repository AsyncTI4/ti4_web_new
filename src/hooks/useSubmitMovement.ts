import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { useUser } from "./useUser";

export type MovementPayload = {
  targetPosition: string;
  displacement: Record<
    string,
    { unitType: string; colorID: string; counts: [number, number] }[]
  >;
};

async function postMovement(
  gameId: string,
  payload: MovementPayload,
  token: string
) {
  const apiUrl = import.meta.env.DEV
    ? `/bot/api/game/${gameId}/movement`
    : `https://bot.asyncti4.com/api/game/${gameId}/movement`;

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message = await safeErrorMessage(response);
    throw new Error(message);
  }
}

async function safeErrorMessage(response: Response): Promise<string> {
  try {
    const data = await response.json();
    return (
      data?.message ||
      `Request failed: ${response.status} ${response.statusText}`
    );
  } catch {
    return `Request failed: ${response.status} ${response.statusText}`;
  }
}

export function useSubmitMovement(
  gameId: string,
  options?: {
    onSuccess?: () => void;
    onError?: (error: unknown) => void;
  }
): UseMutationResult<void, unknown, MovementPayload> {
  const { user } = useUser();

  return useMutation<void, unknown, MovementPayload>({
    mutationFn: (payload) => postMovement(gameId, payload, user!.token!),
    onSuccess: () => options?.onSuccess?.(),
    onError: (err) => options?.onError?.(err),
  });
}
