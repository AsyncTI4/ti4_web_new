import { loadFont } from "@remotion/fonts";
import { loadFont as loadPlexSans } from "@remotion/google-fonts/IBMPlexSans";
import { loadFont as loadPlexMono } from "@remotion/google-fonts/IBMPlexMono";
import { loadFont as loadNoto } from "@remotion/google-fonts/NotoSans";
import { loadFont as loadMonoton } from "@remotion/google-fonts/Monoton";
import { assetUrl } from "../../assetUrls";

const pending: Promise<unknown>[] = [];
const track = (loading: Promise<unknown> | { waitUntilDone: () => Promise<unknown> }) => {
  pending.push("waitUntilDone" in loading ? loading.waitUntilDone() : loading);
};

/** Slider is the async TI4 display face, self-hosted by the web app. */
track(loadFont({ family: "Slider", url: assetUrl("fonts/slider.woff2"), weight: "400" }));
track(loadPlexSans("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] }));
track(loadPlexSans("italic", { weights: ["700"], subsets: ["latin"] }));
track(loadPlexMono("normal", { weights: ["400", "500", "700"], subsets: ["latin"] }));
track(loadNoto("normal", { weights: ["400", "500", "600", "700", "800"], subsets: ["latin"] }));
track(loadMonoton("normal", { weights: ["400"], subsets: ["latin"] }));
track(loadFont({ family: "Noto Emoji", url: assetUrl("fonts/NotoEmoji-Regular.ttf"), weight: "400" }));

/** Resolves once every face above has loaded (or failed). */
export const fontsReady: Promise<void> = Promise.allSettled(pending).then(() => undefined);

export const FONT = {
  display: "Slider, 'IBM Plex Sans', sans-serif",
  text: "'IBM Plex Sans', system-ui, sans-serif",
  mono: "'IBM Plex Mono', ui-monospace, monospace",
  discord: "'Noto Sans', 'IBM Plex Sans', sans-serif",
  neon: "Monoton, Slider, sans-serif",
};
