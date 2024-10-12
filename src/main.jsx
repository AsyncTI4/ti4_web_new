import "@mantine/core/styles.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import GamePage from "./GamePage";
import GamesPage from "./GamesPage";
import { MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LoginPage, { loginLoader } from "./LoginPage";
import FrogGamePage from "./FrogGamePage";

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
    path: "/froggame/:discordid/:mapid",
    element: <FrogGamePage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
    loader: loginLoader,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <MantineProvider forceColorScheme="dark">
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </MantineProvider>
  </React.StrictMode>
);
