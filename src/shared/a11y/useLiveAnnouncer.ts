import { useCallback, useEffect, useRef } from "react";

type Mode = "polite" | "assertive";

export function useLiveAnnouncer(mode: Mode = "polite") {
  const regionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const region = document.createElement("div");
    region.setAttribute("role", "status");
    region.setAttribute("aria-live", mode);
    region.setAttribute("aria-atomic", "true");
    region.style.position = "fixed";
    region.style.width = "1px";
    region.style.height = "1px";
    region.style.margin = "-1px";
    region.style.border = "0";
    region.style.padding = "0";
    region.style.clip = "rect(0 0 0 0)";
    region.style.overflow = "hidden";
    region.style.whiteSpace = "nowrap";
    document.body.appendChild(region);
    regionRef.current = region;
    return () => {
      try {
        document.body.removeChild(region);
      } catch (err) {
        // ignore
      }
    };
  }, [mode]);

  const announce = useCallback((message: string) => {
    const region = regionRef.current;
    if (!region) return;
    // Clear first to ensure screen readers re-announce identical messages
    region.textContent = "";
    // Minor delay can improve reliability across SRs
    setTimeout(() => {
      region.textContent = message;
    }, 10);
  }, []);

  return { announce } as const;
}
