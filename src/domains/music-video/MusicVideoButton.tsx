import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import cx from "clsx";
import { cdnImage } from "@/entities/data/cdnImage";
import { useGameState } from "@/api/useGameState";
import { useUser } from "@/api/auth/useUser";
import { useGameData } from "@/state/useGameContext";
import zoomClasses from "@/shared/ui/map/ZoomControls.module.css";
import { castImageUrls } from "@/music-video/castAssets";
import type { MusicVideoCast } from "@/music-video/cast";
import { DECOR_COLORS } from "@/music-video/palette";
import { buildMusicVideoCast, musicVideoEligible } from "./buildCast";
import { getMusicVideoState, prefetchMusicVideoCast, subscribeMusicVideo } from "./musicVideoPrefetch";
import { MusicVideoOverlay, type Point } from "./MusicVideoOverlay";
import classes from "./MusicVideoButton.module.css";

const DESTROYER = cdnImage("/units/red_dd_eyes.png");

/** A googly-eyed destroyer in the map toolbar that opens the music video, starring this game.
 * Appears (desktop only) once the video and this game's art are cached, someone is taking a
 * turn, and the board is busy enough to supply backup dancers. */
export function MusicVideoButton({ gameId }: { gameId: string }) {
  const { status, warmedCast } = useSyncExternalStore(subscribeMusicVideo, getMusicVideoState);
  const data = useGameData();
  const { data: gameState } = useGameState(gameId);
  const { user } = useUser();
  const [launch, setLaunch] = useState<{ origin: Point; cast: MusicVideoCast } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const eligible = useMemo(() => musicVideoEligible(data, gameState), [data, gameState]);
  const discordId = user?.authenticated ? (user.discord_id ?? null) : null;

  const castKey = data ? `${data.gameName}:${data.gameRound}` : "";

  // Warm this game's art in the background so the video opens without a wait.
  useEffect(() => {
    if (!eligible || !data || status !== "ready") return;
    prefetchMusicVideoCast(castKey, () => {
      const preview = buildMusicVideoCast(data, gameState, discordId);
      return preview ? castImageUrls(preview, DECOR_COLORS) : [];
    });
  }, [eligible, data, gameState, discordId, status, castKey]);

  // Once open, game updates (a new round, units moving) must not unmount the video mid-song.
  if (!data || (!launch && (status !== "ready" || warmedCast !== castKey || !eligible))) return null;
  const open = launch !== null;
  const start = () => {
    const cast = buildMusicVideoCast(data, gameState, discordId);
    if (!cast) return;
    const rect = buttonRef.current?.getBoundingClientRect();
    const origin = rect ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 } : { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    setLaunch({ origin, cast });
  };
  return (
    <>
      <button
        type="button"
        className={cx(zoomClasses.zoomButton, classes.button, open && zoomClasses.zoomButtonActive)}
        aria-label="It's your turn: play the music video"
        title="It's your turn ♪"
        ref={buttonRef}
        onClick={start}
      >
        <img className={classes.destroyer} src={DESTROYER} alt="" />
        <span className={classes.note} aria-hidden="true">♪</span>
      </button>
      {launch && <MusicVideoOverlay origin={launch.origin} cast={launch.cast} onClose={() => setLaunch(null)} />}
    </>
  );
}
