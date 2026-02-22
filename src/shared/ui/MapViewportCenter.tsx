import type { HTMLAttributes, PropsWithChildren } from "react";

/**
 * Consistent flex container that centers content inside the map viewport height.
 */
export function MapViewportCenter({
  children,
  style,
  ...rest
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "var(--map-viewport-height)",
        width: "100%",
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
