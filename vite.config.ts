import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

const ReactCompilerConfig = {
  target: "19",
  // The music video is a frame-accurate render loop tuned without the compiler.
  sources: (filename: string) => !filename.includes("/src/music-video/"),
};

/*
 * Rollup's property-path tree-shaking spends ~5 minutes analysing react-dom's single-file
 * production bundle (89% of the build), only to keep nearly all of it. Including React whole
 * cuts the build to ~1 minute with byte-identical output.
 */
const includeReactWhole: Plugin = {
  name: "include-react-whole",
  enforce: "post",
  transform(code, id) {
    if (/node_modules\/(react|react-dom|scheduler)\//.test(id)) {
      return { code, map: null, moduleSideEffects: "no-treeshake" };
    }
  },
};

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler", ReactCompilerConfig]],
      },
    }),
    includeReactWhole,
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
