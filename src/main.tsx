import "@mantine/core/styles.css";
import "./styles/fonts.css";
import "./styles/gradients.css";
import "./styles/theme.css";
import "./styles/overlays.css";
import "./styles/mobile.css";
import "./utils/zIndexVariables.css";

import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  useParams,
} from "react-router-dom";
import GamesPage from "./GamesPage";
import {
  createTheme,
  darken,
  Drawer,
  MantineProvider,
  MantineColorsTuple,
  Modal,
  Tooltip,
} from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LoginPage, { loginLoader } from "./LoginPage";
import FrogGamePage from "./image-map/pages/FrogGamePage";
import LandingPage from "./LandingPage";
import MapTogglePage from "./MapTogglePage";
import { SystemTilePage } from "./domains/map/components/SystemTilePage/SystemTilePage";
import { isMobileDevice } from "./utils/isTouchDevice";
import DashboardPage from "./domains/dashboard/DashboardPage";
import DashboardSettingsPage from "./domains/dashboard/DashboardSettingsPage";
import EmbeddedMapPage from "./EmbeddedMapPage";

const queryClient = new QueryClient();

const RedirectToGame = () => {
  const { mapid } = useParams<{ mapid: string }>();
  return <Navigate to={`/game/${mapid}`} replace />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/game/:mapid",
    element: <MapTogglePage />,
  },
  {
    path: "/games",
    element: <GamesPage />,
  },
  {
    path: "/dashboard",
    element: <DashboardPage />,
  },
  {
    path: "/dashboard/settings",
    element: <DashboardSettingsPage />,
  },
  {
    path: "/game/:mapid/newui",
    element: <RedirectToGame />,
  },
  {
    path: "/embed/:mapid/map-only",
    element: <EmbeddedMapPage />,
  },

  {
    path: "/froggame/:discordid/:mapid",
    element: <FrogGamePage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
    loader: loginLoader,
  },
  {
    path: "/system/:systemId",
    element: <SystemTilePage />,
  },
]);

// Apply global mobile class for mobile devices
if (typeof window !== "undefined") {
  const body = document.body;
  if (isMobileDevice()) {
    body.classList.add("mobile");
  } else {
    body.classList.remove("mobile");
  }
}

const tomatoBg: MantineColorsTuple = [
  darken("#e0dcd8", 0.75),
  darken("#dcd6d0", 0.75),
  darken("#d0c8c0", 0.75),
  darken("#c4bab0", 0.75),
  darken("#b8aca0", 0.75),
  darken("#ac9e90", 0.75),
  darken("#a09080", 0.75),
  darken("#948270", 0.75),
  darken("#887460", 0.75),
  darken("#7c6650", 0.75),
];

const myColor: MantineColorsTuple = [
  darken("#edf5ff", 0.5),
  darken("#e0e6f1", 0.5),
  darken("#c3cad9", 0.5),
  darken("#a3adc1", 0.5),
  darken("#8894ad", 0.5),
  darken("#7685a1", 0.5),
  darken("#6d7d9c", 0.5),
  darken("#5b6b89", 0.5),
  darken("#4f5f7c", 0.5),
  darken("#405270", 0.5),
];

const theme = createTheme({
  colors: {
    tomato: tomatoBg,
    blueGray: myColor,
  },
  /*
   * Type roles come from styles/typography.css so CSS modules and Mantine props
   * cannot drift apart. Slider carries display, IBM Plex Sans every piece of UI
   * text, IBM Plex Mono every numeral.
   */
  fontFamily: "var(--font-text)",
  fontFamilyMonospace: "var(--font-data)",
  headings: {
    fontFamily: "var(--font-display)",
    fontWeight: "600",
  },
  /*
   * Mantine's ladder keeps its original values, expressed in rem so it honours the
   * reader's browser setting. It is NOT remapped onto the semantic roles: `xs` is
   * used in 139 places as the chip/body size, and folding it onto the 10px label
   * role shrank every chip label in the app — the semantic roles are for CSS
   * modules, this ladder is for component props.
   */
  fontSizes: {
    xs: "0.75rem", /*    12 */
    sm: "0.875rem", /*   14 */
    md: "1rem", /*       16 */
    lg: "1.125rem", /*   18 */
    xl: "1.25rem", /*    20 */
  },
  lineHeights: {
    /* xs is the uppercase label role — single line, tight. sm upward can wrap, so
       it takes body leading; light text on a dark field needs the extra air. */
    xs: "var(--lh-tight)",
    sm: "var(--lh-body)",
    md: "var(--lh-body)",
    lg: "var(--lh-body)",
    xl: "var(--lh-body)",
  },
  breakpoints: {
    xs: "36em", // 576px
    sm: "48em", // 768px
    md: "62em", // 992px
    lg: "75em", // 1200px
    xl: "88em", // 1408px
    xl2: "100em", // 1600px - custom
    xl3: "120em", // 1920px - custom
    xl4: "140em", // 2240px - custom
    xl5: "160em", // 2560px - custom
    xl6: "180em", // 2880px - custom
    xl7: "200em", // 3200px - custom
  },
  /* Every floating surface shares the themed details-card chrome
     (see styles/overlays.css) */
  components: {
    Modal: Modal.extend({
      defaultProps: {
        overlayProps: { backgroundOpacity: 0.6, blur: 3 },
      },
      classNames: {
        content: "overlay-modal-content",
        header: "overlay-modal-header",
        title: "overlay-modal-title",
      },
    }),
    Drawer: Drawer.extend({
      defaultProps: {
        overlayProps: { backgroundOpacity: 0.6, blur: 3 },
      },
      classNames: {
        content: "overlay-drawer-content",
        header: "overlay-modal-header",
        title: "overlay-modal-title",
      },
    }),
    Tooltip: Tooltip.extend({
      classNames: { tooltip: "overlay-tooltip" },
    }),
  },
});

/*
 * A note for anyone who opens the console. This audience is unusually likely to
 * read the source, so the easter egg is a genuinely useful signpost rather than a
 * joke or a recruiting pitch — the reward for curiosity is knowing where to look.
 */
function printConsoleSignature() {
  if (typeof console === "undefined") return;
  console.log(
    "%cASYNC TI4%c  fan project for Twilight Imperium\u2122 \u00b7 play-by-Discord",
    "font-weight:700;letter-spacing:0.12em;color:#e2e8f0;background:#0b0b0c;padding:3px 7px;border-radius:2px",
    "color:#868e96"
  );
  console.log(
    "%cPoking around? The board renders from src/domains/map, player areas from src/domains/player, and the whole visual system is documented in DESIGN.md.",
    "color:#6b7280"
  );
}

printConsoleSignature();

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  <React.StrictMode>
    <MantineProvider forceColorScheme="dark" theme={theme}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </MantineProvider>
  </React.StrictMode>,
);
