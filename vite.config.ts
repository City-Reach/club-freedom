import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  server: {
    port: 3000,
    host: "0.0.0.0",
    https: {
      key: "./certificates/dev-key.pem",
      cert: "./certificates/dev.pem",
    },
  },
  plugins: [
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    tailwindcss(),
    tsconfigPaths(),
    tanstackStart({
      srcDirectory: "app",
      router: {
        routesDirectory: "routes",
      },
    }),
    viteReact(),
  ],
});
