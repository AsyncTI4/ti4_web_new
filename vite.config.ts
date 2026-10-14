import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

const ReactCompilerConfig = {
  target: "19",
  // The music video is a frame-accurate render loop tuned without the compiler.
  sources: (filename: string) => !filename.includes("/src/music-video/"),
};

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler", ReactCompilerConfig]],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  assetsInclude: ["**/*.woff", "**/*.woff2", "**/*.ttf", "**/*.otf"],
  build: {
    rollupOptions: {
      // The music video is its own page, loaded into an iframe by the map toolbar.
      input: {
        main: resolve(__dirname, "index.html"),
        musicVideo: resolve(__dirname, "music-video.html"),
      },
    },
  },
  server: {
    proxy: {
      "/bot": {
        target: "https://bot.asyncti4.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/bot/, ""),
      },
      "/proxy": {
        target: "https://asyncti4.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/proxy/, ""),
      },
      "/auth": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/auth/, ""),
      },
    },
  },
});
