import { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { Player, type PlayerRef } from "@remotion/player";
import { MusicVideo } from "../video/MusicVideo";
import { compositionFor } from "../video/lib/stage";
import { FPS, TOTAL_FRAMES } from "../video/lib/timing";
import { fontsReady } from "../video/lib/fonts";
import { seedImage } from "../video/lib/useImages";
import { setCast, G } from "../video/lib/game";
import { neededSprites } from "../video/lib/spriteSet";
import { markBroken, registerSprite } from "../video/lib/assets";
import { PREFETCH_URLS } from "../assetUrls";
import { commandTokenUrl, unitSpriteFallbackUrl, unitSpriteUrl } from "../castAssets";
import type { MusicVideoCast } from "../cast";
import { isMusicVideoMessage, type AppToFrame, type FrameToApp } from "../protocol";

const embedded = window.parent !== window;
/** Load milestones (ms since the page started), read by test scripts in dev. */
const timings: Record<string, number> = {};
const mark = (name: string) => (timings[name] = Math.round(performance.now()));
if (import.meta.env.DEV) (window as unknown as { __ti4mvTimings?: Record<string, number> }).__ti4mvTimings = timings;
mark("script");
const params = new URLSearchParams(location.search);
const captureMode = import.meta.env.DEV && params.has("capture");

function post(message: FrameToApp) {
  if (embedded) window.parent.postMessage(message, location.origin);
}

/** The app sends the live game once we say hello; opened on its own, the page plays a stand-in cast. */
function receiveCast(): Promise<MusicVideoCast> {
  if (!embedded) return import("./defaultCast").then((m) => m.defaultCast());
  return new Promise((resolve) => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== location.origin || !isMusicVideoMessage<AppToFrame>(event.data)) return;
      if (event.data.type !== "ti4mv:cast") return;
      window.removeEventListener("message", onMessage);
      resolve(event.data.cast);
    };
    window.addEventListener("message", onMessage);
    post({ type: "ti4mv:hello" });
  });
}

/* Decoded images are held for the life of this page so playback never waits on a
   decode. The page lives in an iframe that the app removes on close, which hands
   all of this memory (and the GPU textures) back in one go. */
const decoded: HTMLImageElement[] = [];
const IMAGE = /\.(png|webp|jpe?g|gif)$/i;

async function decode(url: string): Promise<boolean> {
  const img = new Image();
  img.src = url;
  try {
    await img.decode();
  } catch {
    return false;
  }
  decoded.push(img);
  seedImage(url, img);
  return true;
}

/** Everything the cast needs on screen: bundled art, the board, faces, and each sprite (4x, else native). */
function preloadJobs(): (() => Promise<void>)[] {
  const jobs: (() => Promise<void>)[] = [];
  const images = new Set<string>(PREFETCH_URLS.filter((url) => IMAGE.test(url.split("?")[0])));
  G.tiles.forEach((tile) => images.add(tile.image));
  for (const p of G.players) {
    images.add(p.icon);
    Object.values(p.leaders).forEach((url) => url && images.add(url));
    if (p.stats) {
      images.add(commandTokenUrl("command", p.color));
      images.add(commandTokenUrl("fleet", p.color));
    }
  }
  images.add(commandTokenUrl("command", G.afk.color));
  images.forEach((url) => jobs.push(async () => {
    if (!(await decode(url))) markBroken(url);
  }));
  for (const [color, unit] of neededSprites()) {
    jobs.push(async () => {
      const crisp = unitSpriteUrl(color, unit);
      if (await decode(crisp)) return registerSprite(color, unit, { src: crisp, native: false });
      const native = unitSpriteFallbackUrl(color, unit);
      if (await decode(native)) registerSprite(color, unit, { src: native, native: true });
    });
  }
  return jobs;
}

async function preload(onProgress: (p: number) => void) {
  const queue = preloadJobs();
  const total = queue.length + 1;
  let done = 0;
  const worker = async () => {
    for (let job = queue.shift(); job; job = queue.shift()) {
      await job();
      onProgress(++done / total);
    }
  };
  await Promise.all(Array.from({ length: 16 }, worker));
  await fontsReady;
  onProgress(1);
}

const SILENCE = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=";
async function audioAllowed() {
  try {
    const probe = new Audio(SILENCE);
    await probe.play();
    probe.pause();
    return true;
  } catch {
    return false;
  }
}

/** The composition follows the window's shape so the video fills it exactly (see lib/stage). */
function useComposition() {
  const [comp, setComp] = useState(() => compositionFor(window.innerWidth, window.innerHeight));
  useEffect(() => {
    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const next = compositionFor(window.innerWidth, window.innerHeight);
        setComp((prev) => (prev.width === next.width && prev.height === next.height ? prev : next));
      });
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);
  return comp;
}

