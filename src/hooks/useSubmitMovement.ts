import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { authenticatedFetch, getBotApiUrl } from "../api";

export type MovementPayload = {
  targetPosition: string;
  displacement: Record<
    string,
    { unitType: string; colorID: string; counts: [number, number] }[]
  >;
};

async function postMovement(gameId: string, payload: MovementPayload) {
  const apiUrl = getBotApiUrl(`/game/${gameId}/movement`);

  const response = await authenticatedFetch(apiUrl, {
    method: "POST",
    headers: {
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
  return useMutation<void, unknown, MovementPayload>({
    mutationFn: (payload) => postMovement(gameId, payload),
    onSuccess: () => options?.onSuccess?.(),
    onError: (err) => options?.onError?.(err),
  });
}
