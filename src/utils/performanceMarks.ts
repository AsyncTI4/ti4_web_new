type PerformanceDetail = Record<string, unknown>;

let spanId = 0;

function isPerformanceInstrumentationEnabled() {
  if (import.meta.env.DEV) return true;
  if (typeof window === "undefined") return false;

  return (
    window.location.search.includes("perf=1") ||
    window.localStorage.getItem("ti4Perf") === "1"
  );
}

function supportsPerformanceMarks() {
  return (
    isPerformanceInstrumentationEnabled() &&
    typeof performance !== "undefined" &&
    typeof performance.mark === "function" &&
    typeof performance.measure === "function"
  );
}

function mark(name: string, detail?: PerformanceDetail) {
  try {
    performance.mark(name, detail === undefined ? undefined : { detail });
  } catch {
    performance.mark(name);
  }
}

function measure(
  name: string,
  start: string | number,
  end: string | number,
  detail?: PerformanceDetail,
) {
  try {
    performance.measure(
      name,
      detail === undefined ? { start, end } : { start, end, detail },
    );
  } catch {
    if (typeof start === "string" && typeof end === "string") {
      performance.measure(name, start, end);
    }
  }
}

export function startPerformanceSpan(
  name: string,
  detail?: PerformanceDetail,
): (endDetail?: PerformanceDetail) => void {
  if (!supportsPerformanceMarks()) {
    return () => {};
  }

  const id = `${name}-${++spanId}`;
  const startMark = `${id}:start`;
  const endMark = `${id}:end`;

  mark(startMark, detail);

  return (endDetail?: PerformanceDetail) => {
    const mergedDetail = { ...detail, ...endDetail };
    mark(endMark, mergedDetail);
    measure(name, startMark, endMark, mergedDetail);
    performance.clearMarks(startMark);
    performance.clearMarks(endMark);
  };
}

export function recordPerformanceMeasure(
  name: string,
  start: number,
  end: number,
  detail?: PerformanceDetail,
) {
  if (!supportsPerformanceMarks()) {
    return;
  }

  measure(name, start, end, detail);
}
