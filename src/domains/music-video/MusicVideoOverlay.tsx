import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { IconX } from "@tabler/icons-react";
import { MUSIC_VIDEO_PAGE, isMusicVideoMessage, type AppToFrame, type FrameToApp } from "@/music-video/protocol";
import type { MusicVideoCast } from "@/music-video/cast";
import classes from "./MusicVideoOverlay.module.css";

type Phase = "takeover" | "reveal" | "playing" | "closing";
export type Point = { x: number; y: number };

const HEX_R = 70;
const WAVE_MS = 900;
/** The reveal can start once the ripple has had this long to sweep (if the page is ready by then). */
const MIN_TAKEOVER_MS = 480;
const REVEAL_MS = 1000;
const CLOSE_MS = 700;

/** Flat-top hex lattice covering the viewport, each cell tagged with its distance from the origin. */
function useHexCells(origin: Point) {
  return useMemo(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const dx = HEX_R * 1.5;
    const dy = HEX_R * Math.sqrt(3);
    const cells: { x: number; y: number; d: number }[] = [];
    for (let c = -1; c <= Math.ceil(w / dx) + 1; c++) {
      for (let r = -1; r <= Math.ceil(h / dy) + 1; r++) {
        const x = c * dx;
        const y = r * dy + (c % 2 ? dy / 2 : 0);
        cells.push({ x, y, d: Math.hypot(x - origin.x, y - origin.y) });
      }
    }
    const maxD = Math.max(...cells.map((cell) => cell.d));
    return { cells, maxD };
  }, [origin.x, origin.y]);
}

const HEX_POINTS = Array.from({ length: 6 }, (_, i) => {
  const a = (i * Math.PI) / 3;
  return `${(Math.cos(a) * HEX_R * 0.94).toFixed(1)},${(Math.sin(a) * HEX_R * 0.94).toFixed(1)}`;
}).join(" ");

/**
 * The music video takes over the board: a tactical-activation hex wave ripples out
 * from the toolbar button across the live map, the map dims and pushes in, and the
 * animation (an isolated iframe, so its styles and memory stay separate) bursts out
 * of the button in a radial reveal. Closing collapses it back into the button.
 */
