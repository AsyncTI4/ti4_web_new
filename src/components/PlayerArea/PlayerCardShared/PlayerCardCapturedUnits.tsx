import { Box, type BoxProps } from "@mantine/core";
import type { ComponentProps, ReactNode } from "react";
import type { PlayerData } from "@/data/types";
import { Nombox } from "../../Nombox";

export type PlayerCardCapturedUnitsProps = {
  nombox?: PlayerData["nombox"];
  wrapperProps?: BoxProps;
  nomboxProps?: Omit<ComponentProps<typeof Nombox>, "capturedUnits">;
  children?: (nombox: NonNullable<PlayerData["nombox"]>) => ReactNode;
};

export function PlayerCardCapturedUnits({
  nombox,
  wrapperProps,
  nomboxProps,
  children,
}: PlayerCardCapturedUnitsProps) {
  if (!nombox || Object.keys(nombox).length === 0) {
    return null;
  }

  if (children) {
    return <>{children(nombox)}</>;
  }

  return (
    <Box mt="md" {...wrapperProps}>
      <Nombox capturedUnits={nombox} {...nomboxProps} />
    </Box>
  );
}
