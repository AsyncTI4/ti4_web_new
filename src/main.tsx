import "@mantine/core/styles.css";
import "./styles/fonts.css";
import "./styles/gradients.css";
import "./styles/theme.css";
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
  MantineProvider,
  MantineColorsTuple,
} from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LoginPage, { loginLoader } from "./LoginPage";
import FrogGamePage from "./image-map/pages/FrogGamePage";
import LandingPage from "./LandingPage";
import MapTogglePage from "./MapTogglePage";
import { SystemTilePage } from "./domains/map/components/SystemTilePage/SystemTilePage";
import { isMobileDevice } from "./utils/isTouchDevice";
import DashboardPage from "./domains/dashboard/DashboardPage";
import { useUser } from "./hooks/useUser";

const queryClient = new QueryClient();

const RedirectToGame = () => {
  const { mapid } = useParams<{ mapid: string }>();
  return <Navigate to={`/game/${mapid}`} replace />;
};

const RootRoute = () => {
  const { user } = useUser();
  const isAuthenticated = Boolean(user?.authenticated && user?.token);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <LandingPage />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootRoute />,
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
    path: "/game/:mapid/newui",
    element: <RedirectToGame />,
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
  headings: {
    fontFamily: "Slider, sans-serif",
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
});

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