function App() {
  const player = useRef<PlayerRef>(null);
  const comp = useComposition();
  const inputProps = useMemo(() => ({ bleedX: comp.bleed.x, bleedY: comp.bleed.y }), [comp]);
  const [ready, setReady] = useState(false);
  const [needsClick, setNeedsClick] = useState(false);

  useEffect(() => {
    let lastSent = 0;
    void receiveCast()
      .then((cast) => {
        mark("cast");
        setCast(cast);
        if (import.meta.env.DEV) {
          const name = (i: number) => `${cast.players[i].name} (${cast.players[i].faction}/${cast.players[i].color})`;
          (window as unknown as { __ti4mvCast?: unknown }).__ti4mvCast = {
            game: cast.game, round: cast.round, phase: cast.phase, afk: name(cast.afk), hero: name(cast.hero),
            heroPos: cast.heroPos, crushPos: cast.crushPos, afkHome: cast.players[cast.afk].home, six: cast.six.map(name),
            tiles: cast.tiles.length, units: cast.tiles.reduce((n, t) => n + t.units.length, 0),
          };
        }
        return preload((p) => {
          if (p - lastSent >= 0.02 || p === 1) {
            lastSent = p;
            post({ type: "ti4mv:progress", progress: p });
          }
        });
      })
      .then(() => {
        mark("decoded");
        setReady(true);
      });
  }, []);

  useEffect(() => {
    // Dev builds (and benchmark builds made with VITE_TI4MV_BENCH) expose the player so test
    // scripts can seek; normal production builds never do.
    if ((import.meta.env.DEV || import.meta.env.VITE_TI4MV_BENCH) && ready) (window as unknown as { __ti4mv?: PlayerRef | null }).__ti4mv = player.current;
  }, [ready]);

  // A play request that arrives before the player has mounted waits here instead of being dropped.
  const pendingPlay = useRef(false);
  const startRef = useRef<() => Promise<void>>(async () => {});

  useEffect(() => {
    const start = async () => {
      const p = player.current;
      if (!p) {
        pendingPlay.current = true;
        return;
      }
      p.seekTo(0);
      if (await audioAllowed()) {
        p.play();
      } else {
        setNeedsClick(true);
        post({ type: "ti4mv:needs-click" });
      }
    };
    startRef.current = start;
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== location.origin || !isMusicVideoMessage<AppToFrame>(event.data)) return;
      if (event.data.type === "ti4mv:play") void start();
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") post({ type: "ti4mv:close" });
    };
    window.addEventListener("message", onMessage);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("message", onMessage);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    const p = player.current;
    if (!p) return;
    const onEnded = () => post({ type: "ti4mv:ended" });
    const onPlay = () => setNeedsClick(false);
    p.addEventListener("ended", onEnded);
    p.addEventListener("play", onPlay);
    // Read-only frame probe for automated checks.
    (window as unknown as { __ti4mvFrame?: () => number }).__ti4mvFrame = () => p.getCurrentFrame();
    // Only now, with the player mounted, can the app reveal us and ask for playback.
    mark("ready");
    post({ type: "ti4mv:ready" });
    if (pendingPlay.current) {
      pendingPlay.current = false;
      void startRef.current();
    }
    return () => {
      p.removeEventListener("ended", onEnded);
      p.removeEventListener("play", onPlay);
    };
  }, [ready]);

  // The scenes read the cast while rendering, so nothing mounts until it has arrived and decoded.
  if (!ready) return null;
  return (
    <>
      {/* The composition matches the window's aspect, so this is exactly 100vw x 100vh (only
          windows beyond 4:3 or 21:9 get a sliver cropped). No letterbox, no chrome. */}
      <div style={{ position: "fixed", left: "50%", top: "50%", width: `max(100vw, calc(100vh * ${comp.width} / ${comp.height}))`, aspectRatio: `${comp.width} / ${comp.height}`, transform: "translate(-50%, -50%)" }}>
        <Player
          ref={player}
          component={MusicVideo}
          durationInFrames={TOTAL_FRAMES}
          fps={FPS}
          compositionWidth={comp.width}
          compositionHeight={comp.height}
          inputProps={inputProps}
          style={{ width: "100%", height: "100%" }}
          controls={false}
          clickToPlay={false}
          spaceKeyToPlayOrPause={false}
          doubleClickToFullscreen={false}
          acknowledgeRemotionLicense
          autoPlay={!embedded && ready && !captureMode}
        />
      </div>
      {needsClick && (
        <button
          type="button"
          onClick={() => {
            setNeedsClick(false);
            player.current?.play();
          }}
          style={{ position: "fixed", left: "50%", top: "50%", transform: "translate(-50%, -50%)", padding: "18px 34px", border: "1px solid rgba(255,255,255,.3)", borderRadius: 999, background: "rgba(8,10,20,.8)", color: "#e8ecff", fontFamily: "Slider, sans-serif", fontSize: 24, letterSpacing: "0.16em", cursor: "pointer" }}
        >
          ▶ PLAY
        </button>
      )}
    </>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
