import { useLayoutEffect, useRef } from "react";

type Options = {
  enabled: boolean;
  deltaX: number;
  deltaY: number;
  rotateToTrajectory: boolean;
  delayMs: number;
  holdFromMs?: number;
  hideAfterMs?: number;
  startRotationDeg?: number;
  holdRotationDeg?: number;
  parkRotationDeg?: number;
  continuation?: {
    deltaX: number;
    deltaY: number;
    delayMs: number;
    startRotationDeg?: number;
    parkRotationDeg?: number;
  };
};

// A cubic path is visually smooth at this density while avoiding dozens
// of extra keyframe objects for large fleet movements.
const SAMPLE_COUNT = 20;
const NATIVE_NORTHWEST_ANGLE = -135;
// Restrained launch / cruise / braking profile. The curve spends most of its
// time near full speed, but eases cleanly into both ends of the flight.
const FLIGHT_EASING = "cubic-bezier(0.42, 0.05, 0.2, 1)";

function unwrapAngle(previous: number, next: number): number {
  let unwrapped = next;
  while (unwrapped - previous > 180) unwrapped -= 360;
  while (unwrapped - previous < -180) unwrapped += 360;
  return unwrapped;
}

function flightDuration(deltaX: number, deltaY: number): number {
  const distance = Math.hypot(deltaX, deltaY);
  return Math.min(1500, Math.max(780, 650 + distance * 0.35));
}

function buildFlightKeyframes({
  startX,
  startY,
  endX,
  endY,
  rotateToTrajectory,
  startRotationDeg,
  parkRotationDeg,
}: {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  rotateToTrajectory: boolean;
  startRotationDeg: number;
  parkRotationDeg: number;
}): Keyframe[] {
  const deltaX = endX - startX;
  const deltaY = endY - startY;
  const distance = Math.hypot(deltaX, deltaY);
  const perpendicularX = distance === 0 ? 0 : -deltaY / distance;
  const perpendicularY = distance === 0 ? 0 : deltaX / distance;
  const bend = Math.min(150, Math.max(36, distance * 0.17));
  const bendDirection = deltaX > 0 || (deltaX === 0 && deltaY >= 0) ? 1 : -1;
  const launchLead = Math.min(
    54,
    Math.max(14, distance * 0.09),
    distance * 0.18,
  );
  const launchAngle =
    ((NATIVE_NORTHWEST_ANGLE + startRotationDeg) * Math.PI) / 180;
  const control1X =
    startX +
    (rotateToTrajectory
      ? Math.cos(launchAngle) * launchLead
      : deltaX * 0.22 + perpendicularX * bend * bendDirection * 0.35);
  const control1Y =
    startY +
    (rotateToTrajectory
      ? Math.sin(launchAngle) * launchLead
      : deltaY * 0.22 + perpendicularY * bend * bendDirection * 0.35);
  const control2X =
    startX + deltaX * 0.58 + perpendicularX * bend * bendDirection;
  const control2Y =
    startY + deltaY * 0.58 + perpendicularY * bend * bendDirection;

  let previousTrajectoryRotation = startRotationDeg;
  let landingParkedRotation: number | undefined;
  return Array.from({ length: SAMPLE_COUNT + 1 }, (_, index) => {
    const t = index / SAMPLE_COUNT;
    const inverseT = 1 - t;
    const x =
      inverseT ** 3 * startX +
      3 * inverseT * inverseT * t * control1X +
      3 * inverseT * t * t * control2X +
      t ** 3 * endX;
    const y =
      inverseT ** 3 * startY +
      3 * inverseT * inverseT * t * control1Y +
      3 * inverseT * t * t * control2Y +
      t ** 3 * endY;
    const tangentX =
      3 * inverseT * inverseT * (control1X - startX) +
      6 * inverseT * t * (control2X - control1X) +
      3 * t * t * (endX - control2X);
    const tangentY =
      3 * inverseT * inverseT * (control1Y - startY) +
      6 * inverseT * t * (control2Y - control1Y) +
      3 * t * t * (endY - control2Y);
    const trajectoryAngle = (Math.atan2(tangentY, tangentX) * 180) / Math.PI;
    const targetRotation = rotateToTrajectory
      ? trajectoryAngle - NATIVE_NORTHWEST_ANGLE
      : 0;
    const trajectoryRotation =
      index === 0
        ? startRotationDeg
        : unwrapAngle(previousTrajectoryRotation, targetRotation);
    previousTrajectoryRotation = trajectoryRotation;

    const departureProgress = Math.min(1, t / 0.18);
    const easedDeparture =
      departureProgress * departureProgress * (3 - 2 * departureProgress);
    const unwrappedTrajectoryRotation =
      departureProgress < 1
        ? unwrapAngle(startRotationDeg, trajectoryRotation)
        : trajectoryRotation;
    const bankedTrajectoryRotation =
      startRotationDeg +
      (unwrappedTrajectoryRotation - startRotationDeg) * easedDeparture;

    const landingProgress = Math.max(0, Math.min(1, (t - 0.78) / 0.22));
    const easedLanding =
      landingProgress * landingProgress * (3 - 2 * landingProgress);
    if (landingProgress > 0 && landingParkedRotation === undefined) {
      landingParkedRotation = unwrapAngle(trajectoryRotation, parkRotationDeg);
    }
    const parkedRotation = landingParkedRotation ?? bankedTrajectoryRotation;
    const rotation = rotateToTrajectory
      ? bankedTrajectoryRotation +
        (parkedRotation - bankedTrajectoryRotation) * easedLanding
      : 0;

    return {
      offset: t,
      opacity: 1,
      transform: `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${rotation}deg)`,
    };
  });
}

