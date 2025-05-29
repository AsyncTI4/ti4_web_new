import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
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
