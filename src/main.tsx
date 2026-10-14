import "./ds/tokens.css";
import "./ds/base.css";
import "./styles/fonts.css";
import "./styles/gradients.css";
import "./styles/theme.css";
import "./styles/overlays.css";
import "./styles/mobile.css";
import "./styles/zIndexVariables.css";

import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  useParams,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LoginPage, { loginLoader } from "./pages/LoginPage";
import LandingPage from "./pages/LandingPage/LandingPage";
import MapTogglePage from "./pages/MapTogglePage";
import { isMobileDevice } from "./utils/isTouchDevice";
import { getPortalRoot } from "./ds";
import { scheduleMusicVideoPrefetch } from "./domains/music-video";

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
    lazy: () =>
      import("./pages/GamesPage").then((m) => ({ Component: m.default })),
  },
  {
    path: "/dashboard",
    lazy: () =>
      import("./pages/DashboardPage").then((m) => ({ Component: m.default })),
  },
  {
    path: "/dashboard/settings",
    lazy: () =>
      import("./pages/DashboardSettingsPage").then((m) => ({
        Component: m.default,
      })),
  },
  {
    path: "/game/:mapid/newui",
    element: <RedirectToGame />,
  },
  {
    path: "/embed/:mapid/map-only",
    lazy: () =>
      import("./pages/EmbeddedMapPage").then((m) => ({
        Component: m.default,
      })),
  },
  {
    path: "/froggame/:discordid/:mapid",
    lazy: () =>
      import("./pages/image-map/FrogGamePage").then((m) => ({
        Component: m.default,
      })),
  },
  {
    path: "/login",
    element: <LoginPage />,
    loader: loginLoader,
  },
  {
    path: "/system/:systemId",
    lazy: () =>
      import("./domains/map/components/SystemTilePage/SystemTilePage").then(
        (m) => ({ Component: m.SystemTilePage }),
      ),
  },
]);

document.body.classList.toggle("mobile", isMobileDevice());

/*
 * Every overlay portals into this one node (see ds/overlays.tsx), so closed
 * popovers and tooltips never leave a trail of empty divs on <body>.
 */
getPortalRoot();

/*
 * A note for anyone who opens the console. This audience is unusually likely to
 * read the source, so the easter egg is a genuinely useful signpost rather than a
 * joke or a recruiting pitch — the reward for curiosity is knowing where to look.
 */
function printConsoleSignature() {
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
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
);

/* Background-downloads the music video for the map toolbar button (desktop only). */
scheduleMusicVideoPrefetch();
