import { Box, Text, BoxProps } from "@mantine/core";
import classes from "./Surface.module.css";

type PatternType = "none" | "grid" | "circle";

type Props = BoxProps & {
  children: React.ReactNode;
  pattern?: PatternType;
  label?: string;
  labelColor?: string;
  cornerAccents?: boolean;
};

export function Surface({
  children,
  pattern = "none",
  label,
  labelColor = "blueGray.3",
  cornerAccents = false,
  ...boxProps
}: Props) {
  const getPatternClass = () => {
    switch (pattern) {
      case "grid":
        return classes.gridPattern;
      case "circle":
        return classes.circlePattern;
      default:
        return "";
    }
  };

  return (
    <Box
      {...boxProps}
      className={`${classes.surface} ${boxProps.className || ""}`}
      style={boxProps.style}
    >
      {label && (
        <Text className={classes.label} c={labelColor}>
          {label}
        </Text>
      )}

      {pattern !== "none" && (
        <Box className={`${classes.patternOverlay} ${getPatternClass()}`} />
      )}

      {cornerAccents && (
        <>
          <Box
            className={`${classes.cornerAccent} ${classes.cornerAccentTopLeft}`}
          />
          <Box
            className={`${classes.cornerAccent} ${classes.cornerAccentTopRight}`}
          />
          <Box
            className={`${classes.cornerAccent} ${classes.cornerAccentBottomLeft}`}
          />
          <Box
            className={`${classes.cornerAccent} ${classes.cornerAccentBottomRight}`}
          />
        </>
      )}

      {children}
    </Box>
  );
}
