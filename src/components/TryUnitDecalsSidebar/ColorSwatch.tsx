import React from "react";
import { Box, Text } from "@mantine/core";
import { getColorValues } from "@/lookup/colors";
import classes from "../TryUnitDecalsSidebar.module.css";

type Color = {
  alias: string;
  name?: string;
  displayName?: string;
  primaryColor?: string;
  primaryColorRef?: string;
  secondaryColor?: string;
  secondaryColorRef?: string;
};

type Props = {
  color: Color;
  isSelected: boolean;
  onClick: () => void;
};

export function ColorSwatch({ color, isSelected, onClick }: Props) {
  const primaryColorValues = getColorValues(
    color.primaryColorRef,
    color.primaryColor
  );
  const secondaryColorValues = getColorValues(
    color.secondaryColorRef,
    color.secondaryColor
  );

  let backgroundStyle: React.CSSProperties = {};
  if (primaryColorValues && secondaryColorValues) {
    // Gradient color
    const {
      red: primaryRed,
      green: primaryGreen,
      blue: primaryBlue,
    } = primaryColorValues;
    const {
      red: secondaryRed,
      green: secondaryGreen,
      blue: secondaryBlue,
    } = secondaryColorValues;
    backgroundStyle.background = `linear-gradient(135deg, rgb(${primaryRed}, ${primaryGreen}, ${primaryBlue}) 0%, rgb(${primaryRed}, ${primaryGreen}, ${primaryBlue}) 30%, rgb(${secondaryRed}, ${secondaryGreen}, ${secondaryBlue}) 70%, rgb(${secondaryRed}, ${secondaryGreen}, ${secondaryBlue}) 100%)`;
  } else if (primaryColorValues) {
    // Basic color
    const { red, green, blue } = primaryColorValues;
    backgroundStyle.background = `rgb(${red}, ${green}, ${blue})`;
  }

  return (
    <Box
      className={`${classes.colorItem} ${isSelected ? classes.selected : ""}`}
      onClick={onClick}
      style={backgroundStyle}
    >
      <Box className={classes.colorBadge}>
        <Text size="xs" fw={600} c="white">
          {color.displayName || color.name}
        </Text>
      </Box>
    </Box>
  );
}

