import "./FullScreenLoader.css";

import { useMantineTheme } from "@mantine/core";
import { Atom } from "react-loading-indicators";

export function FullScreenLoader() {
  const theme = useMantineTheme();
  return (
    <div className="full-screen-loader">
      <Atom color={theme.colors.blue[5]} size="large" text="Loading" />
    </div>
  );
}
