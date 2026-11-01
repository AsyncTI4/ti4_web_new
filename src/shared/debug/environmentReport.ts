import { getLocalUser } from "@/api/auth/useUser";
import { APP_VERSION } from "@/shared/version";

/** Lines describing the app build, the page and the browser, for debug reports. */
export function environmentReportLines(): string[] {
  const user = getLocalUser();
  const loggedIn = Boolean(user?.authenticated && user?.token);
  return [
    `App version: ${APP_VERSION}`,
    `Generated at: ${new Date().toISOString()}`,
    `URL: ${window.location.href}`,
    `Viewport: ${window.innerWidth}x${window.innerHeight} @${window.devicePixelRatio}x`,
    `User agent: ${navigator.userAgent}`,
    `Logged in: ${
      loggedIn
        ? `yes (${user?.name ?? "unknown name"}, discord id ${user?.discord_id ?? "?"})`
        : "no"
    }`,
  ];
}

/** The report copied from pages without game data. */
export function buildBasicDebugReport(): string {
  return ["=== ASYNC TI4 WEB DEBUG REPORT ===", ...environmentReportLines()].join(
    "\n",
  );
}

/** Copies text to the clipboard, falling back to execCommand where the API is missing. */
export async function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      // Fall through to the legacy path (e.g. non-secure context).
    }
  }
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  const ok = document.execCommand("copy");
  document.body.removeChild(textarea);
  if (!ok) throw new Error("Clipboard copy failed");
}