/**
 * Runs a cancellable, React-lifecycle-owned flight animation along a cubic
 * Bézier. Unit artwork natively points northwest, so ship rotation is offset
 * from that angle to follow the path tangent. Badge and ground-unit stacks
 * follow the same path while remaining upright.
 */
export function useMapFlightAnimation({
  enabled,
  deltaX,
  deltaY,
  rotateToTrajectory,
  delayMs,
  holdFromMs,
  hideAfterMs,
  startRotationDeg = 0,
  holdRotationDeg,
  parkRotationDeg = 0,
  continuation,
}: Options) {
  const elementRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = elementRef.current;
    if (!enabled || !element) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const keyframes = buildFlightKeyframes({
      startX: 0,
      startY: 0,
      endX: deltaX,
      endY: deltaY,
      rotateToTrajectory,
      startRotationDeg,
      parkRotationDeg,
    });

    const holdAnimation =
      holdFromMs !== undefined
        ? element.animate(
            [
              { opacity: 0 },
              {
                opacity: 1,
                transform: `translate(-50%, -50%) rotate(${holdRotationDeg ?? startRotationDeg}deg)`,
              },
            ],
            {
              duration: 1,
              delay: holdFromMs,
              fill: "forwards",
            },
          )
        : undefined;
    const animation = element.animate(keyframes, {
      duration: flightDuration(deltaX, deltaY),
      delay: delayMs,
      easing: FLIGHT_EASING,
      fill: "forwards",
    });
    const continuationKeyframes = continuation
      ? buildFlightKeyframes({
          startX: deltaX,
          startY: deltaY,
          endX: continuation.deltaX,
          endY: continuation.deltaY,
          rotateToTrajectory,
          startRotationDeg: continuation.startRotationDeg ?? parkRotationDeg,
          parkRotationDeg: continuation.parkRotationDeg ?? 0,
        })
      : undefined;
    const continuationAnimation =
      continuation && continuationKeyframes
        ? element.animate(continuationKeyframes, {
            duration: flightDuration(
              continuation.deltaX - deltaX,
              continuation.deltaY - deltaY,
            ),
            delay: continuation.delayMs,
            easing: FLIGHT_EASING,
            fill: "forwards",
          })
        : undefined;
    let disposed = false;
    const commitFinishedFlight = (
      finishedAnimation: Animation,
      finishedKeyframes: Keyframe[],
    ) => {
      void finishedAnimation.finished.then(
        () => {
          if (disposed) return;
          element.style.opacity = "1";
          element.style.transform = String(finishedKeyframes.at(-1)?.transform);
          element.style.willChange = "auto";
          element.style.filter = "none";
          finishedAnimation.cancel();
          holdAnimation?.cancel();
        },
        () => {},
      );
    };
    commitFinishedFlight(animation, keyframes);
    if (continuationAnimation && continuationKeyframes)
      commitFinishedFlight(continuationAnimation, continuationKeyframes);
    const hideTimer =
      hideAfterMs === undefined
        ? undefined
        : window.setTimeout(() => {
            element.style.visibility = "hidden";
          }, hideAfterMs);
    return () => {
      disposed = true;
      animation.cancel();
      continuationAnimation?.cancel();
      holdAnimation?.cancel();
      if (hideTimer !== undefined) window.clearTimeout(hideTimer);
      element.style.opacity = "";
      element.style.transform = "";
      element.style.willChange = "";
      element.style.filter = "";
      element.style.visibility = "";
    };
  }, [
    enabled,
    deltaX,
    deltaY,
    rotateToTrajectory,
    delayMs,
    holdFromMs,
    hideAfterMs,
    startRotationDeg,
    holdRotationDeg,
    parkRotationDeg,
    continuation?.deltaX,
    continuation?.deltaY,
    continuation?.delayMs,
    continuation?.startRotationDeg,
    continuation?.parkRotationDeg,
  ]);

  return elementRef;
}
