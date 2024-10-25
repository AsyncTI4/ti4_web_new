import "@mantine/core/styles.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import GamePage from "./GamePage";
import GamesPage from "./GamesPage";
import { createTheme, darken, MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LoginPage, { loginLoader } from "./LoginPage";
import FrogGamePage from "./FrogGamePage";
import LandingPage from "./LandingPage";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/game/:mapid",
    element: <GamePage />,
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

const tomatoBg = [
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

const theme = createTheme({
  colors: {
    tomato: tomatoBg,
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
