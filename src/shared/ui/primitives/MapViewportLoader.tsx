import type { HTMLAttributes } from "react";
import { useMantineTheme } from "@mantine/core";
import { Atom } from "react-loading-indicators";

import { MapViewportCenter } from "../MapViewportCenter";

export type MapViewportLoaderProps = HTMLAttributes<HTMLDivElement> & {
  label?: string;
};

export function MapViewportLoader({ label = "Loading", ...rest }: MapViewportLoaderProps) {
  const theme = useMantineTheme();

  return (
    <MapViewportCenter {...rest}>
      <Atom color={theme.colors.blue[5]} size="large" text={label} />
    </MapViewportCenter>
  );
}
