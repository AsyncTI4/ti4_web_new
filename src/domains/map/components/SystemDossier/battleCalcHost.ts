import { useEffect, useSyncExternalStore } from "react";

/** The battle calculator the links open first. */
export const BATTLE_CALC_URL = "https://ti4calc.leviatas.com/";

/** The original calculator, used when the first one does not answer. */
const FALLBACK_BATTLE_CALC_URL = "https://ti4battle.com/";

/** How long the probe waits for the calculator before calling it down. */
const PROBE_TIMEOUT_MS = 4000;

/** How long a probe result is trusted before a new dossier checks again. */
const PROBE_TTL_MS = 60_000;

let primaryUp = true;
let checkedAt = 0;
let probing = false;
const listeners = new Set<() => void>();

function settle(up: boolean) {
  probing = false;
  checkedAt = Date.now();
  if (up === primaryUp) return;
  primaryUp = up;
  listeners.forEach((listener) => listener());
}

/**
 * Checks the calculator by loading its favicon. An image only loads when the
 * site itself answers: a proxy error page (e.g. Cloudflare's when the
 * server behind the tunnel is down) fails to decode and counts as down.
 */
function probe() {
  if (probing || Date.now() - checkedAt < PROBE_TTL_MS) return;
  probing = true;

  const image = new Image();
  const timer = window.setTimeout(() => {
    image.src = "";
    settle(false);
  }, PROBE_TIMEOUT_MS);
  const finish = (up: boolean) => {
    window.clearTimeout(timer);
    if (probing) settle(up);
  };
  image.onload = () => finish(true);
  image.onerror = () => finish(false);
  image.src = `${BATTLE_CALC_URL}favicon-32x32.png?probe=${Date.now()}`;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * Returns a function that moves a battle calculator link to ti4battle.com
 * while ti4calc.leviatas.com does not answer. Mounting a component that uses
 * it checks the calculator again, at most once a minute.
 */
export function useBattleCalcHref() {
  const up = useSyncExternalStore(subscribe, () => primaryUp);
  useEffect(probe, []);
  return (url: string): string =>
    up ? url : url.replace(BATTLE_CALC_URL, FALLBACK_BATTLE_CALC_URL);
}
