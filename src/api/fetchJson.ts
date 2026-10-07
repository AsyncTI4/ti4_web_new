type Fetcher = (url: string, init?: RequestInit) => Promise<Response>;

/** Fetches JSON, throwing `Failed to fetch <label>: <status>` on a non-2xx response. */
export async function fetchJson<T>(
  url: string,
  label: string,
  { init, fetcher = fetch }: { init?: RequestInit; fetcher?: Fetcher } = {},
): Promise<T> {
  const response = await fetcher(url, init);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch ${label}: ${response.status} ${response.statusText}`,
    );
  }
  return response.json() as Promise<T>;
}

/** Throws the response body as the message, or `fallback` when the body is empty or unreadable. */
export async function throwResponseError(
  response: Response,
  fallback: string,
): Promise<never> {
  const body = await response.text().catch(() => "");
  throw new Error(body || fallback);
}