export function MusicVideoOverlay({ origin, cast, onClose }: { origin: Point; cast: MusicVideoCast; onClose: () => void }) {
  const [phase, setPhase] = useState<Phase>("takeover");
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [waveDone, setWaveDone] = useState(false);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const { cells, maxD } = useHexCells(origin);
  const cover = Math.hypot(Math.max(origin.x, window.innerWidth - origin.x), Math.max(origin.y, window.innerHeight - origin.y));

  // Dim and push in the live app behind us; hide it entirely once the video covers it.
  useEffect(() => {
    const app = document.getElementById("root");
    if (!app) return;
    // The push-in overflows the page; without this, always-on scrollbars frame the video.
    const html = document.documentElement;
    const previousOverflow = html.style.overflow;
    html.style.overflow = "hidden";
    app.style.transition = `transform ${WAVE_MS}ms cubic-bezier(0.2, 0.8, 0.2, 1), filter ${WAVE_MS}ms ease-out`;
    app.style.transformOrigin = `${origin.x}px ${origin.y}px`;
    app.style.transform = "scale(1.035)";
    app.style.filter = "brightness(0.42) saturate(1.35)";
    return () => {
      app.style.visibility = "";
      app.style.transform = "";
      app.style.filter = "";
      window.setTimeout(() => {
        app.style.transition = "";
        app.style.transformOrigin = "";
        html.style.overflow = previousOverflow;
      }, WAVE_MS);
    };
  }, [origin.x, origin.y]);

  useEffect(() => {
    const app = document.getElementById("root");
    if (!app) return;
    if (phase === "playing") app.style.visibility = "hidden";
    if (phase === "closing") {
      app.style.visibility = "";
      app.style.transform = "";
      app.style.filter = "";
    }
  }, [phase]);

  useEffect(() => {
    const id = window.setTimeout(() => setWaveDone(true), MIN_TAKEOVER_MS);
    return () => window.clearTimeout(id);
  }, []);

  // Reveal as soon as the wave has swept and the frame has everything decoded.
  useEffect(() => {
    if (phase !== "takeover" || !ready || !waveDone) return;
    setPhase("reveal");
    const play: AppToFrame = { type: "ti4mv:play" };
    frameRef.current?.contentWindow?.postMessage(play, location.origin);
    frameRef.current?.focus();
  }, [phase, ready, waveDone]);

  useEffect(() => {
    if (phase !== "reveal") return;
    const id = window.setTimeout(() => setPhase("playing"), REVEAL_MS);
    return () => window.clearTimeout(id);
  }, [phase]);

  const castRef = useRef(cast);
  const closeRef = useRef(() => {});
  closeRef.current = () => {
    if (phase === "closing") return;
    setPhase("closing");
    window.setTimeout(onClose, CLOSE_MS);
  };

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== location.origin || event.source !== frameRef.current?.contentWindow) return;
      if (!isMusicVideoMessage<FrameToApp>(event.data)) return;
      const message = event.data;
      if (message.type === "ti4mv:hello") {
        const reply: AppToFrame = { type: "ti4mv:cast", cast: castRef.current };
        frameRef.current?.contentWindow?.postMessage(reply, location.origin);
      }
      if (message.type === "ti4mv:progress") setProgress(message.progress);
      if (message.type === "ti4mv:ready") setReady(true);
      if (message.type === "ti4mv:ended" || message.type === "ti4mv:close") closeRef.current();
    };
    // Keys pressed while the app has focus must not drive the map underneath.
    const onKey = (event: KeyboardEvent) => {
      event.stopImmediatePropagation();
      if (event.key === "Escape") closeRef.current();
    };
    window.addEventListener("message", onMessage);
    window.addEventListener("keydown", onKey, { capture: true });
    return () => {
      window.removeEventListener("message", onMessage);
      window.removeEventListener("keydown", onKey, { capture: true });
    };
  }, []);

  const revealed = phase === "reveal" || phase === "playing";
  const waiting = phase === "takeover" && waveDone && !ready;
  return createPortal(
    <div
      className={classes.root}
      data-phase={phase}
      role="dialog"
      aria-modal="true"
      aria-label="It's Your Turn, a music video"
      style={{ "--ox": `${origin.x}px`, "--oy": `${origin.y}px`, "--cover": `${cover}px` } as React.CSSProperties}
    >
      <div className={classes.dim} />
      <svg className={classes.hexes} data-waiting={waiting || undefined} width="100%" height="100%">
        {cells.map((cell, i) => (
          <polygon
            key={i}
            points={HEX_POINTS}
            transform={`translate(${cell.x.toFixed(1)} ${cell.y.toFixed(1)})`}
            style={{ animationDelay: `${Math.round((phase === "closing" ? 1 - cell.d / maxD : cell.d / maxD) * WAVE_MS * 0.7)}ms` }}
          />
        ))}
      </svg>
      <iframe
        ref={frameRef}
        className={classes.frame}
        data-revealed={revealed || undefined}
        src={MUSIC_VIDEO_PAGE}
        title="It's Your Turn music video"
        allow="autoplay; fullscreen"
      />
      <div className={classes.ring} data-revealed={revealed || undefined} />
      {waiting && (
        <svg className={classes.progress} width="64" height="64" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="26" className={classes.progressTrack} />
          <circle cx="32" cy="32" r="26" className={classes.progressValue} style={{ strokeDashoffset: `${163 * (1 - progress)}` }} />
        </svg>
      )}
      <button type="button" className={classes.close} onClick={() => closeRef.current()} aria-label="Close music video" title="Close (Esc)">
        <IconX size={16} />
      </button>
    </div>,
    document.body,
  );
}
