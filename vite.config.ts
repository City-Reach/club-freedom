import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
  const loadedEnv = loadEnv(mode, process.cwd(), "");
  Object.assign(process.env, loadedEnv);

  import("./env/client");

  return {
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
    build: {
      sourcemap: true,
    },
  };
});
