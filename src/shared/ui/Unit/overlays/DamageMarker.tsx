import React, { useLayoutEffect, useRef } from "react";
import { cdnImage } from "@/entities/data/cdnImage";

type DamageMarkerProps = {
  show: boolean | undefined;
  alt: string;
  delayMs?: number;
};

export function DamageMarker(
  props: DamageMarkerProps,
): React.ReactElement | null {
  const { show, alt, delayMs } = props;
  const markerRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const marker = markerRef.current;
    if (!marker || delayMs === undefined) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      marker.style.opacity = "1";
      return;
    }
    const animation = marker.animate([{ opacity: 0 }, { opacity: 1 }], {
      delay: delayMs,
      duration: 320,
      easing: "ease-out",
      fill: "forwards",
    });
    return () => animation.cancel();
  }, [show, delayMs]);

  if (!show) return null;
  return (
    <span
      ref={markerRef}
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        zIndex: 1,
        display: "block",
        pointerEvents: "none",
        transform: "translate(-50%, -50%) translateZ(0)",
        backfaceVisibility: "hidden",
        opacity: delayMs === undefined ? 1 : 0,
        willChange: delayMs === undefined ? undefined : "opacity",
      }}
    >
      <img
        src={cdnImage(`/extra/marker_damage.png`)}
        alt={alt}
        style={{ display: "block" }}
      />
    </span>
  );
}
