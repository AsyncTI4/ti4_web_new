import "@mantine/core/styles.css";
import "./styles/fonts.css";
import "./styles/gradients.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import GamePage from "./GamePage";
import GamesPage from "./GamesPage";
import { createTheme, darken, MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LoginPage, { loginLoader } from "./LoginPage";
import FrogGamePage from "./FrogGamePage";
import PlayerAreasPage from "./PlayerAreasPage";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <GamesPage />,
  },
  {
    path: "/game/:mapid",
    element: <GamePage />,
  },
  {
    path: "/game/:gameId/playerAreas",
    element: <PlayerAreasPage />,
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
]);

const myColor = [
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
    blueGray: myColor,
  },
  // fontFamily: "Slider, sans-serif",
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
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <MantineProvider forceColorScheme="dark" theme={theme}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </MantineProvider>
  </React.StrictMode>
);
