import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

const ReactCompilerConfig = {
  target: "19",
};

// https://vitejs.dev/config/
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
      "@": path.resolve(__dirname, "./src"),
    },
  },
  assetsInclude: ["**/*.woff", "**/*.woff2", "**/*.ttf", "**/*.otf"],
  server: {
    proxy: {
      "/proxy": {
        target: "https://ti4.westaddisonheavyindustries.com",
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
